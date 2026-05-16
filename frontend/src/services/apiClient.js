
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'

export const UPLOAD_API_BASE_URL = `${API_BASE_URL}/uploads`

export function getToken() {
    return localStorage.getItem('token')
}

export function getCurrentUserId() {
    const userId = localStorage.getItem('userId')
    return userId ? Number(userId) : null
}

export function getCurrentUserRole() {
    return localStorage.getItem('role') || ''
}

export function isAuthenticated() {
    return Boolean(getToken() && getCurrentUserId())
}

export function isAdminUser() {
    return isAuthenticated() && getCurrentUserRole() === 'ADMIN'
}

export function getAuthHeaders(token = getToken()) {
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function saveAuthSession(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('username', data.username)
    localStorage.setItem('role', data.role || 'USER')

    if (data.phoneNumber) {
        localStorage.setItem('phoneNumber', data.phoneNumber)
    }
}

export function clearAuthSession() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('phoneNumber')
}

export function decodeJwtPayload(token = getToken()) {
    if (!token) return null

    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

export function buildFileUrl(value) {
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

export async function parseResponse(response) {
    if (typeof response.text !== 'function') {
        return typeof response.json === 'function'
            ? response.json().catch(() => null)
            : null
    }

    const text = await response.text()

    if (!text) return null

    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

export function getErrorMessage(data, fallback) {
    if (typeof data === 'string' && data) return data
    return data?.message || data?.error || fallback
}

export async function apiRequest(path, options = {}) {
    const {
        token = getToken(),
        headers = {},
        body,
        auth = true,
        errorMessage = 'Request failed',
        ...rest
    } = options

    const requestHeaders = {
        ...(auth ? getAuthHeaders(token) : {}),
        ...headers,
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: requestHeaders,
        body,
    })

    const data = await parseResponse(response)

    if (!response.ok) {
        throw new Error(getErrorMessage(data, errorMessage))
    }

    return data
}

export async function apiJsonRequest(path, options = {}) {
    return apiRequest(path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(options.body),
    })
}
