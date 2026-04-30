import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";
import ConfirmDialog from "../shared/ConfirmDialog";

function UnbanUserButton({ user, userId, onDone }) {
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const username = user.username || user.name || user.email || "this user";

    function openConfirmDialog() {
        setIsConfirmOpen(true);
    }

    function closeConfirmDialog() {
        if (!loading) {
            setIsConfirmOpen(false);
        }
    }

    async function handleUnbanUser() {
        try {
            setLoading(true);
            await adminService.unbanUser(userId);
            setIsConfirmOpen(false);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not unban user.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AdminButton
                variant="success"
                disabled={loading}
                onClick={openConfirmDialog}
            >
                Unban
            </AdminButton>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Unban user"
                message={`Are you sure you want to unban ${username}?`}
                confirmLabel="Unban"
                variant="success"
                loading={loading}
                onCancel={closeConfirmDialog}
                onConfirm={handleUnbanUser}
            />
        </>
    );
}

export default UnbanUserButton;