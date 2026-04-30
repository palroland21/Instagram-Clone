import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CreatePostModal from '../components/CreatePostModal'

const API_BASE_URL = 'http://localhost:9090'
const UPLOAD_API_BASE_URL = 'http://localhost:9090/uploads'

function ProfilePage() {
    const navigate = useNavigate()
    const resetUsernameTimeoutRef = useRef(null)
    const fileInputRef = useRef(null)

    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [profilePictureFile, setProfilePictureFile] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [editForm, setEditForm] = useState({
        username: '',
        fullName: '',
        bio: '',
        email: '',
        profilePicture: '',
    })
    const [saveError, setSaveError] = useState('')

    const [followModalType, setFollowModalType] = useState(null)
    const [followUsers, setFollowUsers] = useState([])
    const [loadingFollow, setLoadingFollow] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)

    // STARE NOUĂ PENTRU MODALUL DE POSTARE
    const [showCreateModal, setShowCreateModal] = useState(false)

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

        Promise.all([
            fetch(`${API_BASE_URL}/users`, { headers }).then(r => r.json()),
            fetch(`${API_BASE_URL}/posts`, { headers }).then(r => r.json()),
        ])
            .then(([users, allPosts]) => {
                const me = users.find(u => u.username === myUsername)
                if (!me) {
                    navigate('/')
                    return
                }

                setUser(me)
                setEditForm({
                    username: me.username || '',
                    fullName: me.fullName || '',
                    bio: me.bio || '',
                    email: me.email || '',
                    profilePicture: me.profilePicture || '',
                })

                fetch(`${API_BASE_URL}/users/${me.id}/followers`, { headers })
                    .then(res => res.json())
                    .then(data => setFollowersCount(data.length || 0))
                    .catch(() => setFollowersCount(0))

                fetch(`${API_BASE_URL}/users/${me.id}/following`, { headers })
                    .then(res => res.json())
                    .then(data => setFollowingCount(data.length || 0))
                    .catch(() => setFollowingCount(0))

                const myPosts = allPosts
                    .filter(p => Number(p.userId) === Number(me.id))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setPosts(myPosts)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [navigate])

    useEffect(() => {
        return () => {
            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current)
            }
        }
    }, [])

    const resetEditFormToCurrentUser = () => {
        if (!user) return

        setEditForm({
            username: user.username || '',
            fullName: user.fullName || '',
            bio: user.bio || '',
            email: user.email || '',
            profilePicture: user.profilePicture || '',
        })
        setProfilePictureFile(null)
    }

    const openFollowModal = async (type) => {
        if (!user) return
        setFollowModalType(type)
        setLoadingFollow(true)
        setFollowUsers([])

        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`${API_BASE_URL}/users/${user.id}/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
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

    const handleSave = async () => {
        if (!user) return

        setSaveError('')
        setIsSaving(true)
        const token = localStorage.getItem('token')

        try {
            let finalProfilePictureUrl = user.profilePicture || ''

            if (profilePictureFile) {
                const formData = new FormData()
                formData.append('file', profilePictureFile)

                const uploadResponse = await fetch(`${UPLOAD_API_BASE_URL}/image`, {
                    method: 'POST',
                    body: formData,
                })

                const uploadData = await uploadResponse.json().catch(() => null)

                if (!uploadResponse.ok) {
                    setSaveError(uploadData?.message || 'Image upload failed.')
                    setIsSaving(false)
                    return
                }

                finalProfilePictureUrl = uploadData?.url || ''
            }

            const bodyToSend = {
                ...editForm,
                profilePicture: finalProfilePictureUrl,
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
                    } catch {}
                }

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

                setIsSaving(false)
                return
            }

            const updated = await res.json()

            if (resetUsernameTimeoutRef.current) {
                clearTimeout(resetUsernameTimeoutRef.current)
                resetUsernameTimeoutRef.current = null
            }

            setUser(updated)
            setEditForm({
                username: updated.username || '',
                fullName: updated.fullName || '',
                bio: updated.bio || '',
                email: updated.email || '',
                profilePicture: updated.profilePicture || '',
            })
            setProfilePictureFile(null)
            setSaveError('')
            setEditing(false)
        } catch {
            setSaveError('Cannot connect to backend.')
        } finally {
            setIsSaving(false)
        }
    }

    // Funcția care se va apela după ce modalul creează postarea
    const handlePostCreated = (newPost) => {
        setShowCreateModal(false)
        if (newPost) {
            // Adăugăm postarea nouă la începutul listei pentru a o vedea instant pe profil
            setPosts(prevPosts => [newPost, ...prevPosts])
        } else {
            // Un fallback în caz că modalul tău nu returnează obiectul postării
            window.location.reload()
        }
    }

    if (loading) {
        return (
            <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#737373', fontSize: 14 }}>Loading...</div>
            </div>
        )
    }

    if (!user) return null

    const avatarSrc = user.profilePicture || `https://i.pravatar.cc/150?u=${user.id}`

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>

            {/* Header cu butonul de Create */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: '1px solid #262626',
                    position: 'sticky',
                    top: 0,
                    background: '#000',
                    zIndex: 10,
                }}
            >
                <button
                    onClick={() => navigate('/home')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: 22,
                        cursor: 'pointer',
                        padding: '4px 8px',
                        lineHeight: 1,
                    }}
                >
                    ←
                </button>

                <span style={{ fontSize: 16, fontWeight: 700 }}>{user.username}</span>

                {/* MODIFICAT AICI: Deschide modalul de creare */}
                <button
                    onClick={() => setShowCreateModal(true)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    title="Create new post"
                >
                    <svg aria-label="New post" color="white" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.699 4.946-1.608C21.302 19.455 22 18.299 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
                    </svg>
                </button>
            </div>

            <div style={{ maxWidth: 935, margin: '0 auto', padding: '24px 16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 16 }}>
                    <img
                        src={avatarSrc}
                        alt={user.username}
                        style={{
                            width: 86,
                            height: 86,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #333',
                            flexShrink: 0,
                        }}
                    />
                    <div style={{ display: 'flex', gap: 56, flex: 1, justifyContent: 'center' }}>
                        {[
                            { label: 'posts', value: posts.length, action: null },
                            { label: 'followers', value: followersCount, action: () => openFollowModal('followers') },
                            { label: 'following', value: followingCount, action: () => openFollowModal('following') },
                        ].map(s => (
                            <div
                                key={s.label}
                                onClick={s.action}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                    cursor: s.action ? 'pointer' : 'default'
                                }}
                            >
                                <span style={{ fontSize: 17, fontWeight: 700 }}>{s.value}</span>
                                <span style={{ fontSize: 14 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    {user.fullName && (
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                            {user.fullName}
                        </div>
                    )}
                    {user.bio && (
                        <div style={{ fontSize: 14, color: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
                            {user.bio}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        setSaveError('')
                        resetEditFormToCurrentUser()
                        setEditing(true)
                    }}
                    style={{
                        width: '100%',
                        padding: '7px 16px',
                        background: 'transparent',
                        border: '1px solid #363636',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: 24,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#1a1a1a'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                    }}
                >
                    Edit profile
                </button>

                <div style={{ borderTop: '1px solid #262626', paddingTop: 12 }}>
                    {posts.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                color: '#737373',
                                padding: '48px 0',
                                fontSize: 14,
                            }}
                        >
                            No posts yet.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                            {posts.map(post => {
                                const images = getPostImages(post)
                                const firstImage = images[0] || ''

                                return (
                                    <div
                                        key={post.id}
                                        style={{
                                            aspectRatio: '1',
                                            overflow: 'hidden',
                                            background: '#111',
                                        }}
                                    >
                                        {firstImage ? (
                                            <img
                                                src={firstImage}
                                                alt={post.title || 'post'}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#1a1a1a',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: '#737373',
                                                        padding: 4,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {post.title || post.caption || 'No image'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {editing && (
                <div
                    onClick={closeEditModal}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 16,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#262626',
                            borderRadius: 12,
                            width: '100%',
                            maxWidth: 400,
                            padding: 24,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>
                                Edit Profile
                            </span>
                            <button
                                onClick={closeEditModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#737373',
                                    fontSize: 18,
                                    cursor: 'pointer',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img
                                src={editForm.profilePicture || avatarSrc}
                                alt="preview"
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '1px solid #363636',
                                }}
                            />
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureFileChange}
                            style={{ display: 'none' }}
                        />

                        <button
                            type="button"
                            onClick={handleProfilePictureButtonClick}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                background: '#363636',
                                border: '1px solid #4a4a4a',
                                borderRadius: 8,
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Change profile picture
                        </button>

                        {profilePictureFile && (
                            <div
                                style={{
                                    fontSize: 13,
                                    color: '#b3b3b3',
                                    textAlign: 'center',
                                    marginTop: -8,
                                }}
                            >
                                Selected: {profilePictureFile.name}
                            </div>
                        )}

                        {saveError && (
                            <div
                                style={{
                                    background: '#fdeaea',
                                    color: '#b42318',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    fontSize: 13,
                                }}
                            >
                                {saveError}
                            </div>
                        )}

                        {[
                            { key: 'username', label: 'Username', multiline: false },
                            { key: 'fullName', label: 'Full name', multiline: false },
                            { key: 'bio', label: 'Bio', multiline: true },
                        ].map(({ key, label, multiline }) => (
                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: '#f5f5f5',
                                    }}
                                >
                                    {label}
                                </label>

                                {multiline ? (
                                    <textarea
                                        value={editForm[key]}
                                        onChange={e =>
                                            setEditForm(prev => ({
                                                ...prev,
                                                [key]: e.target.value,
                                            }))
                                        }
                                        rows={3}
                                        style={{
                                            background: '#363636',
                                            border: '1px solid #4a4a4a',
                                            borderRadius: 8,
                                            color: 'white',
                                            fontSize: 14,
                                            padding: '10px 12px',
                                            outline: 'none',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                        }}
                                    />
                                ) : (
                                    <input
                                        value={editForm[key]}
                                        onChange={e =>
                                            setEditForm(prev => ({
                                                ...prev,
                                                [key]: e.target.value,
                                            }))
                                        }
                                        style={{
                                            background: '#363636',
                                            border: '1px solid #4a4a4a',
                                            borderRadius: 8,
                                            color: 'white',
                                            fontSize: 14,
                                            padding: '10px 12px',
                                            outline: 'none',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: isSaving ? '#5aa7dd' : '#0095f6',
                                border: 'none',
                                borderRadius: 8,
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: isSaving ? 'default' : 'pointer',
                                opacity: isSaving ? 0.85 : 1,
                            }}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            )}


            {followModalType && (
                <div
                    onClick={() => setFollowModalType(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 16,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#262626',
                            borderRadius: 12,
                            width: '100%',
                            maxWidth: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '70vh',
                        }}
                    >
                        {/* Header Modal */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px 24px',
                                borderBottom: '1px solid #363636'
                            }}
                        >
                            <span style={{ fontSize: 16, fontWeight: 700, color: 'white', textTransform: 'capitalize' }}>
                                {followModalType}
                            </span>
                            <button
                                onClick={() => setFollowModalType(null)}
                                style={{ background: 'none', border: 'none', color: '#737373', fontSize: 18, cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Conținut Lista */}
                        <div style={{ padding: 16, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {loadingFollow ? (
                                <div style={{ textAlign: 'center', color: '#737373', padding: '20px 0' }}>Loading...</div>
                            ) : followUsers.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#737373', padding: '20px 0' }}>
                                    No {followModalType} yet.
                                </div>
                            ) : (
                                followUsers.map(u => (
                                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <img
                                            src={u.profilePicture || `https://i.pravatar.cc/150?u=${u.id}`}
                                            alt={u.username}
                                            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600, fontSize: 14 }}>{u.username}</span>
                                            {u.fullName && <span style={{ color: '#737373', fontSize: 13 }}>{u.fullName}</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {}
            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={handlePostCreated}
                />
            )}

        </div>
    )
}

export default ProfilePage