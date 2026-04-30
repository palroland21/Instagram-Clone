const API_BASE_URL = 'http://localhost:9090'

export async function fetchNotificationsData({ token, currentUserId }) {
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const [postsRes, commentsRes, postVotesRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/posts?currentUserId=${currentUserId}`, { headers }),
        fetch(`${API_BASE_URL}/comments`, { headers }),
        fetch(`${API_BASE_URL}/post-votes`, { headers }),
        fetch(`${API_BASE_URL}/users`, { headers }),
    ])

    if (!postsRes.ok) {
        throw new Error('Failed to fetch posts')
    }

    if (!commentsRes.ok) {
        throw new Error('Failed to fetch comments')
    }

    if (!postVotesRes.ok) {
        throw new Error('Failed to fetch post votes')
    }

    if (!usersRes.ok) {
        throw new Error('Failed to fetch users')
    }

    const postsData = await postsRes.json()
    const commentsData = await commentsRes.json()
    const postVotesData = await postVotesRes.json()
    const usersData = await usersRes.json()

    return {
        postsData,
        commentsData,
        postVotesData,
        usersData,
    }
}