import { useNavigate } from 'react-router-dom'
import { HomeIcon, SearchIcon, ExploreIcon, ReelsIcon, MessagesIcon, HeartIcon, PlusIcon, MoreIcon } from './icons'
import { CURRENT_USER } from '../mockData'

function Sidebar({ activeItem, setActiveItem, isMobile }) {
    const navigate = useNavigate()

    const navItems = [
        { id: 'home', label: 'Home', icon: <HomeIcon filled={activeItem === 'home'} /> },
        { id: 'search', label: 'Search', icon: <SearchIcon /> },
        { id: 'explore', label: 'Explore', icon: <ExploreIcon /> },
        { id: 'reels', label: 'Reels', icon: <ReelsIcon /> },
        { id: 'messages', label: 'Messages', icon: <MessagesIcon /> },
        { id: 'notifications', label: 'Notifications', icon: <HeartIcon /> },
        { id: 'create', label: 'Create', icon: <PlusIcon /> },
        {
            id: 'profile', label: 'Profile', icon: (
                <img
                    src={`https://i.pravatar.cc/150?img=1`}
                    alt="profile"
                    style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                />
            )
        },
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    // ── MOBILE: bottom bar with icons only ───────────────────────────────────
    if (isMobile) {
        // Show only 5 key items on mobile bottom bar
        const mobileItems = [
            { id: 'home', icon: <HomeIcon filled={activeItem === 'home'} /> },
            { id: 'search', icon: <SearchIcon /> },
            { id: 'reels', icon: <ReelsIcon /> },
            { id: 'notifications', icon: <HeartIcon filled={false} /> },
            {
                id: 'profile', icon: (
                    <img
                        src={`https://i.pravatar.cc/150?img=1`}
                        alt="profile"
                        style={{
                            width: 26, height: 26, borderRadius: '50%', objectFit: 'cover',
                            border: activeItem === 'profile' ? '2px solid white' : '2px solid transparent',
                        }}
                    />
                )
            },
        ]

        return (
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, height: 50,
                background: '#000', borderTop: '1px solid #262626',
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom)',
            }}>
                {mobileItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
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

    // ── DESKTOP: left sidebar ─────────────────────────────────────────────────
    return (
        <div style={{
            position: 'fixed', left: 0, top: 0, bottom: 0, width: 244,
            background: '#000', borderRight: '1px solid #262626',
            display: 'flex', flexDirection: 'column', padding: '8px 12px 20px',
            zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ padding: '25px 12px 16px' }}>
                <span style={{
                    fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 'bold',
                    color: 'white', letterSpacing: '-0.5px', display: 'block',
                }}>
                    Instagram
                </span>
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            padding: '12px 12px', borderRadius: 8, border: 'none',
                            background: 'transparent', cursor: 'pointer', color: 'white',
                            fontSize: 15, fontWeight: activeItem === item.id ? 700 : 400,
                            transition: 'background 0.15s', width: '100%', textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* More / Logout */}
            <button
                onClick={handleLogout}
                style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '12px 12px', borderRadius: 8, border: 'none',
                    background: 'transparent', cursor: 'pointer', color: 'white',
                    fontSize: 15, fontWeight: 400, width: '100%', textAlign: 'left',
                    transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <MoreIcon />
                <span>More</span>
            </button>
        </div>
    )
}

export default Sidebar