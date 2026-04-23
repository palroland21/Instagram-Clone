import { useState } from 'react'
import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, DotsIcon } from './icons'

const API_BASE_URL = 'http://localhost:9090'

function ChevronIcon({ dir }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {dir === 'left'
                ? <polyline points="15 18 9 12 15 6" />
                : <polyline points="9 18 15 12 9 6" />
            }
        </svg>
    )
}

function timeAgo(dateString) {
    const now = new Date()
    const created = new Date(dateString)
    const diffMs = now - created
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
}

function PostCard({ post, currentUserId }) {
    const [liked, setLiked] = useState(post.likedByCurrentUser || false)
    const [saved, setSaved] = useState(false)
    const [likes, setLikes] = useState(post.likeCount || 0)
    const [comments, setComments] = useState(post.comments || [])
    const [commentText, setCommentText] = useState('')
    const [showComments, setShowComments] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const token = localStorage.getItem('token')

    // suport si pentru postari vechi cu pictureUrl, si pentru cele noi cu pictureUrls
    const images =
        Array.isArray(post.pictureUrls) && post.pictureUrls.length > 0
            ? post.pictureUrls
            : post.pictureUrl
                ? [post.pictureUrl]
                : []

    const currentImage = images[currentImageIndex] || ''

    const handleLike = async () => {
        if (currentUserId === null || Number.isNaN(currentUserId)) {
            console.error('currentUserId missing')
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/post-votes/toggle-like?userId=${currentUserId}&postId=${post.id}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            if (!response.ok) throw new Error('Failed to toggle like')

            const data = await response.json()
            setLiked(Boolean(data.liked))
            setLikes(Number(data.likeCount) || 0)
        } catch (error) {
            console.error('Like error:', error)
        }
    }

    const handlePostComment = async () => {
        if (!commentText.trim()) return
        if (currentUserId === null || Number.isNaN(currentUserId)) {
            console.error('currentUserId missing')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    postId: post.id,
                    text: commentText.trim(),
                }),
            })

            if (!response.ok) throw new Error('Failed to post comment')

            const newComment = await response.json()
            setComments((prev) => [...prev, newComment])
            setCommentText('')
            setShowComments(true)
        } catch (error) {
            console.error('Comment error:', error)
        }
    }

    const captionText = post.caption || ''
    const tagLine = post.tagNames?.length > 0
        ? post.tagNames.map((t) => `#${t}`).join(' ')
        : ''

    const fullText = [captionText, tagLine].filter(Boolean).join('\n')
    const isLong = fullText.length > 125
    const displayText = isLong && !expanded ? fullText.slice(0, 125) : fullText

    const renderLine = (line, key) => {
        const parts = line.split(/(#\S+)/g)
        return (
            <span key={key}>
                {parts.map((part, j) =>
                    part.startsWith('#') ? (
                        <span key={j} style={{ color: '#0095f6', cursor: 'pointer' }}>
                            {part}
                        </span>
                    ) : (
                        <span key={j}>{part}</span>
                    )
                )}
            </span>
        )
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1))
    }

    return (
        <article style={{ borderBottom: '1px solid #262626', paddingBottom: 8, marginBottom: 8 }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 4px 8px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                        src={post.userProfilePicture || `https://i.pravatar.cc/150?u=${post.userId}`}
                        alt={post.username}
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5' }}>
                                {post.username}
                            </span>
                            <span style={{ color: '#737373', fontSize: 14 }}>•</span>
                            <span style={{ fontSize: 14, color: '#737373' }}>
                                {post.createdAt ? timeAgo(post.createdAt) : ''}
                            </span>
                        </div>
                        {post.location && (
                            <div style={{ fontSize: 12, color: '#737373' }}>{post.location}</div>
                        )}
                    </div>
                </div>

                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <DotsIcon />
                </button>
            </div>

            {images.length > 0 && (
                <div
                    style={{
                        margin: '0 -4px',
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid #262626',
                        position: 'relative',
                        background: '#000',
                    }}
                >
                    <img
                        src={currentImage}
                        alt={`post-${currentImageIndex}`}
                        style={{
                            width: '100%',
                            maxHeight: 585,
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />

                    {images.length > 1 && currentImageIndex > 0 && (
                        <button
                            onClick={prevImage}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: 10,
                                transform: 'translateY(-50%)',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                border: 'none',
                                background: 'rgba(0,0,0,0.55)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ChevronIcon dir="left" />
                        </button>
                    )}

                    {images.length > 1 && currentImageIndex < images.length - 1 && (
                        <button
                            onClick={nextImage}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: 10,
                                transform: 'translateY(-50%)',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                border: 'none',
                                background: 'rgba(0,0,0,0.55)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ChevronIcon dir="right" />
                        </button>
                    )}

                    {images.length > 1 && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 12,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: 6,
                            }}
                        >
                            {images.map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => setCurrentImageIndex(i)}
                                    style={{
                                        width: i === currentImageIndex ? 8 : 6,
                                        height: i === currentImageIndex ? 8 : 6,
                                        borderRadius: '50%',
                                        background:
                                            i === currentImageIndex
                                                ? 'white'
                                                : 'rgba(255,255,255,0.45)',
                                        cursor: 'pointer',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{ padding: '8px 4px 0' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                    }}
                >
                    <div style={{ display: 'flex', gap: 16 }}>
                        <button
                            onClick={handleLike}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <HeartIcon filled={liked} size={24} />
                        </button>

                        <button
                            onClick={() => setShowComments((prev) => !prev)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <CommentIcon />
                        </button>

                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <ShareIcon />
                        </button>
                    </div>

                    <button
                        onClick={() => setSaved((s) => !s)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <BookmarkIcon filled={saved} />
                    </button>
                </div>

                <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 4 }}>
                    {likes} {likes === 1 ? 'like' : 'likes'}
                </div>

                {fullText && (
                    <div style={{ fontSize: 14, color: '#f5f5f5', lineHeight: 1.5, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, marginRight: 6, cursor: 'pointer' }}>
                            {post.username}
                        </span>

                        {displayText.split('\n').map((line, i, arr) => (
                            <span key={i}>
                                {renderLine(line, i)}
                                {i < arr.length - 1 && <br />}
                            </span>
                        ))}

                        {isLong && (
                            <span
                                onClick={() => setExpanded((e) => !e)}
                                style={{ color: '#737373', cursor: 'pointer', marginLeft: 4 }}
                            >
                                {expanded ? ' less' : '... more'}
                            </span>
                        )}
                    </div>
                )}

                {showComments && (
                    <div style={{ marginBottom: 8 }}>
                        {comments.length === 0 ? (
                            <div style={{ fontSize: 14, color: '#737373' }}>No comments yet.</div>
                        ) : (
                            comments.map((c, i) => (
                                <div
                                    key={c.id || i}
                                    style={{
                                        fontSize: 14,
                                        color: '#f5f5f5',
                                        marginBottom: 4,
                                        lineHeight: 1.4,
                                    }}
                                >
                                    <span style={{ fontWeight: 700, marginRight: 6 }}>
                                        {c.username || 'user'}
                                    </span>
                                    <span>{c.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, paddingTop: 4 }}>
                    <input
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePostComment()
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#f5f5f5',
                            fontSize: 14,
                            flex: 1,
                            outline: 'none',
                            padding: 0,
                        }}
                    />
                    <button
                        onClick={handlePostComment}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#0095f6',
                            fontSize: 14,
                            fontWeight: 600,
                            opacity: commentText.trim() ? 1 : 0.4,
                        }}
                    >
                        Post
                    </button>
                </div>
            </div>
        </article>
    )
}

export default PostCard