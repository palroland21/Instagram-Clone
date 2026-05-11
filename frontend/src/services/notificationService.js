import { fetchComments } from './commentService'
import { fetchPosts } from './postService'
import { apiRequest } from './apiClient'
import { fetchUsers } from './userService'

export async function fetchNotificationsData({ token, currentUserId }) {
    const [postsData, commentsData, postVotesData, usersData] = await Promise.all([
        fetchPosts({ token, currentUserId }),
        fetchComments(token),
        apiRequest('/post-votes', {
            token,
            errorMessage: 'Failed to fetch post votes',
        }),
        fetchUsers(token),
    ])

    return {
        postsData,
        commentsData,
        postVotesData,
        usersData,
    }
}
