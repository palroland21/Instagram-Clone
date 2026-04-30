export const NOTIFICATIONS_SEEN_EVENT = 'notifications-seen'

export function timeAgo(dateString) {
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

export function getNotificationsLastSeenKey(userId) {
    return `notifications_last_seen_user_${userId}`
}

export function getLatestNotificationTime(notifications) {
    if (!notifications || notifications.length === 0) {
        return 0
    }

    return notifications.reduce((latest, notification) => {
        if (!notification.createdAt) {
            return latest
        }

        const time = new Date(notification.createdAt).getTime()

        if (Number.isNaN(time)) {
            return latest
        }

        return Math.max(latest, time)
    }, 0)
}

export function hasUnreadNotifications(userId, notifications) {
    if (!userId) return false

    const latestNotificationTime = getLatestNotificationTime(notifications)

    if (!latestNotificationTime) {
        return false
    }

    const lastSeenKey = getNotificationsLastSeenKey(userId)
    const lastSeenTime = Number(localStorage.getItem(lastSeenKey) || 0)

    return latestNotificationTime > lastSeenTime
}

export function markNotificationsAsSeen(userId, notifications = []) {
    if (!userId) return

    const latestNotificationTime = getLatestNotificationTime(notifications)
    const seenTime = latestNotificationTime || Date.now()

    localStorage.setItem(
        getNotificationsLastSeenKey(userId),
        String(seenTime)
    )

    window.dispatchEvent(new Event(NOTIFICATIONS_SEEN_EVENT))
}

export function buildNotifications({
                                       postsData,
                                       commentsData,
                                       postVotesData,
                                       usersData,
                                       currentUserId,
                                   }) {
    const usersMap = new Map(
        usersData.map((user) => [Number(user.id), user])
    )

    const myPosts = postsData.filter(
        (post) => Number(post.userId) === Number(currentUserId)
    )

    const myPostIds = new Set(
        myPosts.map((post) => Number(post.id))
    )

    const postsMap = new Map(
        myPosts.map((post) => [Number(post.id), post])
    )

    const commentNotifications = commentsData
        .filter((comment) =>
            myPostIds.has(Number(comment.postId)) &&
            Number(comment.userId) !== Number(currentUserId)
        )
        .map((comment) => {
            const sender = usersMap.get(Number(comment.userId))
            const post = postsMap.get(Number(comment.postId))

            return {
                id: `comment-${comment.id}`,
                type: 'COMMENT',
                createdAt: comment.postedAt || comment.createdAt || null,
                senderId: Number(comment.userId),
                senderUsername: comment.username || sender?.username || 'user',
                senderProfilePicture:
                    comment.userProfilePicture || sender?.profilePicture || '',
                postId: Number(comment.postId),
                postTitle: post?.title || '',
                commentText: comment.text || '',
            }
        })

    const voteNotifications = postVotesData
        .filter((vote) =>
            myPostIds.has(Number(vote.postId)) &&
            Number(vote.userId) !== Number(currentUserId) &&
            ['LIKE', 'DISLIKE'].includes(String(vote.voteType).toUpperCase())
        )
        .map((vote) => {
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

    return [...commentNotifications, ...voteNotifications].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0

        return dateB - dateA
    })
}

export function groupNotifications(notifications) {
    const today = []
    const thisWeek = []
    const older = []

    const now = new Date()

    notifications.forEach((notification) => {
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

    return {
        today,
        thisWeek,
        older,
    }
}