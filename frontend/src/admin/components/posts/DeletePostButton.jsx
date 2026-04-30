import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";
import ConfirmDialog from "../shared/ConfirmDialog";

function DeletePostButton({ post, postId, onDone }) {
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const title = post.title || "this post";

    function openConfirmDialog() {
        setIsConfirmOpen(true);
    }

    function closeConfirmDialog() {
        if (!loading) {
            setIsConfirmOpen(false);
        }
    }

    async function handleDeletePost() {
        try {
            setLoading(true);
            await adminService.deletePost(postId);
            setIsConfirmOpen(false);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not delete post.");
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
                title="Delete post"
                message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={loading}
                onCancel={closeConfirmDialog}
                onConfirm={handleDeletePost}
            />
        </>
    );
}

export default DeletePostButton;