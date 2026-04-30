import EmptyState from "../shared/EmptyState";
import AdminCommentRow from "./AdminCommentRow";

function AdminCommentsTable({ comments, onCommentUpdated }) {
    if (!comments.length) {
        return <EmptyState message="No comments found." />;
    }

    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Comment</th>
                    <th>Author</th>
                    <th>Post</th>
                    <th>Votes</th>
                    <th>Created at</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {comments.map((comment) => {
                    const commentId = comment.id ?? comment.commentId;

                    return (
                        <AdminCommentRow
                            key={commentId}
                            comment={comment}
                            onCommentUpdated={onCommentUpdated}
                        />
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default AdminCommentsTable;