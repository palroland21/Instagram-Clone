import AdminLayout from "../components/layout/AdminLayout";
import ErrorMessage from "../components/shared/ErrorMessage";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AdminPostsTable from "../components/posts/AdminPostsTable";
import { useAdminPosts } from "../hooks/useAdminPosts";

function AdminPostsPage() {
    const { posts, loading, error, reloadPosts } = useAdminPosts();

    return (
        <AdminLayout
            title="Posts"
            subtitle="Edit or remove inappropriate posts."
        >
            <div className="admin-page">
                {loading && <LoadingSpinner />}

                {!loading && error && <ErrorMessage message={error} />}

                {!loading && !error && (
                    <AdminPostsTable
                        posts={posts}
                        onPostUpdated={reloadPosts}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminPostsPage;