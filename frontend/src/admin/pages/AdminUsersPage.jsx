import AdminLayout from "../components/layout/AdminLayout";

function AdminUsersPage() {
    return (
        <AdminLayout title="Users" subtitle="Ban, unban and inspect application users.">
            <div className="admin-panel">
                <h2 className="admin-panel-title">Users management</h2>
                <p className="admin-panel-text">
                    Users table will be implemented here.
                </p>
            </div>
        </AdminLayout>
    );
}

export default AdminUsersPage;