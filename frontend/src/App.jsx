import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ProfilePage from "./pages/ProfilePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import NotificationsPage from './pages/NotificationsPage'
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminUsersPage from "./admin/pages/AdminUsersPage";
import AdminPostsPage from "./admin/pages/AdminPostsPage";
import AdminCommentsPage from "./admin/pages/AdminCommentsPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/posts" element={<AdminPostsPage />} />
            <Route path="/admin/comments" element={<AdminCommentsPage />} />
        </Routes>
    )
}

export default App
