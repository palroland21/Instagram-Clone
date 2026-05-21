import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ProfilePage from "./pages/profile-page/ProfilePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminUsersPage from "./admin/pages/AdminUsersPage";
import AdminPostsPage from "./admin/pages/AdminPostsPage";
import AdminCommentsPage from "./admin/pages/AdminCommentsPage";
import NotificationsPage from './pages/notification-page/NotificationsPage.jsx'
import { getCurrentUserRole, getToken } from './services/apiClient'

function UnauthorizedPage() {
    return (
        <div className="unauthorized-page">
            <div className="unauthorized-card">
                <h1>Not authorized</h1>
                <p>You are not authorized to access this page.</p>
            </div>
        </div>
    )
}

function AdminRoute({ children }) {
    const token = getToken()
    const role = getCurrentUserRole()

    if (!token) {
        return <Navigate to="/" replace />
    }

    if (role !== 'ADMIN') {
        return <UnauthorizedPage />
    }

    return children
}

function AuthenticatedRoute({ children }) {
    const token = getToken()

    if (!token) {
        return <Navigate to="/" replace />
    }

    return children
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<AuthenticatedRoute><HomePage /></AuthenticatedRoute>} />
            <Route path="/profile" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />
            <Route path="/profile/:targetUsername" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/search" element={<AuthenticatedRoute><SearchPage /></AuthenticatedRoute>} />
            <Route path="/notifications" element={<AuthenticatedRoute><NotificationsPage /></AuthenticatedRoute>} />
            <Route path="/notification" element={<AuthenticatedRoute><NotificationsPage /></AuthenticatedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/posts" element={<AdminRoute><AdminPostsPage /></AdminRoute>} />
            <Route path="/admin/comments" element={<AdminRoute><AdminCommentsPage /></AdminRoute>} />
        </Routes>
    )
}

export default App
