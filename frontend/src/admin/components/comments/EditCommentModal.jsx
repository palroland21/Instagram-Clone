import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";

function EditCommentModal({ comment, commentId, onDone }) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState(comment.text || comment.content || "");
    const [loading, setLoading] = useState(false);

    function openModal() {
        setText(comment.text || comment.content || "");
        setIsOpen(true);
    }

    function closeModal() {
        if (!loading) {
            setIsOpen(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!text.trim()) {
            alert("Comment text is required.");
            return;
        }

        try {
            setLoading(true);

            await adminService.editComment(commentId, {
                text: text.trim(),
            });

            setIsOpen(false);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not edit comment.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AdminButton variant="default" onClick={openModal}>
                Edit
            </AdminButton>

            {isOpen && (
                <div className="admin-modal-backdrop">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h2>Edit comment</h2>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={closeModal}
                                disabled={loading}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-form" onSubmit={handleSubmit}>
                            <label className="admin-form-field">
                                <span>Text</span>
                                <textarea
                                    value={text}
                                    onChange={(event) => setText(event.target.value)}
                                    disabled={loading}
                                    rows={5}
                                />
                            </label>

                            <div className="admin-modal-actions">
                                <AdminButton
                                    variant="default"
                                    type="button"
                                    disabled={loading}
                                    onClick={closeModal}
                                >
                                    Cancel
                                </AdminButton>

                                <AdminButton
                                    variant="success"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditCommentModal;