import { apiJsonRequest, apiRequest, buildFileUrl } from './apiClient'
import { normalizeComment, sortCommentsByVotes } from './commentService'
import { isCypressTestComment, isCypressTestPost } from './testDataFilter'

function getOwnerId(item) {
    return item.userId ?? item.authorId ?? item.user?.id ?? item.author?.id ?? null
}

export function normalizePost(post, usersMap = new Map()) {
    const ownerId = Number(getOwnerId(post))
    const author = usersMap.get(ownerId)
    const normalizedComments = Array.isArray(post.comments)
        ? sortCommentsByVotes(post.comments.map((comment) => normalizeComment(comment, usersMap)))
        : []
    const status = post.status === 'OUTDATED'
        ? 'OUTDATED'
        : normalizedComments.length > 0
            ? 'FIRST_REACTIONS'
            : post.status || 'JUST_POSTED'

    return {
        ...post,
        status,
        userId: ownerId,
        username:
            post.username ||
            post.author?.username ||
            author?.username ||
            'user',
        userProfilePicture: buildFileUrl(
            post.userProfilePicture ||
            post.author?.profilePicture ||
            author?.profilePicture ||
            ''
        ),
        pictureUrls: Array.isArray(post.pictureUrls)
            ? post.pictureUrls.map((url) => buildFileUrl(url))
            : [],
        pictureUrl: buildFileUrl(
            post.pictureUrl ||
            post.picture ||
            post.imageUrl ||
            post.image ||
            post.photoUrl ||
            ''
        ),
        likeCount: Number(post.likeCount) || 0,
        dislikeCount: Number(post.dislikeCount) || 0,
        voteCount: Number(post.voteCount) || 0,
        likedByCurrentUser: Boolean(post.likedByCurrentUser),
        dislikedByCurrentUser: Boolean(post.dislikedByCurrentUser),
        comments: normalizedComments,
    }
}

export function sortPostsNewestFirst(posts) {
    return [...posts].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

function hideTestPostData(post) {
    if (!Array.isArray(post.comments)) {
        return post
    }

    return {
        ...post,
        comments: post.comments.filter((comment) => !isCypressTestComment(comment)),
    }
}

export async function fetchPosts({
    token,
    currentUserId,
    tag,
    text,
    userId,
    onlyMine,
    page,
    size,
    excludeTestData,
} = {}) {
    const params = new URLSearchParams()

    if (currentUserId) params.set('currentUserId', currentUserId)
    if (tag) params.set('tag', tag)
    if (text) params.set('text', text)
    if (userId) params.set('userId', userId)
    if (onlyMine) params.set('onlyMine', 'true')
    if (page !== undefined) params.set('page', page)
    if (size !== undefined) params.set('size', size)
    if (excludeTestData) params.set('excludeTestData', 'true')

    const query = params.toString() ? `?${params.toString()}` : ''

    const posts = await apiRequest(`/posts${query}`, {
        token,
        errorMessage: 'Failed to fetch posts',
    })

    if (!Array.isArray(posts)) {
        return posts
    }

    return posts
        .filter((post) => !isCypressTestPost(post))
        .map(hideTestPostData)
}

export async function fetchFeedPosts({
    token,
    currentUserId,
    page = 0,
    size = 12,
}) {
    const postsData = await fetchPosts({
        token,
        currentUserId,
        page,
        size,
        excludeTestData: true,
    })
    const usersMap = new Map()
    const visiblePosts = postsData.filter((post) => !isCypressTestPost(post))

    return sortPostsNewestFirst(
        visiblePosts.map((post) => {
            const normalizedPost = normalizePost(post, usersMap)

            return {
                ...normalizedPost,
                comments: normalizedPost.comments.filter(
                    (comment) => !isCypressTestComment(comment)
                ),
            }
        })
    )
}

export async function fetchSearchPosts({ token, currentUserId }) {
    const postsData = await fetchPosts({
        token,
        currentUserId,
        page: 0,
        size: 20,
        excludeTestData: true,
    })

    return sortPostsNewestFirst(
        postsData.map((post) => normalizePost(post))
    )
}

export function fetchProfilePosts({ token, userId, currentUserId }) {
    const params = new URLSearchParams()

    if (currentUserId) params.set('currentUserId', currentUserId)
    params.set('excludeTestData', 'true')

    return apiRequest(`/posts/user/${userId}?${params.toString()}`, {
        token,
        errorMessage: 'Failed to fetch profile posts',
    })
}

export function createPost({ token, userId, pictureUrls, caption, location, tags }) {
    return apiJsonRequest('/posts', {
        method: 'POST',
        token,
        body: {
            userId,
            pictureUrls,
            caption,
            location,
            tagNames: tags,
        },
        errorMessage: 'Failed to create post',
    })
}

export function updatePost({ token, postId, payload }) {
    return apiJsonRequest(`/posts/${postId}`, {
        method: 'PUT',
        token,
        body: payload,
        errorMessage: 'Failed to update post',
    })
}

export function deletePost({ token, postId, userId }) {
    return apiRequest(`/posts/${postId}?userId=${userId}`, {
        method: 'DELETE',
        token,
        errorMessage: 'Failed to delete post',
    })
}

export function closePostComments({ token, postId, userId }) {
    return apiRequest(`/posts/${postId}/close-comments?userId=${userId}`, {
        method: 'POST',
        token,
        errorMessage: 'Failed to close comments',
    })
}

export function togglePostVote({ token, userId, postId, voteType }) {
    return apiRequest(
        `/post-votes/toggle?userId=${userId}&postId=${postId}&voteType=${voteType}`,
        {
            method: 'POST',
            token,
            errorMessage: 'Failed to toggle post vote',
        }
    )
}
