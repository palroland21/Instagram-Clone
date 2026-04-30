const API_BASE_URL = 'http://localhost:9090'

function timeAgo(dateString) {
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

function buildFileUrl(value) {
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

export { API_BASE_URL, timeAgo, buildFileUrl }