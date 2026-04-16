import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:9090/auth'

function RegisterForm({ setMessage, setError, goToLogin }) {
    const navigate = useNavigate()

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        bio: '',
        profilePicture: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setRegisterData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match!')
            return
        }

        const requestBody = {
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
            fullName: registerData.fullName,
            bio: registerData.bio,
            profilePicture: registerData.profilePicture,
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            const data = await response.json().catch(() => null)

            if (!response.ok) {
                setError(typeof data === 'string' ? data : 'Register failed!')
                return
            }

            localStorage.setItem('token', data.token)
            setMessage('Registration successful!')

            setRegisterData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                bio: '',
                profilePicture: '',
            })

            navigate('/home')
        } catch {
            setError('Cannot connect to backend.')
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

            <textarea
                name="bio"
                placeholder="Bio"
                value={registerData.bio}
                onChange={handleChange}
                rows="3"
            />

            <input
                type="text"
                name="profilePicture"
                placeholder="Profile picture URL"
                value={registerData.profilePicture}
                onChange={handleChange}
            />

            <button type="submit" className="submit-btn">
                Register
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