import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ProfileHeader from './profile-page-components/ProfileHeader'
import ProfileInfo from './profile-page-components/ProfileInfo'
import PostsGrid from './profile-page-components/PostsGrid'
import EditProfileModal from './profile-page-components/EditProfileModal'
import FollowModal from './profile-page-components/FollowModal'
import CreatePostModal from '../../components/create-post/CreatePostModal'
import PostCard from '../../components/postcard/Postcard'

const API_BASE_URL = 'http://localhost:9090'
const UPLOAD_API_BASE_URL = 'http://localhost:9090/uploads'

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


    const currentUserId = localStorage.getItem('userId')
        ? Number(localStorage.getItem('userId'))
        : null

    const isOwner = user && Number(user.id) === Number(currentUserId)

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

    useEffect(() => {
        let cancelled = false

        const loadProfile = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                navigate('/')
                return
            }

            let payload

            try {
                payload = JSON.parse(atob(token.split('.')[1]))
            } catch {
                navigate('/')
                return
            }

            const myUsername = payload.sub
            const headers = { Authorization: `Bearer ${token}` }

            const usernameToLoad = targetUsername || myUsername

            try {
                const [usersResponse, postsResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/users`, { headers }),
                    fetch(`${API_BASE_URL}/posts`, { headers }),
                ])

                if (!usersResponse.ok || !postsResponse.ok) {
                    throw new Error('Failed to load profile.')
                }

                const users = await usersResponse.json()
                const allPosts = await postsResponse.json()

                const basicUser = users.find(u => u.username === usernameToLoad)

                if (!basicUser) {
                    navigate('/home')
                    return
                }

                let fullUser = basicUser

                try {
                    const userDetailsResponse = await fetch(`${API_BASE_URL}/users/${basicUser.id}`, {
                        headers,
                    })

                    if (userDetailsResponse.ok) {
                        const userDetails = await userDetailsResponse.json()
                        fullUser = {
                            ...basicUser,
                            ...userDetails,
                        }
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

                loadFollowCounts(fullUser.id, headers)

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
    }, [navigate, targetUsername])

    useEffect(() => {
        return () => {
            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current)
            }
        }
    }, [])

    const loadFollowCounts = (userId, headers) => {
        fetch(`${API_BASE_URL}/users/${userId}/followers`, { headers })
            .then(res => res.json())
            .then(data => {
                const uniqueFollowersCount = Array.isArray(data) ? new Set(data.map(u => u.id)).size : 0;
                setFollowersCount(uniqueFollowersCount);

                if (Array.isArray(data)) {
                    const amIFollowing = data.some(u => Number(u.id) === Number(currentUserId));
                    setIsFollowing(amIFollowing);
                }
            })
            .catch(() => setFollowersCount(0))

        fetch(`${API_BASE_URL}/users/${userId}/following`, { headers })
            .then(res => res.json())
            .then(data => {
                const uniqueFollowingCount = Array.isArray(data) ? new Set(data.map(u => u.id)).size : 0;
                setFollowingCount(uniqueFollowingCount);
            })
            .catch(() => setFollowingCount(0))
    }

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

        const token = localStorage.getItem('token')

        try {
            const res = await fetch(`${API_BASE_URL}/users/${user.id}/${type}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const data = await res.json()
                setFollowUsers(data)
            } else {
                console.error(`Failed to fetch ${type}`)
            }
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
        const formData = new FormData()
        formData.append('file', file)

        const uploadResponse = await fetch(`${UPLOAD_API_BASE_URL}/image`, {
            method: 'POST',
            body: formData,
        })

        const uploadData = await uploadResponse.json().catch(() => null)

        if (!uploadResponse.ok) {
            throw new Error(uploadData?.message || 'Image upload failed.')
        }

        return uploadData?.url || ''
    }

    const getErrorMessageFromResponse = async res => {
        let errorMessage = 'Failed to update profile.'

        try {
            const errorData = await res.json()

            if (typeof errorData === 'string') {
                errorMessage = errorData
            } else if (errorData?.message) {
                errorMessage = errorData.message
            } else if (errorData?.error) {
                errorMessage = errorData.error
            }
        } catch {
            try {
                const errorText = await res.text()

                if (errorText) {
                    errorMessage = errorText
                }
            } catch {
                //
            }
        }

        return errorMessage
    }

    const handleSaveError = async (res, finalProfilePictureUrl) => {
        const errorMessage = await getErrorMessageFromResponse(res)
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

        const token = localStorage.getItem('token')

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

            const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyToSend),
            })

            if (!res.ok) {
                await handleSaveError(res, finalProfilePictureUrl)
                return
            }

            const updatedUser = await res.json()
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
            setSaveError(error.message || 'Cannot connect to backend.')
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

    // const handleToggleFollow = async () => {
    //     const token = localStorage.getItem('token')
    //     const method = isFollowing ? 'DELETE' : 'POST'
    //
    //     try {
    //         const res = await fetch(`${API_BASE_URL}/users/${currentUserId}/following/${user.id}`, {
    //             method,
    //             headers: { Authorization: `Bearer ${token}` }
    //         })
    //
    //         if (res.ok) {
    //             setIsFollowing(!isFollowing)
    //             setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1)
    //         }
    //     } catch (error) {
    //         console.error('Error toggling follow:', error)
    //     }
    // }

    const handleToggleFollow = async () => {
        if (isTogglingFollow) return;

        setIsTogglingFollow(true); // Punem lacătul

        const token = localStorage.getItem('token')
        const method = isFollowing ? 'DELETE' : 'POST'

        try {
            const res = await fetch(`${API_BASE_URL}/users/${currentUserId}/following/${user.id}`, {
                method,
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                setIsFollowing(!isFollowing)
                setFollowersCount(prev => method === 'DELETE' ? Math.max(0, prev - 1) : prev + 1)
            }
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