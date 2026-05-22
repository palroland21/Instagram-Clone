import { apiJsonRequest, apiRequest, decodeJwtPayload } from './apiClient'
import { isCypressTestUser } from './testDataFilter'

export function fetchUsers(token) {
    return apiRequest('/users', {
        token,
        errorMessage: 'Failed to fetch users',
    })
}

export function fetchUserById(userId, token) {
    return apiRequest(`/users/${userId}`, {
        token,
        errorMessage: 'Failed to fetch user',
    })
}

export function fetchUserByUsername(username, token) {
    return apiRequest(`/users/username/${encodeURIComponent(username)}`, {
        token,
        errorMessage: 'Failed to fetch user',
    })
}

export function updateUser({ token, userId, userData }) {
    return apiJsonRequest(`/users/${userId}`, {
        method: 'PUT',
        token,
        body: userData,
        errorMessage: 'Failed to update profile.',
    })
}

export async function fetchFollowers(userId, token) {
    const followers = await apiRequest(`/users/${userId}/followers`, {
        token,
        errorMessage: 'Failed to fetch followers',
    })

    return Array.isArray(followers)
        ? followers.filter((user) => !isCypressTestUser(user))
        : followers
}

export async function fetchFollowing(userId, token) {
    const following = await apiRequest(`/users/${userId}/following`, {
        token,
        errorMessage: 'Failed to fetch following',
    })

    return Array.isArray(following)
        ? following.filter((user) => !isCypressTestUser(user))
        : following
}

export function toggleFollow({ token, currentUserId, targetUserId, isFollowing }) {
    return apiRequest(`/users/${currentUserId}/following/${targetUserId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        token,
        errorMessage: 'Failed to update follow status',
    })
}

export function findCurrentUser(users, token, storedUserId = null) {
    if (storedUserId) {
        const user = users.find((item) => Number(item.id) === Number(storedUserId))
        if (user) return user
    }

    const payload = decodeJwtPayload(token)

    if (payload?.sub) {
        return users.find((item) => item.username === payload.sub) || null
    }

    return null
}

export async function fetchCurrentUser({ token, storedUserId = null }) {
    const users = await fetchUsers(token)
    return findCurrentUser(users, token, storedUserId)
}
