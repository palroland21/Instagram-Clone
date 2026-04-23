import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    HomeIcon,
    SearchIcon,
    ExploreIcon,
    MessagesIcon,
    HeartIcon,
    PlusIcon,
    LogoutIcon,
} from './Icons'

const API_BASE_URL = 'http://localhost:9090'

function Sidebar({ activeItem, setActiveItem, isMobile }) {
    const navigate = useNavigate()

    const [profilePicture, setProfilePicture] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')

        if (!token || !userId) return

        const fetchCurrentUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) return

                const data = await response.json()
                setProfilePicture(data.profilePicture || '')
            } catch (error) {
                console.error('Failed to load sidebar profile picture:', error)
            }
        }

        fetchCurrentUser()
    }, [])

    const profileIconDesktop = useMemo(() => {
        if (profilePicture) {
            return (
                <img
                    src={profilePicture}
                    alt="profile"
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />
            )
        }

        return (
            <div
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxSizing: 'border-box',
                }}
            />
        )
    }, [profilePicture])

    const profileIconMobile = useMemo(() => {
        if (profilePicture) {
            return (
                <img
                    src={profilePicture}
                    alt="profile"
                    style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: activeItem === 'profile' ? '2px solid white' : '2px solid transparent',
                    }}
                />
            )
        }

        return (
            <div
                style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    border: activeItem === 'profile' ? '2px solid white' : '2px solid #888',
                    boxSizing: 'border-box',
                }}
            />
        )
    }, [profilePicture, activeItem])

    const navItems = [
        { id: 'home', label: 'Home', path: '/home', icon: <HomeIcon filled={activeItem === 'home'} /> },
        { id: 'search', label: 'Search', icon: <SearchIcon /> },
        { id: 'explore', label: 'Explore', icon: <ExploreIcon /> },
        { id: 'messages', label: 'Messages', icon: <MessagesIcon /> },
        { id: 'notifications', label: 'Notifications', icon: <HeartIcon /> },
        { id: 'create', label: 'Create', icon: <PlusIcon /> },
        {
            id: 'profile',
            label: 'Profile',
            path: '/profile',
            icon: profileIconDesktop,
        },
    ]

    const handleItemClick = (item) => {
        setActiveItem(item.id)
        if (item.path) navigate(item.path)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        navigate('/')
    }

    if (isMobile) {
        const mobileItems = [
            { id: 'home', path: '/home', icon: <HomeIcon filled={activeItem === 'home'} /> },
            { id: 'search', icon: <SearchIcon /> },
            { id: 'explore', icon: <ExploreIcon /> },
            { id: 'notifications', icon: <HeartIcon filled={false} /> },
            {
                id: 'profile',
                path: '/profile',
                icon: profileIconMobile,
            },
        ]

        return (
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
                {mobileItems.map((item) => (
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
        )
    }

    return (
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
            <button
                onClick={() => {
                    setActiveItem('home')
                    navigate('/home')
                }}
                style={{
                    padding: '25px 12px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                }}
            >
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
            </button>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map((item) => (
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1a1a1a'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                        }}
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
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1a1a1a'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                }}
            >
                <LogoutIcon />
                <span>Log out</span>
            </button>
        </div>
    )
}

export default Sidebar