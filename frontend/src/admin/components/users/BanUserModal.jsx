import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";
import ConfirmDialog from "../shared/ConfirmDialog";

function BanUserModal({ user, userId, onDone }) {
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

    async function handleBanUser() {
        try {
            setLoading(true);
            await adminService.banUser(userId);
            setIsConfirmOpen(false);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not ban user.");
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
                Ban
            </AdminButton>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Ban user"
                message={`Are you sure you want to ban ${username}?`}
                confirmLabel="Ban"
                variant="danger"
                loading={loading}
                onCancel={closeConfirmDialog}
                onConfirm={handleBanUser}
            />
        </>
    );
}

export default BanUserModal;