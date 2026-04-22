import { useState } from 'react'
import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, DotsIcon } from './icons'

const API_BASE_URL = 'http://localhost:9090'

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

    const token = localStorage.getItem('token')

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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'Failed to toggle like')
            }

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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    postId: post.id,
                    text: commentText.trim()
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'Failed to post comment')
            }

            const newComment = await response.json()

            setComments(prev => [...prev, newComment])
            setCommentText('')
            setShowComments(true)
        } catch (error) {
            console.error('Comment error:', error)
        }
    }

    return (
        <article style={{ borderBottom: '1px solid #262626', paddingBottom: 8, marginBottom: 8 }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 4px 8px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                        src={`https://i.pravatar.cc/150?u=${post.userId}`}
                        alt={post.username}
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
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
                    </div>
                </div>

                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4
                    }}
                >
                    <DotsIcon />
                </button>
            </div>

            {post.pictureUrl && (
                <div
                    style={{
                        margin: '0 -4px',
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid #262626'
                    }}
                >
                    <img
                        src={post.pictureUrl}
                        alt="post"
                        style={{
                            width: '100%',
                            maxHeight: 585,
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                </div>
            )}

            <div style={{ padding: '8px 4px 0' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8
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
                                alignItems: 'center'
                            }}
                        >
                            <HeartIcon filled={liked} size={24} />
                        </button>

                        <button
                            onClick={() => setShowComments(prev => !prev)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center'
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
                                alignItems: 'center'
                            }}
                        >
                            <ShareIcon />
                        </button>
                    </div>

                    <button
                        onClick={() => setSaved(s => !s)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <BookmarkIcon filled={saved} />
                    </button>
                </div>

                <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 6 }}>
                    {likes} likes
                </div>

                {post.title && (
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 4 }}>
                        {post.title}
                    </div>
                )}

                {post.caption && (
                    <div style={{ fontSize: 14, color: '#f5f5f5', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, marginRight: 6 }}>{post.username}</span>
                        {post.caption}
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
                                    style={{ fontSize: 14, color: '#f5f5f5', marginBottom: 4 }}
                                >
                                    <span style={{ fontWeight: 600, marginRight: 6 }}>
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
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handlePostComment()
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#f5f5f5',
                            fontSize: 14,
                            flex: 1,
                            outline: 'none',
                            padding: 0
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
                            opacity: commentText.trim() ? 1 : 0.4
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