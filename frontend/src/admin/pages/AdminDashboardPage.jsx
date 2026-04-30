import AdminLayout from "../components/layout/AdminLayout";
import ErrorMessage from "../components/shared/ErrorMessage";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { useAdminStats } from "../hooks/useAdminStats";

function AdminDashboardPage() {
    const { stats, loading, error, reloadStats } = useAdminStats();

    return (
        <AdminLayout
            title="Admin Dashboard"
            subtitle="Manage users, posts and comments from one place."
        >
            <div className="admin-page">
                {loading && <LoadingSpinner />}

                {!loading && error && (
                    <ErrorMessage message={error} />
                )}

                {!loading && !error && (
                    <>
                        <section className="admin-stats-grid">
                            <div className="admin-stat-card">
                                <p className="admin-stat-label">Users</p>
                                <p className="admin-stat-value">{stats.usersCount}</p>
                            </div>

                            <div className="admin-stat-card">
                                <p className="admin-stat-label">Banned users</p>
                                <p className="admin-stat-value">{stats.bannedUsersCount}</p>
                            </div>

                            <div className="admin-stat-card">
                                <p className="admin-stat-label">Posts</p>
                                <p className="admin-stat-value">{stats.postsCount}</p>
                            </div>

                            <div className="admin-stat-card">
                                <p className="admin-stat-label">Comments</p>
                                <p className="admin-stat-value">{stats.commentsCount}</p>
                            </div>
                        </section>

                        <section className="admin-panel">
                            <div className="admin-panel-header">
                                <div>
                                    <h2 className="admin-panel-title">Moderation overview</h2>
                                    <p className="admin-panel-text">
                                        These values are loaded directly from the backend.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="admin-button admin-button-default"
                                    onClick={reloadStats}
                                >
                                    Refresh
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminDashboardPage;