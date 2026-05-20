import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { persistAuthSession, registerWithProfilePicture } from '../services'

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

        setIsSubmitting(true)  // intre timp ce se trimite formarul sa dezactiv butonu de submit

        try {
            const data = await registerWithProfilePicture(registerData, profilePictureFile)
            persistAuthSession(data)

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
        } catch (error) {
            setError(error.message || 'Cannot connect to backend.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                data-cy="register-username"
                placeholder="Username"
                value={registerData.username}
                onChange={handleChange}
                required
            />

            <input
                type="email"
                name="email"
                data-cy="register-email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                data-cy="register-password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="confirmPassword"
                data-cy="register-confirm-password"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="fullName"
                data-cy="register-full-name"
                placeholder="Full name"
                value={registerData.fullName}
                onChange={handleChange}
                required
            />

            <input
                type="tel"
                name="phoneNumber"
                data-cy="register-phone"
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
                data-cy="register-bio"
                placeholder="Bio"
                value={registerData.bio}
                onChange={handleChange}
                rows="3"
            />

            <input
                type="file"
                data-cy="register-profile-picture"
                accept="image/*"
                onChange={handleFileChange}
            />

            <button type="submit" className="submit-btn" disabled={isSubmitting} data-cy="register-submit">
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
