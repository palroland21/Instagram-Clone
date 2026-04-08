import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

function AuthPage() {
    const [mode, setMode] = useState('login')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    return (
        <div className="page">
            <div className="auth-card">
                <h1>Instagram Clone</h1>
                <p className="subtitle">
                    {mode === 'login'
                        ? 'Login to your account'
                        : 'Create a new account'}
                </p>

                <div className="switch-buttons">
                    <button
                        type="button"
                        className={mode === 'login' ? 'switch-btn active' : 'switch-btn'}
                        onClick={() => {
                            setMode('login')
                            setMessage('')
                            setError('')
                        }}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className={mode === 'register' ? 'switch-btn active' : 'switch-btn'}
                        onClick={() => {
                            setMode('register')
                            setMessage('')
                            setError('')
                        }}
                    >
                        Register
                    </button>
                </div>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {mode === 'login' ? (
                    <LoginForm
                        setMessage={setMessage}
                        setError={setError}
                        goToRegister={() => {
                            setMode('register')
                            setMessage('')
                            setError('')
                        }}
                    />
                ) : (
                    <RegisterForm
                        setMessage={setMessage}
                        setError={setError}
                        goToLogin={() => {
                            setMode('login')
                            setMessage('')
                            setError('')
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default AuthPage