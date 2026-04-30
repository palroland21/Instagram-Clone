import EmptyState from "../shared/EmptyState";
import AdminPostsRow from "./AdminPostsRow";

function AdminPostsTable({ posts, onPostUpdated }) {
    if (!posts.length) {
        return <EmptyState message="No posts found." />;
    }

    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Post</th>
                    <th>Author</th>
                    <th>Text</th>
                    <th>Status</th>
                    <th>Created at</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {posts.map((post) => {
                    const postId = post.id ?? post.postId;

                    return (
                        <AdminPostsRow
                            key={postId}
                            post={post}
                            onPostUpdated={onPostUpdated}
                        />
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPostsTable;