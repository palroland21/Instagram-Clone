import AdminLayout from "../components/layout/AdminLayout";

function AdminCommentsPage() {
    return (
        <AdminLayout title="Comments" subtitle="Edit or remove inappropriate comments.">
            <div className="admin-panel">
                <h2 className="admin-panel-title">Comments moderation</h2>
                <p className="admin-panel-text">
                    Comments table will be implemented here.
                </p>
            </div>
        </AdminLayout>
    );
}

export default AdminCommentsPage;