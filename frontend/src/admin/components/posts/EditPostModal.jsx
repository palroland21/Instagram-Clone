import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";

function EditPostModal({ post, postId, onDone }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(post.title || "");
    const [text, setText] = useState(post.text || post.description || post.content || "");
    const [loading, setLoading] = useState(false);

    function openModal() {
        setTitle(post.title || "");
        setText(post.text || post.description || post.content || "");
        setIsOpen(true);
    }

    function closeModal() {
        if (!loading) {
            setIsOpen(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!title.trim()) {
            alert("Title is required.");
            return;
        }

        try {
            setLoading(true);

            await adminService.editPost(postId, {
                title: title.trim(),
                text: text.trim(),
            });

            setIsOpen(false);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not edit post.");
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
                            <h2>Edit post</h2>

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
                                <span>Title</span>
                                <input
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    disabled={loading}
                                />
                            </label>

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

export default EditPostModal;