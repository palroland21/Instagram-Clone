import { timeAgo } from './notificationHelpers'

function NotificationItem({ notification }) {
    const avatarSrc =
        notification.senderProfilePicture ||
        `https://i.pravatar.cc/150?u=${notification.senderId}`

    const emoji = getNotificationEmoji(notification.type)

    return (
        <div className="notification-item">
            <div className="notification-avatar-wrapper">
                <img
                    src={avatarSrc}
                    alt={notification.senderUsername}
                    className="notification-avatar"
                />

                <div className="notification-emoji">
                    {emoji}
                </div>
            </div>

            <div className="notification-content">
                <div className="notification-message">
                    <span className="notification-username">
                        {notification.senderUsername}
                    </span>{' '}

                    {notification.type === 'LIKE' && (
                        <span>
                            liked your post
                            <PostTitle title={notification.postTitle} />
                        </span>
                    )}

                    {notification.type === 'DISLIKE' && (
                        <span>
                            disliked your post
                            <PostTitle title={notification.postTitle} />
                        </span>
                    )}

                    {notification.type === 'COMMENT' && (
                        <span>
                            commented on your post
                            <PostTitle title={notification.postTitle} />
                            <CommentText text={notification.commentText} />
                        </span>
                    )}
                </div>

                <div className="notification-time">
                    {timeAgo(notification.createdAt)}
                </div>
            </div>
        </div>
    )
}

function PostTitle({ title }) {
    if (!title) return null

    return (
        <>
            {' '}
            <span className="notification-muted">
                "{title}"
            </span>
        </>
    )
}

function CommentText({ text }) {
    if (!text) return null

    return (
        <>
            {': '}
            <span className="notification-muted">
                {text}
            </span>
        </>
    )
}

function getNotificationEmoji(type) {
    if (type === 'LIKE') return '❤️'
    if (type === 'DISLIKE') return '👎'

    return '💬'
}

export default NotificationItem