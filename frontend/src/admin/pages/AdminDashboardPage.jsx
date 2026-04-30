import AdminLayout from "../components/layout/AdminLayout";

function AdminDashboardPage() {
    return (
        <AdminLayout title="Admin Dashboard" subtitle="Manage users, posts and comments from one place.">
            <div className="admin-page">
                <section className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <p className="admin-stat-label">Users</p>
                        <p className="admin-stat-value">0</p>
                    </div>

                    <div className="admin-stat-card">
                        <p className="admin-stat-label">Banned users</p>
                        <p className="admin-stat-value">0</p>
                    </div>

                    <div className="admin-stat-card">
                        <p className="admin-stat-label">Posts</p>
                        <p className="admin-stat-value">0</p>
                    </div>

                    <div className="admin-stat-card">
                        <p className="admin-stat-label">Comments</p>
                        <p className="admin-stat-value">0</p>
                    </div>
                </section>

                <section className="admin-panel">
                    <h2 className="admin-panel-title">Moderation tools</h2>

                    <p className="admin-panel-text">
                        This area will contain the admin tools for banning users,
                        unbanning users, editing posts, deleting posts, editing comments
                        and deleting comments.
                    </p>
                </section>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboardPage;