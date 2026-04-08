import { useNavigate } from 'react-router-dom'

function HomePage() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <div className="home-page">
            <div className="home-card">
                <h1>Home Page</h1>
                <p>You are logged in.</p>
                <button className="submit-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default HomePage