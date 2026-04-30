import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";

function DeletePostButton({ post, postId, onDone }) {
    const [loading, setLoading] = useState(false);

    async function handleDeletePost() {
        const title = post.title || "this post";

        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            await adminService.deletePost(postId);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not delete post.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminButton
            variant="danger"
            disabled={loading}
            onClick={handleDeletePost}
        >
            {loading ? "Deleting..." : "Delete"}
        </AdminButton>
    );
}

export default DeletePostButton;