import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, persistAuthSession } from '../services'

function LoginForm({ setMessage, setError, goToRegister }) {
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        try {
            const data = await login(loginData)
            persistAuthSession(data)

            setMessage('Login successful!')

            setLoginData({
                username: '',
                password: '',
            })

            navigate('/home')
        } catch (error) {
            setError(error.message || 'Cannot connect to backend.')
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={loginData.username}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleChange}
                required
            />

            <button type="submit" className="submit-btn">
                Login
            </button>

            <p className="bottom-text">
                Don&apos;t have an account?{' '}
                <span
                    className="link-text"
                    onClick={goToRegister}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            goToRegister()
                        }
                    }}
                    role="button"
                    tabIndex={0}
                >
                    Register
                </span>
            </p>
        </form>
    )
}

export default LoginForm
