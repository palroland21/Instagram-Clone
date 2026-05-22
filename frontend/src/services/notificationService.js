import { apiRequest } from './apiClient'

export async function fetchNotificationsData({ token, currentUserId }) {
    return apiRequest(`/notifications?userId=${currentUserId}`, {
        token,
        errorMessage: 'Failed to fetch notifications',
    })
}
