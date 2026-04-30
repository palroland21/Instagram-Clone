import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";
import ConfirmDialog from "../shared/ConfirmDialog";

function DeleteCommentButton({ comment, commentId, onDone }) {
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const preview = comment.text || comment.content || "this comment";

    function openConfirmDialog() {
        setIsConfirmOpen(true);
    }

    function closeConfirmDialog() {
        if (!loading) {
            setIsConfirmOpen(false);
        }
    }

    async function handleDeleteComment() {
        try {
            setLoading(true);
            await adminService.deleteComment(commentId);
            setIsConfirmOpen(false);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not delete comment.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AdminButton
                variant="danger"
                disabled={loading}
                onClick={openConfirmDialog}
            >
                Delete
            </AdminButton>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Delete comment"
                message={`Are you sure you want to delete "${preview.slice(
                    0,
                    80
                )}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={loading}
                onCancel={closeConfirmDialog}
                onConfirm={handleDeleteComment}
            />
        </>
    );
}

export default DeleteCommentButton;