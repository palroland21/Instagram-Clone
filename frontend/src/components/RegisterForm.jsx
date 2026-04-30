import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTH_API_BASE_URL = 'http://localhost:9090/auth'
const UPLOAD_API_BASE_URL = 'http://localhost:9090/uploads'

function RegisterForm({ setMessage, setError, goToLogin }) {
    const navigate = useNavigate()

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: '',
        bio: '',
        profilePicture: '',
    })

    const [profilePictureFile, setProfilePictureFile] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setRegisterData((prev) => ({
            ...prev,
            [name]: name === 'phoneNumber' ? value.replace(/\D/g, '') : value,
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null
        setProfilePictureFile(file)
    }

    const isValidPhoneNumber = (phoneNumber) => {
        return /^\d{10,15}$/.test(phoneNumber)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match!')
            return
        }

        if (!isValidPhoneNumber(registerData.phoneNumber)) {
            setError('Phone number must contain only digits and must have between 10 and 15 digits.')
            return
        }

        setIsSubmitting(true)

        try {
            let uploadedImageUrl = ''

            if (profilePictureFile) {
                const formData = new FormData()
                formData.append('file', profilePictureFile)

                const uploadResponse = await fetch(`${UPLOAD_API_BASE_URL}/image`, {
                    method: 'POST',
                    body: formData,
                })

                const uploadText = await uploadResponse.text()
                const uploadData = uploadText ? JSON.parse(uploadText) : null

                if (!uploadResponse.ok) {
                    setError(uploadData?.message || 'Image upload failed!')
                    setIsSubmitting(false)
                    return
                }

                uploadedImageUrl = uploadData.url
            }

            const requestBody = {
                username: registerData.username,
                email: registerData.email,
                password: registerData.password,
                fullName: registerData.fullName,
                phoneNumber: registerData.phoneNumber,
                bio: registerData.bio,
                profilePicture: uploadedImageUrl,
            }

            const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            const responseText = await response.text()
            let data = null

            try {
                data = responseText ? JSON.parse(responseText) : null
            } catch {
                data = responseText
            }

            if (!response.ok) {
                setError(typeof data === 'string' ? data : 'Register failed!')
                setIsSubmitting(false)
                return
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('username', data.username)

            if (data.phoneNumber) {
                localStorage.setItem('phoneNumber', data.phoneNumber)
            }

            setMessage('Registration successful!')

            setRegisterData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                phoneNumber: '',
                bio: '',
                profilePicture: '',
            })

            setProfilePictureFile(null)
            navigate('/home')
        } catch {
            setError('Cannot connect to backend.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={registerData.username}
                onChange={handleChange}
                required
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={registerData.fullName}
                onChange={handleChange}
                required
            />

            <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone number, example: 0744611228"
                value={registerData.phoneNumber}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]{10,15}"
                title="Phone number must contain only digits and must have between 10 and 15 digits."
                required
            />

            <textarea
                name="bio"
                placeholder="Bio"
                value={registerData.bio}
                onChange={handleChange}
                rows="3"
            />

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            <p className="bottom-text">
                Already have an account?{' '}
                <span
                    className="link-text"
                    onClick={goToLogin}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            goToLogin()
                        }
                    }}
                    role="button"
                    tabIndex={0}
                >
                    Login
                </span>
            </p>
        </form>
    )
}

export default RegisterForm