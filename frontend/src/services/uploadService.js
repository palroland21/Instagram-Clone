import { apiRequest } from './apiClient'

export async function uploadSingleImage(file, token) {
    const formData = new FormData()
    formData.append('file', file)

    const data = await apiRequest('/uploads/image', {
        method: 'POST',
        token,
        body: formData,
        errorMessage: 'Image upload failed',
    })

    return data?.url || ''
}
