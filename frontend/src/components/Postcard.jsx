import { useState } from 'react'
import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, DotsIcon } from './icons'

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

function PostCard({ post }) {
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')

    const handleLike = () => {
        setLiked(prev => {
            setLikes(l => l + (prev ? -1 : 1))
            return !prev
        })
    }

    const handlePostComment = () => {
        if (!commentText.trim()) return
        setComments(prev => [...prev, { username: 'you', text: commentText }])
        setCommentText('')
    }

    return (
        <article style={{ borderBottom: '1px solid #262626', paddingBottom: 8, marginBottom: 8 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 4px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                        borderRadius: '50%', padding: 2,
                    }}>
                        <div style={{ background: '#000', borderRadius: '50%', padding: 2 }}>
                            <img
                                src={`https://i.pravatar.cc/150?u=${post.userId}`}
                                alt={post.username}
                                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', cursor: 'pointer' }}>
                                {post.username}
                            </span>
                            <span style={{ color: '#737373', fontSize: 14 }}>•</span>
                            <span style={{ fontSize: 14, color: '#737373' }}>
                                {post.createdAt ? timeAgo(post.createdAt) : ''}
                            </span>
                        </div>
                        {post.location && (
                            <div style={{ fontSize: 12, color: '#f5f5f5' }}>{post.location}</div>
                        )}
                    </div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <DotsIcon />
                </button>
            </div>

            {/* Image */}
            {post.pictureUrl && (
                <div style={{ margin: '0 -4px', borderRadius: 4, overflow: 'hidden', border: '1px solid #262626' }}>
                    <img
                        src={post.pictureUrl}
                        alt="post"
                        style={{ width: '100%', maxHeight: 585, objectFit: 'cover', display: 'block' }}
                    />
                </div>
            )}

            {/* Actions */}
            <div style={{ padding: '8px 4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <button
                            onClick={handleLike}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                        >
                            <HeartIcon filled={liked} size={24} />
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                            <CommentIcon />
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                            <ShareIcon />
                        </button>
                    </div>
                    <button
                        onClick={() => setSaved(s => !s)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                    >
                        <BookmarkIcon filled={saved} />
                    </button>
                </div>

                {likes > 0 && (
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 6 }}>
                        {likes.toLocaleString()} likes
                    </div>
                )}

                {post.title && (
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 4 }}>
                        {post.title}
                    </div>
                )}

                {post.caption && (
                    <div style={{ fontSize: 14, color: '#f5f5f5', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, marginRight: 6, cursor: 'pointer' }}>{post.username}</span>
                        {post.caption}
                    </div>
                )}

                {post.tagNames?.length > 0 && (
                    <div style={{ marginBottom: 6 }}>
                        {post.tagNames.map(tag => (
                            <span key={tag} style={{ fontSize: 14, color: '#0095f6', marginRight: 6, cursor: 'pointer' }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {comments.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                        <button style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#737373', fontSize: 14, padding: 0, marginBottom: 4, display: 'block',
                        }}>
                            View all {comments.length} comments
                        </button>
                        {comments.slice(0, 2).map((c, i) => (
                            <div key={i} style={{ fontSize: 14, color: '#f5f5f5', marginBottom: 2 }}>
                                <span style={{ fontWeight: 600, marginRight: 6 }}>{c.username}</span>
                                <span>{c.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, paddingTop: 4 }}>
                    <input
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handlePostComment()}
                        style={{
                            background: 'none', border: 'none', color: '#737373',
                            fontSize: 14, flex: 1, outline: 'none', padding: 0,
                        }}
                    />
                    <button
                        onClick={handlePostComment}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#0095f6', fontSize: 14, fontWeight: 600,
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