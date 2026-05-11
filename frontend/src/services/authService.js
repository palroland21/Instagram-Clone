import { apiJsonRequest, saveAuthSession } from './apiClient'
import { uploadSingleImage } from './uploadService'

export async function login(credentials) {
    return apiJsonRequest('/auth/login', {
        method: 'POST',
        auth: false,
        body: credentials,
        errorMessage: 'Login failed!',
    })
}

export async function register(userData) {
    return apiJsonRequest('/auth/register', {
        method: 'POST',
        auth: false,
        body: userData,
        errorMessage: 'Register failed!',
    })
}

export async function registerWithProfilePicture(registerData, profilePictureFile) {
    const profilePicture = profilePictureFile
        ? await uploadSingleImage(profilePictureFile, null)
        : ''

    return register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName,
        phoneNumber: registerData.phoneNumber,
        bio: registerData.bio,
        profilePicture,
    })
}

export function persistAuthSession(data) {
    saveAuthSession(data)
}
