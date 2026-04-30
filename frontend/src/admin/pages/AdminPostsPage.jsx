import AdminLayout from "../components/layout/AdminLayout";

function AdminPostsPage() {
    return (
        <AdminLayout title="Posts" subtitle="Edit or remove inappropriate posts.">
            <div className="admin-panel">
                <h2 className="admin-panel-title">Posts moderation</h2>
                <p className="admin-panel-text">
                    Posts table will be implemented here.
                </p>
            </div>
        </AdminLayout>
    );
}

export default AdminPostsPage;