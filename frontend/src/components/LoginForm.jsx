import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, persistAuthSession } from '../services'

function LoginForm({ setMessage, setError, goToRegister }) {
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    })

    // se executa de fiecare data cand utilizatorul scrie intr un input
    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginData((prev) => ({
            ...prev,  // copiaza toate valorile vechi din obiectul anterior (practic daca rebag parola, username sa ramana salvata in input box)
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()  // cand dam submit se reincarca pagina, dar noi aici nu vrem asta
        setMessage('')
        setError('')

        try {
            const data = await login(loginData)  // trb sync sa pot folosi await (await = astept rs din backend)
            persistAuthSession(data)  // salvam datele din backend in localStorage

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
                data-cy="login-username"
                placeholder="Username"
                value={loginData.username}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                data-cy="login-password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleChange}
                required
            />

            <button type="submit" className="submit-btn" data-cy="login-submit">
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
