import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ProfileHeader from './profile-page-components/ProfileHeader'
import ProfileInfo from './profile-page-components/ProfileInfo'
import PostsGrid from './profile-page-components/PostsGrid'
import EditProfileModal from './profile-page-components/EditProfileModal'
import FollowModal from './profile-page-components/FollowModal'
import CreatePostModal from '../../components/create-post/CreatePostModal'
import PostCard from '../../components/postcard/Postcard'
import {
    decodeJwtPayload,
    fetchFollowers,
    fetchFollowing,
    fetchPosts,
    fetchUserById,
    fetchUsers,
    getCurrentUserId,
    getToken,
    toggleFollow,
    updateUser,
    uploadSingleImage,
} from '../../services'

const cleanPhoneNumber = value => {
    return String(value || '').replace(/\D/g, '')
}

const getFirstValidPhoneNumber = (...values) => {
    for (const value of values) {
        const digits = cleanPhoneNumber(value)

        if (digits.length >= 10 && digits.length <= 15) {
            return digits
        }
    }

    return ''
}

const getPhoneNumberFromUserObject = userObject => {
    return getFirstValidPhoneNumber(
        userObject?.phoneNumber,
        userObject?.phone,
        userObject?.telephone,
        userObject?.mobile
    )
}


function ProfilePage() {
    const navigate = useNavigate()
    const { targetUsername } = useParams()
    const resetUsernameTimeoutRef = useRef(null)
    const fileInputRef = useRef(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isTogglingFollow, setIsTogglingFollow] = useState(false)
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState(null)
    const [editing, setEditing] = useState(false)
    const [profilePictureFile, setProfilePictureFile] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editForm, setEditForm] = useState({
        username: '',
        fullName: '',
        bio: '',
        email: '',
        phoneNumber: '',
        profilePicture: '',
    })


    const currentUserId = getCurrentUserId()
    const currentUsername = decodeJwtPayload(getToken())?.sub

    const isOwner = user && (
        Number(user.id) === Number(currentUserId) ||
        (!targetUsername && user.username === currentUsername)
    )

    const [followModalType, setFollowModalType] = useState(null)
    const [followUsers, setFollowUsers] = useState([])
    const [loadingFollow, setLoadingFollow] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)



    const getPostImages = post => {
        if (Array.isArray(post.pictureUrls) && post.pictureUrls.length > 0) {
            return post.pictureUrls
        }

        if (post.pictureUrl) return [post.pictureUrl]
        if (post.picture) return [post.picture]
        if (post.imageUrl) return [post.imageUrl]
        if (post.image) return [post.image]

        return []
    }

    const loadFollowCounts = useCallback((userId, token) => {
        fetchFollowers(userId, token)
            .then(data => {
                const uniqueFollowersCount = Array.isArray(data) ? new Set(data.map(u => u.id)).size : 0;
                setFollowersCount(uniqueFollowersCount);

                if (Array.isArray(data)) {
                    const amIFollowing = data.some(u => Number(u.id) === Number(currentUserId));
                    setIsFollowing(amIFollowing);
                }
            })
            .catch(() => setFollowersCount(0))

        fetchFollowing(userId, token)
            .then(data => {
                const uniqueFollowingCount = Array.isArray(data) ? new Set(data.map(u => u.id)).size : 0;
                setFollowingCount(uniqueFollowingCount);
            })
            .catch(() => setFollowingCount(0))
    }, [currentUserId])

    useEffect(() => {
        let cancelled = false

        const loadProfile = async () => {
            const token = getToken()

            if (!token) {
                navigate('/')
                return
            }

            const payload = decodeJwtPayload(token)

            if (!payload) {
                navigate('/')
                return
            }

            const myUsername = payload.sub

            const usernameToLoad = targetUsername || myUsername

            try {
                const [users, allPosts] = await Promise.all([
                    fetchUsers(token),
                    fetchPosts({ token }),
                ])

                const basicUser = users.find(u => u.username === usernameToLoad)

                if (!basicUser) {
                    navigate('/home')
                    return
                }

                let fullUser = basicUser

                try {
                    const userDetails = await fetchUserById(basicUser.id, token)
                    fullUser = {
                        ...basicUser,
                        ...userDetails,
                    }
                } catch {
                    fullUser = basicUser
                }

                if (cancelled) return

                const savedPhoneNumber = getPhoneNumberFromUserObject(fullUser)

                setUser(fullUser)

                setEditForm({
                    username: fullUser.username || '',
                    fullName: fullUser.fullName || '',
                    bio: fullUser.bio || '',
                    email: fullUser.email || '',
                    phoneNumber: savedPhoneNumber,
                    profilePicture: fullUser.profilePicture || '',
                })

                loadFollowCounts(fullUser.id, token)

                const myPosts = allPosts
                    .filter(post => Number(post.userId) === Number(fullUser.id))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setPosts(myPosts)
                setLoading(false)
            } catch {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadProfile()

        return () => {
            cancelled = true
        }
    }, [loadFollowCounts, navigate, targetUsername])

    useEffect(() => {
        return () => {
            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current)
            }
        }
    }, [])

    const resetEditFormToCurrentUser = () => {
        if (!user) return

        const savedPhoneNumber = getPhoneNumberFromUserObject(user)

        setEditForm({
            username: user.username || '',
            fullName: user.fullName || '',
            bio: user.bio || '',
            email: user.email || '',
            phoneNumber: savedPhoneNumber,
            profilePicture: user.profilePicture || '',
        })

        setProfilePictureFile(null)
    }

    const openFollowModal = async type => {
        if (!user) return

        setFollowModalType(type)
        setLoadingFollow(true)
        setFollowUsers([])

        const token = getToken()

        try {
            const data = type === 'followers'
                ? await fetchFollowers(user.id, token)
                : await fetchFollowing(user.id, token)

            setFollowUsers(data)
        } catch (error) {
            console.error('Error fetching follow data:', error)
        } finally {
            setLoadingFollow(false)
        }
    }

    const closeEditModal = () => {
        setEditing(false)
        setSaveError('')
        setProfilePictureFile(null)

        if (resetUsernameTimeoutRef.current) {
            clearTimeout(resetUsernameTimeoutRef.current)
            resetUsernameTimeoutRef.current = null
        }

        resetEditFormToCurrentUser()
    }

    const handleProfilePictureButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleProfilePictureFileChange = e => {
        const file = e.target.files?.[0] || null
        setProfilePictureFile(file)

        if (!file) return

        const previewUrl = URL.createObjectURL(file)

        setEditForm(prev => ({
            ...prev,
            profilePicture: previewUrl,
        }))
    }

    const uploadProfilePicture = async file => {
        return uploadSingleImage(file, getToken())
    }

    const handleSaveError = (errorMessage, finalProfilePictureUrl) => {
        const normalizedMessage = errorMessage.toLowerCase()

        const isUsernameTakenError =
            normalizedMessage.includes('username') &&
            (
                normalizedMessage.includes('exists') ||
                normalizedMessage.includes('already taken') ||
                normalizedMessage.includes('already exists')
            )

        if (isUsernameTakenError) {
            setSaveError('This username is already taken. Please choose another one.')

            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current)
            }

            resetUsernameTimeoutRef.current = setTimeout(() => {
                setEditForm(prev => ({
                    ...prev,
                    username: user.username || '',
                    profilePicture: finalProfilePictureUrl || user.profilePicture || '',
                }))

                setSaveError('')
                resetUsernameTimeoutRef.current = null
            }, 3000)
        } else {
            setSaveError(errorMessage)
        }
    }

    const handleSave = async () => {
        if (!user) return

        setSaveError('')
        setIsSaving(true)

        const token = getToken()

        try {
            let finalProfilePictureUrl = user.profilePicture || ''

            if (profilePictureFile) {
                finalProfilePictureUrl = await uploadProfilePicture(profilePictureFile)
            }

            const phoneNumberToSend = getFirstValidPhoneNumber(
                user.phoneNumber,
                user.phone,
                user.telephone,
                user.mobile,
                editForm.phoneNumber
            )

            const bodyToSend = {
                ...user,
                ...editForm,
                id: user.id,
                username: editForm.username,
                fullName: editForm.fullName,
                bio: editForm.bio,
                email: user.email || editForm.email || '',
                profilePicture: finalProfilePictureUrl,
            }

            if (phoneNumberToSend) {
                bodyToSend.phoneNumber = phoneNumberToSend
            } else {
                delete bodyToSend.phoneNumber
            }

            const updatedUser = await updateUser({
                token,
                userId: user.id,
                userData: bodyToSend,
            })
            const updatedPhoneNumber = getPhoneNumberFromUserObject(updatedUser)

            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current)
                resetUsernameTimeoutRef.current = null
            }

            setUser(updatedUser)

            setEditForm({
                username: updatedUser.username || '',
                fullName: updatedUser.fullName || '',
                bio: updatedUser.bio || '',
                email: updatedUser.email || '',
                phoneNumber: updatedPhoneNumber,
                profilePicture: updatedUser.profilePicture || '',
            })

            setProfilePictureFile(null)
            setSaveError('')
            setEditing(false)
        } catch (error) {
            handleSaveError(error.message || 'Cannot connect to backend.', user.profilePicture || '')
        } finally {
            setIsSaving(false)
        }
    }

    const handlePostCreated = (newPost) => {
        if (newPost) {
            setPosts(prevPosts => [newPost, ...prevPosts])
        }
        setShowCreateModal(false)
    }

    const handleToggleFollow = async () => {
        if (isTogglingFollow) return;

        setIsTogglingFollow(true); // Punem lacătul

        const token = getToken()
        const method = isFollowing ? 'DELETE' : 'POST'

        try {
            await toggleFollow({
                token,
                currentUserId,
                targetUserId: user.id,
                isFollowing,
            })

            setIsFollowing(!isFollowing)
            setFollowersCount(prev => method === 'DELETE' ? Math.max(0, prev - 1) : prev + 1)
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setIsTogglingFollow(false);
        }
    }


    if (loading) {
        return (
            <div
                style={{
                    background: '#000',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ color: '#737373', fontSize: 14 }}>Loading...</div>
            </div>
        )
    }

    if (!user) return null

    const avatarSrc = user.profilePicture || `https://i.pravatar.cc/150?u=${user.id}`

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
            <ProfileHeader
                username={user.username}
                onBack={() => navigate('/home')}
                onAddPost={isOwner ? () => setShowCreateModal(true) : null}
            />

            <div style={{ maxWidth: 935, margin: '0 auto', padding: '24px 16px 0' }}>
                <ProfileInfo
                    user={user}
                    postsCount={posts.length}
                    followersCount={followersCount}
                    followingCount={followingCount}
                    avatarSrc={avatarSrc}

                    isOwner={isOwner}
                    isFollowing={isFollowing}
                    onToggleFollow={handleToggleFollow}
                    onMessage={() => alert("Chat-ul inca nu este implementat.")}
                    /* ------------------------------------------- */

                    onOpenFollowers={() => openFollowModal('followers')}
                    onOpenFollowing={() => openFollowModal('following')}
                    onEditProfile={() => {
                        setSaveError('')
                        resetEditFormToCurrentUser()
                        setEditing(true)
                    }}
                />

                <PostsGrid
                    posts={posts}
                    getPostImages={getPostImages}
                    onPostClick={(post) => setSelectedPost(post)}
                />
            </div>

            {isOwner && editing && (
                <EditProfileModal
                    avatarSrc={avatarSrc}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    profilePictureFile={profilePictureFile}
                    saveError={saveError}
                    isSaving={isSaving}
                    fileInputRef={fileInputRef}
                    onClose={closeEditModal}
                    onFileChange={handleProfilePictureFileChange}
                    onChangeProfilePicture={handleProfilePictureButtonClick}
                    onSave={handleSave}
                />
            )}

            {followModalType && (
                <FollowModal
                    followModalType={followModalType}
                    followUsers={followUsers}
                    loadingFollow={loadingFollow}
                    onClose={() => setFollowModalType(null)}
                />
            )}
            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={handlePostCreated}
                />
            )}

            {selectedPost && (
                <div
                    onClick={() => setSelectedPost(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: 16
                    }}
                >
                    <div onClick={e => e.stopPropagation()} style={{ background: '#000', borderRadius: 8, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <PostCard
                            post={selectedPost}
                            currentUserId={currentUserId}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage
