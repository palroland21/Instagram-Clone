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

function XVoteIcon({ filled = false, size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={filled ? 3 : 2.3}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
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

function buildFileUrl(value) {
    if (!value) return ''

    if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('data:')
    ) {
        return value
    }

    return `${API_BASE_URL}${value.startsWith('/') ? '' : '/'}${value}`
}

function PostCard({ post, currentUserId }) {
    const [liked, setLiked] = useState(Boolean(post.likedByCurrentUser))
    const [disliked, setDisliked] = useState(Boolean(post.dislikedByCurrentUser))
    const [saved, setSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(Number(post.likeCount) || 0)
    const [dislikeCount, setDislikeCount] = useState(Number(post.dislikeCount) || 0)
    const [voteCount, setVoteCount] = useState(Number(post.voteCount) || 0)
    const [comments, setComments] = useState(post.comments || [])
    const [commentText, setCommentText] = useState('')
    const [showComments, setShowComments] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const token = localStorage.getItem('token')

    const images =
        Array.isArray(post.pictureUrls) && post.pictureUrls.length > 0
            ? post.pictureUrls.map(buildFileUrl)
            : post.pictureUrl
                ? [buildFileUrl(post.pictureUrl)]
                : []

    const currentImage = images[currentImageIndex] || ''

    const sortedComments = [...comments].sort((a, b) => {
        const byVotes = (Number(b.voteCount) || 0) - (Number(a.voteCount) || 0)
        if (byVotes !== 0) return byVotes

        return new Date(a.postedAt || 0) - new Date(b.postedAt || 0)
    })

    const handlePostVote = async (voteType) => {
        if (currentUserId === null || Number.isNaN(currentUserId)) {
            console.error('currentUserId missing')
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/post-votes/toggle?userId=${currentUserId}&postId=${post.id}&voteType=${voteType}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            if (!response.ok) throw new Error('Failed to toggle post vote')

            const data = await response.json()

            setLiked(Boolean(data.liked))
            setDisliked(Boolean(data.disliked))
            setLikeCount(Number(data.likeCount) || 0)
            setDislikeCount(Number(data.dislikeCount) || 0)
            setVoteCount(Number(data.voteCount) || 0)
        } catch (error) {
            console.error('Post vote error:', error)
        }
    }

    const handleCommentVote = async (commentId, voteType) => {
        if (currentUserId === null || Number.isNaN(currentUserId)) {
            console.error('currentUserId missing')
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/comment-votes/toggle?userId=${currentUserId}&commentId=${commentId}&voteType=${voteType}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            if (!response.ok) throw new Error('Failed to toggle comment vote')

            const data = await response.json()

            setComments((prev) =>
                prev.map((comment) =>
                    Number(comment.id) === Number(commentId)
                        ? {
                            ...comment,
                            likedByCurrentUser: Boolean(data.liked),
                            dislikedByCurrentUser: Boolean(data.disliked),
                            likeCount: Number(data.likeCount) || 0,
                            dislikeCount: Number(data.dislikeCount) || 0,
                            voteCount: Number(data.voteCount) || 0,
                        }
                        : comment
                )
            )
        } catch (error) {
            console.error('Comment vote error:', error)
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

            const enrichedComment = {
                ...newComment,
                userId:
                    newComment.userId ??
                    newComment.authorId ??
                    newComment.user?.id ??
                    newComment.author?.id ??
                    currentUserId,
                username:
                    newComment.username ||
                    newComment.author?.username ||
                    'user',
                userProfilePicture: buildFileUrl(
                    newComment.userProfilePicture ||
                    newComment.author?.profilePicture ||
                    newComment.user?.profilePicture ||
                    ''
                ),
                pictureUrl: buildFileUrl(
                    newComment.pictureUrl ||
                    newComment.picture ||
                    newComment.imageUrl ||
                    newComment.image ||
                    ''
                ),
                likeCount: Number(newComment.likeCount) || 0,
                dislikeCount: Number(newComment.dislikeCount) || 0,
                voteCount: Number(newComment.voteCount) || 0,
                likedByCurrentUser: Boolean(newComment.likedByCurrentUser),
                dislikedByCurrentUser: Boolean(newComment.dislikedByCurrentUser),
            }

            setComments((prev) => [...prev, enrichedComment])
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
                        src={
                            buildFileUrl(post.userProfilePicture) ||
                            `https://i.pravatar.cc/150?u=${post.userId}`
                        }
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
                            onClick={() => handlePostVote('LIKE')}
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
                            onClick={() => handlePostVote('DISLIKE')}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center',
                                color: disliked ? '#ff3040' : '#f5f5f5',
                            }}
                        >
                            <XVoteIcon filled={disliked} size={22} />
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

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#f5f5f5',
                        marginBottom: 6,
                        flexWrap: 'wrap',
                    }}
                >
                    <span>score: {voteCount}</span>
                    <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                    <span>{dislikeCount} {dislikeCount === 1 ? 'dislike' : 'dislikes'}</span>
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
                        {sortedComments.length === 0 ? (
                            <div style={{ fontSize: 14, color: '#737373' }}>No comments yet.</div>
                        ) : (
                            sortedComments.map((c, i) => (
                                <div
                                    key={c.id || i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 10,
                                        marginBottom: 12,
                                    }}
                                >
                                    <img
                                        src={
                                            buildFileUrl(c.userProfilePicture) ||
                                            `https://i.pravatar.cc/100?u=${c.userId || c.username || i}`
                                        }
                                        alt={c.username || 'user'}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            flexShrink: 0,
                                            marginTop: 2,
                                        }}
                                    />

                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                color: '#f5f5f5',
                                                lineHeight: 1.4,
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            <span style={{ fontWeight: 700, marginRight: 6 }}>
                                                {c.username || 'user'}
                                            </span>
                                            <span>{c.text}</span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                marginTop: 6,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <button
                                                onClick={() => handleCommentVote(c.id, 'LIKE')}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <HeartIcon filled={Boolean(c.likedByCurrentUser)} size={13} />
                                            </button>

                                            <button
                                                onClick={() => handleCommentVote(c.id, 'DISLIKE')}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: Boolean(c.dislikedByCurrentUser) ? '#ff3040' : '#f5f5f5',
                                                }}
                                            >
                                                <XVoteIcon filled={Boolean(c.dislikedByCurrentUser)} size={13} />
                                            </button>

                                            <span style={{ fontSize: 12, color: '#737373' }}>
                                                score: {Number(c.voteCount) || 0}
                                            </span>

                                            <span style={{ fontSize: 12, color: '#737373' }}>
                                                {Number(c.likeCount) || 0} likes
                                            </span>

                                            <span style={{ fontSize: 12, color: '#737373' }}>
                                                {Number(c.dislikeCount) || 0} dislikes
                                            </span>
                                        </div>
                                    </div>
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