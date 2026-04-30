import AdminLayout from "../components/layout/AdminLayout";
import ErrorMessage from "../components/shared/ErrorMessage";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AdminCommentsTable from "../components/comments/AdminCommentsTable";
import { useAdminComments } from "../hooks/useAdminComments";

function AdminCommentsPage() {
    const { comments, loading, error, reloadComments } = useAdminComments();

    return (
        <AdminLayout
            title="Comments"
            subtitle="Edit or remove inappropriate comments."
        >
            <div className="admin-page">
                {loading && <LoadingSpinner />}

                {!loading && error && <ErrorMessage message={error} />}

                {!loading && !error && (
                    <AdminCommentsTable
                        comments={comments}
                        onCommentUpdated={reloadComments}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminCommentsPage;