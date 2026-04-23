import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'

const API_BASE_URL = 'http://localhost:9090'

function timeAgo(dateString) {
    if (!dateString) return ''

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

function NotificationsPage() {
    const [activeItem, setActiveItem] = useState('notifications')
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const token = localStorage.getItem('token')
    const currentUserId = localStorage.getItem('userId')
        ? Number(localStorage.getItem('userId'))
        : null

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true)
                setError('')

                if (!token || !currentUserId) {
                    setError('You are not logged in.')
                    setLoading(false)
                    return
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                }

                const [postsRes, commentsRes, postVotesRes, usersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/posts?currentUserId=${currentUserId}`, { headers }),
                    fetch(`${API_BASE_URL}/comments`, { headers }),
                    fetch(`${API_BASE_URL}/post-votes`, { headers }),
                    fetch(`${API_BASE_URL}/users`, { headers }),
                ])

                if (!postsRes.ok) throw new Error('Failed to fetch posts')
                if (!commentsRes.ok) throw new Error('Failed to fetch comments')
                if (!postVotesRes.ok) throw new Error('Failed to fetch post votes')
                if (!usersRes.ok) throw new Error('Failed to fetch users')

                const postsData = await postsRes.json()
                const commentsData = await commentsRes.json()
                const postVotesData = await postVotesRes.json()
                const usersData = await usersRes.json()

                const usersMap = new Map(
                    usersData.map(user => [Number(user.id), user])
                )

                const myPosts = postsData.filter(
                    post => Number(post.userId) === Number(currentUserId)
                )

                const myPostIds = new Set(myPosts.map(post => Number(post.id)))
                const postsMap = new Map(
                    myPosts.map(post => [Number(post.id), post])
                )

                const commentNotifications = commentsData
                    .filter(comment =>
                        myPostIds.has(Number(comment.postId)) &&
                        Number(comment.userId) !== Number(currentUserId)
                    )
                    .map(comment => {
                        const sender = usersMap.get(Number(comment.userId))
                        const post = postsMap.get(Number(comment.postId))

                        return {
                            id: `comment-${comment.id}`,
                            type: 'COMMENT',
                            createdAt: comment.postedAt || comment.createdAt || null,
                            senderId: Number(comment.userId),
                            senderUsername:
                                comment.username || sender?.username || 'user',
                            senderProfilePicture:
                                comment.userProfilePicture || sender?.profilePicture || '',
                            postId: Number(comment.postId),
                            postTitle: post?.title || '',
                            commentText: comment.text || '',
                        }
                    })

                const voteNotifications = postVotesData
                    .filter(vote =>
                        myPostIds.has(Number(vote.postId)) &&
                        Number(vote.userId) !== Number(currentUserId) &&
                        ['LIKE', 'DISLIKE'].includes(String(vote.voteType).toUpperCase())
                    )
                    .map(vote => {
                        const sender = usersMap.get(Number(vote.userId))
                        const post = postsMap.get(Number(vote.postId))
                        const voteType = String(vote.voteType).toUpperCase()

                        return {
                            id: `${voteType.toLowerCase()}-${vote.id}`,
                            type: voteType,
                            createdAt: vote.createdAt || null,
                            senderId: Number(vote.userId),
                            senderUsername: vote.username || sender?.username || 'user',
                            senderProfilePicture:
                                vote.userProfilePicture || sender?.profilePicture || '',
                            postId: Number(vote.postId),
                            postTitle: post?.title || '',
                        }
                    })

                const merged = [...commentNotifications, ...voteNotifications].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                    return dateB - dateA
                })

                setNotifications(merged)
            } catch (err) {
                console.error('Notifications fetch error:', err)
                setError('Could not load notifications.')
            } finally {
                setLoading(false)
            }
        }

        loadNotifications()
    }, [token, currentUserId])

    const groupedNotifications = useMemo(() => {
        const today = []
        const thisWeek = []
        const older = []

        const now = new Date()

        notifications.forEach(notification => {
            if (!notification.createdAt) {
                older.push(notification)
                return
            }

            const created = new Date(notification.createdAt)
            const diffMs = now - created
            const diffDays = diffMs / (1000 * 60 * 60 * 24)

            if (diffDays < 1) {
                today.push(notification)
            } else if (diffDays < 7) {
                thisWeek.push(notification)
            } else {
                older.push(notification)
            }
        })

        return { today, thisWeek, older }
    }, [notifications])

    const renderNotification = (notification) => {
        const avatarSrc =
            notification.senderProfilePicture ||
            `https://i.pravatar.cc/150?u=${notification.senderId}`

        const emoji =
            notification.type === 'LIKE'
                ? '❤️'
                : notification.type === 'DISLIKE'
                    ? '👎'
                    : '💬'

        return (
            <div
                key={notification.id}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: '1px solid #262626',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={avatarSrc}
                        alt={notification.senderUsername}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            right: -4,
                            bottom: -4,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                        }}
                    >
                        {emoji}
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 14,
                            color: '#f5f5f5',
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                        }}
                    >
                    <span style={{ fontWeight: 700 }}>
                        {notification.senderUsername}
                    </span>{' '}

                        {notification.type === 'LIKE' && (
                            <span>
                            liked your post
                                {notification.postTitle ? (
                                    <>
                                        {' '}
                                        <span style={{ color: '#a8a8a8' }}>
                                        "{notification.postTitle}"
                                    </span>
                                    </>
                                ) : null}
                        </span>
                        )}

                        {notification.type === 'DISLIKE' && (
                            <span>
                            disliked your post
                                {notification.postTitle ? (
                                    <>
                                        {' '}
                                        <span style={{ color: '#a8a8a8' }}>
                                        "{notification.postTitle}"
                                    </span>
                                    </>
                                ) : null}
                        </span>
                        )}

                        {notification.type === 'COMMENT' && (
                            <span>
                            commented on your post
                                {notification.postTitle ? (
                                    <>
                                        {' '}
                                        <span style={{ color: '#a8a8a8' }}>
                                        "{notification.postTitle}"
                                    </span>
                                    </>
                                ) : null}
                                {notification.commentText ? (
                                    <>
                                        {': '}
                                        <span style={{ color: '#a8a8a8' }}>
                                        {notification.commentText}
                                    </span>
                                    </>
                                ) : null}
                        </span>
                        )}
                    </div>

                    <div
                        style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: '#737373',
                        }}
                    >
                        {timeAgo(notification.createdAt)}
                    </div>
                </div>
            </div>
        )
    }

    const renderSection = (title, items) => {
        if (items.length === 0) return null

        return (
            <section style={{ marginBottom: 28 }}>
                <h2
                    style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#f5f5f5',
                        marginBottom: 8,
                    }}
                >
                    {title}
                </h2>

                <div>
                    {items.map(renderNotification)}
                </div>
            </section>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isMobile={false}
            />

            <main
                style={{
                    marginLeft: 244,
                    maxWidth: 900,
                    padding: '32px 24px 60px',
                    marginRight: 'auto',
                }}
            >
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <h1
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            marginBottom: 24,
                        }}
                    >
                        Notifications
                    </h1>

                    {loading && (
                        <div style={infoStyle}>Loading notifications...</div>
                    )}

                    {error && (
                        <div style={infoStyle}>{error}</div>
                    )}

                    {!loading && !error && notifications.length === 0 && (
                        <div style={infoStyle}>No notifications yet.</div>
                    )}

                    {!loading && !error && notifications.length > 0 && (
                        <>
                            {renderSection('Today', groupedNotifications.today)}
                            {renderSection('This week', groupedNotifications.thisWeek)}
                            {renderSection('Older', groupedNotifications.older)}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

const infoStyle = {
    color: '#a8a8a8',
    textAlign: 'center',
    padding: '24px 0',
}

export default NotificationsPage