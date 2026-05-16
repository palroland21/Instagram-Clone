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
import { isAdminUser, isAuthenticated } from './services'

function PublicRoute({ children }) {
    return isAuthenticated() ? <Navigate to="/home" replace /> : children
}

function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/" replace />
}

function AdminRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />
    }

    return isAdminUser() ? children : <Navigate to="/home" replace />
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/:targetUsername" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/posts" element={<AdminRoute><AdminPostsPage /></AdminRoute>} />
            <Route path="/admin/comments" element={<AdminRoute><AdminCommentsPage /></AdminRoute>} />
            <Route path="*" element={<Navigate to={isAuthenticated() ? '/home' : '/'} replace />} />
        </Routes>
    )
}

export default App
