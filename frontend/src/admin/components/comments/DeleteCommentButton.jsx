import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";

function DeleteCommentButton({ comment, commentId, onDone }) {
    const [loading, setLoading] = useState(false);

    async function handleDeleteComment() {
        const preview = comment.text || comment.content || "this comment";

        const confirmed = window.confirm(
            `Are you sure you want to delete "${preview.slice(0, 60)}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            await adminService.deleteComment(commentId);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not delete comment.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminButton
            variant="danger"
            disabled={loading}
            onClick={handleDeleteComment}
        >
            {loading ? "Deleting..." : "Delete"}
        </AdminButton>
    );
}

export default DeleteCommentButton;