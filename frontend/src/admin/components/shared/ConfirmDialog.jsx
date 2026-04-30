function ConfirmDialog({
                           isOpen,
                           title,
                           message,
                           confirmLabel = "Confirm",
                           cancelLabel = "Cancel",
                           variant = "danger",
                           loading = false,
                           onConfirm,
                           onCancel,
                       }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="admin-modal-backdrop">
            <div className="admin-confirm-dialog">
                <div className="admin-confirm-header">
                    <h2>{title}</h2>
                </div>

                <p className="admin-confirm-message">{message}</p>

                <div className="admin-confirm-actions">
                    <button
                        type="button"
                        className="admin-button admin-button-default"
                        disabled={loading}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        className={`admin-button admin-button-${variant}`}
                        disabled={loading}
                        onClick={onConfirm}
                    >
                        {loading ? "Processing..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;