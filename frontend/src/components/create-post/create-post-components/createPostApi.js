const API_BASE_URL = 'http://localhost:9090'

export async function uploadSingleImage(file, token) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message || 'Image upload failed')
    }

    return data.url
}

export async function createPost({
                                     token,
                                     userId,
                                     pictureUrls,
                                     caption,
                                     location,
                                     tags,
                                 }) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            pictureUrls,
            caption,
            location,
            tagNames: tags,
            title: caption.trim().slice(0, 60) || 'Post',
        }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message || 'Failed to create post')
    }

    return data
}