import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotsIcon } from '../../Icons.jsx'
import { buildFileUrl, timeAgo } from './postCardUtils.js'

function PostHeader({
    post,
    isOwner,
    onEditClick,
    onDeleteClick,
    onReportClick,
    onCloseComments,
}) {
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()
    const isOutdated = post.status === 'OUTDATED'

    const handleEdit = () => {
        setShowMenu(false)
        onEditClick()
    }

    const handleDelete = () => {
        setShowMenu(false)
        if (window.confirm('Are you sure you want to delete this post?')) {
            onDeleteClick()
        }
    }

    const handleReport = () => {
        setShowMenu(false)
        onReportClick()
    }

    const handleCloseComments = () => {
        setShowMenu(false)
        if (window.confirm('Close comments for this post?')) {
            onCloseComments()
        }
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span
                            onClick={() => navigate(`/profile/${post.username}`)}
                            style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', cursor: 'pointer' }}
                        >
                            {post.username}
                        </span>

                        <span style={{ fontSize: 12, color: '#ffd700', fontWeight: 'bold' }}>
                            ({post.authorScore !== undefined ? post.authorScore : 0} pts)
                        </span>

                        <span style={{ color: '#737373', fontSize: 14 }}>•</span>
                        <span style={{ fontSize: 14, color: '#737373' }}>
                            {post.createdAt ? timeAgo(post.createdAt) : ''}
                        </span>

                        {post.status && (
                            <>
                                <span style={{ color: '#737373', fontSize: 14 }}>•</span>
                                <span style={statusBadgeStyle}>{formatStatus(post.status)}</span>
                            </>
                        )}
                    </div>

                    {post.location && (
                        <div style={{ fontSize: 12, color: '#737373' }}>
                            {post.location}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#f5f5f5' }}
                >
                    <DotsIcon />
                </button>

                {showMenu && (
                    <>
                        <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />

                        <div style={{
                            position: 'absolute',
                            top: 30,
                            right: 0,
                            background: '#262626',
                            border: '1px solid #363636',
                            borderRadius: 8,
                            padding: '8px 0',
                            zIndex: 100,
                            width: 160,
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        }}>
                            {isOwner ? (
                                <>
                                    <MenuButton onClick={handleEdit}>Edit</MenuButton>
                                    {!isOutdated && (
                                        <MenuButton onClick={handleCloseComments}>
                                            Close comments
                                        </MenuButton>
                                    )}
                                    <MenuButton onClick={handleDelete} danger>
                                        Delete
                                    </MenuButton>
                                </>
                            ) : (
                                <MenuButton onClick={handleReport} danger>
                                    Report
                                </MenuButton>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function MenuButton({ children, danger = false, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                color: danger ? '#ff3040' : '#f5f5f5',
                padding: '8px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: danger ? 600 : 500,
            }}
            onMouseEnter={(e) => {
                e.target.style.background = '#363636'
            }}
            onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
            }}
        >
            {children}
        </button>
    )
}

function formatStatus(status) {
    const labels = {
        JUST_POSTED: 'Just posted',
        FIRST_REACTIONS: 'First reactions',
        OUTDATED: 'Outdated',
    }

    return labels[status] || status
}

const statusBadgeStyle = {
    border: '1px solid #363636',
    borderRadius: 999,
    color: '#a8a8a8',
    fontSize: 11,
    fontWeight: 600,
    padding: '1px 6px',
}

export default PostHeader
