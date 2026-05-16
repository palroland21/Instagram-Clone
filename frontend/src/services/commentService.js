import { apiJsonRequest, apiRequest, buildFileUrl } from './apiClient'

export function normalizeComment(comment, usersMap = new Map(), fallbackUserId = null) {
    const authorId = Number(
        comment.userId ??
        comment.authorId ??
        comment.user?.id ??
        comment.author?.id ??
        fallbackUserId
    )
    const author = usersMap.get(authorId)

    return {
        ...comment,
        userId: authorId,
        username:
            comment.username ||
            comment.author?.username ||
            author?.username ||
            'user',
        userProfilePicture: buildFileUrl(
            comment.userProfilePicture ||
            comment.author?.profilePicture ||
            comment.user?.profilePicture ||
            author?.profilePicture ||
            ''
        ),
        pictureUrl: buildFileUrl(
            comment.pictureUrl ||
            comment.picture ||
            comment.imageUrl ||
            comment.image ||
            ''
        ),
        likeCount: Number(comment.likeCount) || 0,
        dislikeCount: Number(comment.dislikeCount) || 0,
        voteCount: Number(comment.voteCount) || 0,
        likedByCurrentUser: Boolean(comment.likedByCurrentUser),
        dislikedByCurrentUser: Boolean(comment.dislikedByCurrentUser),
    }
}

export function sortCommentsByVotes(comments) {
    return [...comments].sort((a, b) => {
        const byVotes = (Number(b.voteCount) || 0) - (Number(a.voteCount) || 0)
        if (byVotes !== 0) return byVotes

        return new Date(a.postedAt || 0) - new Date(b.postedAt || 0)
    })
}

export function fetchComments(token) {
    return apiRequest('/comments', {
        token,
        errorMessage: 'Failed to fetch comments',
    })
}

export function createComment({ token, userId, postId, text }) {
    return apiJsonRequest('/comments', {
        method: 'POST',
        token,
        body: { userId, postId, text },
        errorMessage: 'Failed to post comment',
    })
}

export function updateComment({ token, userId, postId, commentId, text, pictureUrl }) {
    const body = { userId, postId, text }

    if (pictureUrl !== undefined) {
        body.pictureUrl = pictureUrl
    }

    return apiJsonRequest(`/comments/${commentId}`, {
        method: 'PUT',
        token,
        body,
        errorMessage: 'Failed to update comment',
    })
}

export function deleteComment({ token, userId, commentId }) {
    return apiRequest(`/comments/${commentId}?userId=${userId}`, {
        method: 'DELETE',
        token,
        errorMessage: 'Failed to delete comment',
    })
}

export function toggleCommentVote({ token, userId, commentId, voteType }) {
    return apiRequest(
        `/comment-votes/toggle?userId=${userId}&commentId=${commentId}&voteType=${voteType}`,
        {
            method: 'POST',
            token,
            errorMessage: 'Failed to toggle comment vote',
        }
    )
}
