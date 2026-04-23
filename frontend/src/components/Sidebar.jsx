import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    HomeIcon,
    SearchIcon,
    MessagesIcon,
    HeartIcon,
    PlusIcon,
    LogoutIcon,
} from './Icons'
import CreatePostModal from './CreatePostModal'

const API_BASE_URL = 'http://localhost:9090'

function Sidebar({ activeItem, setActiveItem, isMobile, onPostCreated }) {
    const navigate = useNavigate()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedUserId = localStorage.getItem('userId')

        if (!token) return

        const headers = { Authorization: `Bearer ${token}` }

        const loadCurrentUser = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/users`, { headers })
                if (!res.ok) throw new Error('Failed to fetch users')

                const users = await res.json()

                let me = null

                if (storedUserId) {
                    me = users.find(u => Number(u.id) === Number(storedUserId))
                }

                if (!me) {
                    let payload = null
                    try {
                        payload = JSON.parse(atob(token.split('.')[1]))
                    } catch {
                        payload = null
                    }

                    if (payload?.sub) {
                        me = users.find(u => u.username === payload.sub)
                    }
                }

                setCurrentUser(me || null)
            } catch (error) {
                console.error('Failed to load current user:', error)
                setCurrentUser(null)
            }
        }

        loadCurrentUser()
    }, [])

    const avatarSrc =
        currentUser?.profilePicture ||
        `https://i.pravatar.cc/150?u=${currentUser?.id || 'me'}`

    const navItems = [
        { id: 'home', label: 'Home', path: '/home', icon: <HomeIcon filled={activeItem === 'home'} /> },
        { id: 'search', label: 'Search', path: '/search', icon: <SearchIcon /> },
        { id: 'messages', label: 'Messages', icon: <MessagesIcon /> },
        { id: 'notifications', label: 'Notifications', path: '/notifications', icon: <HeartIcon /> },
        { id: 'create', label: 'Create', icon: <PlusIcon />, action: () => setShowCreateModal(true) },
        {
            id: 'profile',
            label: 'Profile',
            path: '/profile',
            icon: (
                <img
                    src={avatarSrc}
                    alt="profile"
                    style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                />
            ),
        },
    ]

    const handleItemClick = (item) => {
        if (item.action) {
            item.action()
            return
        }

        setActiveItem(item.id)

        if (item.path) {
            navigate(item.path)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        navigate('/')
    }

    if (isMobile) {
        const mobileItems = [
            { id: 'home', path: '/home', icon: <HomeIcon filled={activeItem === 'home'} /> },
            { id: 'search', path: '/search', icon: <SearchIcon /> },
            { id: 'create', icon: <PlusIcon />, action: () => setShowCreateModal(true) },
            { id: 'notifications', path: '/notifications', icon: <HeartIcon filled={false} /> },
            {
                id: 'profile',
                path: '/profile',
                icon: (
                    <img
                        src={avatarSrc}
                        alt="profile"
                        style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: activeItem === 'profile' ? '2px solid white' : '2px solid transparent',
                        }}
                    />
                ),
            },
        ]

        return (
            <>
                <div
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 50,
                        background: '#000',
                        borderTop: '1px solid #262626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        zIndex: 100,
                        paddingBottom: 'env(safe-area-inset-bottom)',
                    }}
                >
                    {mobileItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: activeItem === item.id ? 1 : 0.7,
                                transition: 'opacity 0.15s',
                            }}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                {showCreateModal && (
                    <CreatePostModal
                        onClose={() => setShowCreateModal(false)}
                        onPostCreated={onPostCreated}
                    />
                )}
            </>
        )
    }

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 244,
                    background: '#000',
                    borderRight: '1px solid #262626',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '8px 12px 20px',
                    zIndex: 100,
                }}
            >
                <div style={{ padding: '25px 12px 16px' }}>
                    <span
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: 22,
                            fontWeight: 'bold',
                            color: 'white',
                            letterSpacing: '-0.5px',
                            display: 'block',
                        }}
                    >
                        Instagram
                    </span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                padding: '12px 12px',
                                borderRadius: 8,
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: 15,
                                fontWeight: activeItem === item.id ? 700 : 400,
                                transition: 'background 0.15s',
                                width: '100%',
                                textAlign: 'left',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <span style={{ flexShrink: 0 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 400,
                        width: '100%',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    <LogoutIcon />
                    <span>Log out</span>
                </button>
            </div>

            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={onPostCreated}
                />
            )}
        </>
    )
}

export default Sidebar