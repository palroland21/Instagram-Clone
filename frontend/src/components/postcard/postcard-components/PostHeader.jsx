import { useState } from 'react'
import { DotsIcon } from '../../Icons.jsx'
import { buildFileUrl, timeAgo } from './postCardUtils.js'
import { useNavigate } from 'react-router-dom'
function PostHeader({ post, isOwner, onEditClick, onDeleteClick, onReportClick }) {
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

    const handleEdit = () => {
        setShowMenu(false)
        onEditClick()
    }

    const handleDelete = () => {
        setShowMenu(false)
        if (window.confirm('Ești sigur că vrei să ștergi această postare?')) {
            onDeleteClick()
        }
    }

    const handleReport = () => {
        setShowMenu(false)
        onReportClick()
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 4px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                    onClick={() => navigate(`/profile/${post.username}`)}
                    src={buildFileUrl(post.userProfilePicture) || `https://i.pravatar.cc/150?u=${post.userId}`}
                    alt={post.username}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
                />
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                            onClick={() => navigate(`/profile/${post.username}`)}
                            style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', cursor: 'pointer' }}
                        >
                        {post.username}
                    </span>
                        <span style={{ color: '#737373', fontSize: 14 }}>•</span>
                        <span style={{ fontSize: 14, color: '#737373' }}>{post.createdAt ? timeAgo(post.createdAt) : ''}</span>
                    </div>
                    {post.location && <div style={{ fontSize: 12, color: '#737373' }}>{post.location}</div>}
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#f5f5f5' }}>
                    <DotsIcon />
                </button>

                {showMenu && (
                    <>
                        <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />

                        <div style={{
                            position: 'absolute', top: 30, right: 0, background: '#262626', border: '1px solid #363636',
                            borderRadius: 8, padding: '8px 0', zIndex: 100, width: 120, display: 'flex', flexDirection: 'column',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}>
                            {isOwner ? (
                                <>
                                    <button
                                        onClick={handleEdit}
                                        style={{ background: 'none', border: 'none', color: '#f5f5f5', padding: '8px 16px', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
                                        onMouseEnter={(e) => e.target.style.background = '#363636'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        style={{ background: 'none', border: 'none', color: '#ff3040', padding: '8px 16px', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                                        onMouseEnter={(e) => e.target.style.background = '#363636'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleReport}
                                    style={{ background: 'none', border: 'none', color: '#ff3040', padding: '8px 16px', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                                    onMouseEnter={(e) => e.target.style.background = '#363636'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    Report
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PostHeader