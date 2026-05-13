import { useEffect, useRef, useState } from 'react';
import {
    getToken,
    updateUser,
    uploadSingleImage,
} from '../../../services';
import {
    getFirstValidPhoneNumber,
    getPhoneNumberFromUserObject,
} from '../profileUtils';

const createEditForm = user => ({
    username: user?.username || '',
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    email: user?.email || '',
    phoneNumber: getPhoneNumberFromUserObject(user),
    profilePicture: user?.profilePicture || '',
});

function useEditProfile({ setUser, user }) {
    const resetUsernameTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const [editing, setEditing] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [editForm, setEditForm] = useState(createEditForm(user));

    useEffect(() => {
        if (user && !editing) {
            setEditForm(createEditForm(user));
        }
    }, [editing, user]);

    useEffect(() => {
        return () => {
            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current);
            }
        };
    }, []);

    const resetEditFormToCurrentUser = () => {
        if (!user) return;

        setEditForm(createEditForm(user));
        setProfilePictureFile(null);
    };

    const openEditModal = () => {
        setSaveError('');
        resetEditFormToCurrentUser();
        setEditing(true);
    };

    const closeEditModal = () => {
        setEditing(false);
        setSaveError('');
        setProfilePictureFile(null);

        if (resetUsernameTimeoutRef.current) {
            clearTimeout(resetUsernameTimeoutRef.current);
            resetUsernameTimeoutRef.current = null;
        }

        resetEditFormToCurrentUser();
    };

    const handleProfilePictureButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfilePictureFileChange = event => {
        const file = event.target.files?.[0] || null;
        setProfilePictureFile(file);

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setEditForm(prev => ({
            ...prev,
            profilePicture: previewUrl,
        }));
    };

    const handleSaveError = (errorMessage, finalProfilePictureUrl) => {
        const normalizedMessage = errorMessage.toLowerCase();
        const isUsernameTakenError =
            normalizedMessage.includes('username') &&
            (
                normalizedMessage.includes('exists') ||
                normalizedMessage.includes('already taken') ||
                normalizedMessage.includes('already exists')
            );

        if (isUsernameTakenError) {
            setSaveError('This username is already taken. Please choose another one.');

            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current);
            }

            resetUsernameTimeoutRef.current = setTimeout(() => {
                setEditForm(prev => ({
                    ...prev,
                    username: user.username || '',
                    profilePicture: finalProfilePictureUrl || user.profilePicture || '',
                }));

                setSaveError('');
                resetUsernameTimeoutRef.current = null;
            }, 3000);
        } else {
            setSaveError(errorMessage);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setSaveError('');
        setIsSaving(true);

        try {
            let finalProfilePictureUrl = user.profilePicture || '';

            if (profilePictureFile) {
                finalProfilePictureUrl = await uploadSingleImage(
                    profilePictureFile,
                    getToken()
                );
            }

            const phoneNumberToSend = getFirstValidPhoneNumber(
                user.phoneNumber,
                user.phone,
                user.telephone,
                user.mobile,
                editForm.phoneNumber
            );

            const bodyToSend = {
                ...user,
                ...editForm,
                id: user.id,
                username: editForm.username,
                fullName: editForm.fullName,
                bio: editForm.bio,
                email: user.email || editForm.email || '',
                profilePicture: finalProfilePictureUrl,
            };

            if (phoneNumberToSend) {
                bodyToSend.phoneNumber = phoneNumberToSend;
            } else {
                delete bodyToSend.phoneNumber;
            }

            const updatedUser = await updateUser({
                token: getToken(),
                userId: user.id,
                userData: bodyToSend,
            });

            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current);
                resetUsernameTimeoutRef.current = null;
            }

            setUser(updatedUser);
            setEditForm(createEditForm(updatedUser));
            setProfilePictureFile(null);
            setSaveError('');
            setEditing(false);
        } catch (error) {
            handleSaveError(
                error.message || 'Cannot connect to backend.',
                user.profilePicture || ''
            );
        } finally {
            setIsSaving(false);
        }
    };

    return {
        editForm,
        editing,
        fileInputRef,
        isSaving,
        profilePictureFile,
        saveError,
        setEditForm,
        closeEditModal,
        handleProfilePictureButtonClick,
        handleProfilePictureFileChange,
        handleSave,
        openEditModal,
    };
}

export default useEditProfile;
