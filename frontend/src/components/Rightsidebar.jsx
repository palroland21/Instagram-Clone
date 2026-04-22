import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:9090'
const FOOTER_LINKS = ['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language', 'Meta Verified']

function RightSidebar() {
    const [currentUser, setCurrentUser] = useState(null)
    const [suggestions, setSuggestions] = useState([])
    const [followed, setFollowed] = useState({})

    useEffect(() => {
        const token = localStorage.getItem('token')
        const headers = { 'Authorization': `Bearer ${token}` }

        // Fetch all users
        fetch(`${API_BASE_URL}/users`, { headers })
            .then(r => r.json())
            .then(users => {
                // Decode token to get current username
                const payload = JSON.parse(atob(token.split('.')[1]))
                const myUsername = payload.sub // JWT subject = username

                const me = users.find(u => u.username === myUsername)
                const others = users.filter(u => u.username !== myUsername)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5)

                setCurrentUser(me || null)
                setSuggestions(others)
            })
            .catch(() => {
                // silently fail, keep empty
            })
    }, [])

    const toggleFollow = (id) => {
        setFollowed(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div style={{ paddingTop: 20 }}>
            {/* Current user */}
            {currentUser && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                            src={currentUser.profilePicture || `https://i.pravatar.cc/150?u=${currentUser.id}`}
                            alt={currentUser.username}
                            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid #333' }}
                        />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5' }}>{currentUser.username}</div>
                            <div style={{ fontSize: 14, color: '#737373' }}>{currentUser.fullName}</div>
                        </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: '#0095f6', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Switch
                    </button>
                </div>
            )}

            {/* Suggestions header */}
            {suggestions.length > 0 && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#737373' }}>Suggested for you</span>
                        <button style={{ background: 'none', border: 'none', color: '#f5f5f5', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            See all
                        </button>
                    </div>

                    {/* Suggestion items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {suggestions.map(s => (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <img
                                        src={s.profilePicture || `https://i.pravatar.cc/150?u=${s.id}`}
                                        alt={s.username}
                                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f5' }}>{s.username}</div>
                                        <div style={{
                                            fontSize: 12, color: '#737373',
                                            maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>
                                            {s.fullName || 'Suggested for you'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleFollow(s.id)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: followed[s.id] ? '#f5f5f5' : '#0095f6',
                                        fontSize: 12, fontWeight: 600,
                                    }}
                                >
                                    {followed[s.id] ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Footer links */}
            <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {FOOTER_LINKS.map(link => (
                        <a
                            key={link}
                            href="#"
                            style={{ fontSize: 11, color: '#737373', textDecoration: 'none' }}
                            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.target.style.textDecoration = 'none'}
                        >
                            {link} ·{' '}
                        </a>
                    ))}
                </div>
                <div style={{ fontSize: 11, color: '#737373' }}>© 2026 INSTAGRAM FROM META</div>
            </div>
        </div>
    )
}

export default RightSidebar