import { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminButton from "../shared/AdminButton";

function BanUserModal({ user, userId, onDone }) {
    const [loading, setLoading] = useState(false);

    async function handleBanUser() {
        const username = user.username || user.name || user.email || "this user";

        const confirmed = window.confirm(
            `Are you sure you want to ban ${username}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            await adminService.banUser(userId);
            await onDone();
        } catch (err) {
            alert(err.message || "Could not ban user.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminButton
            variant="danger"
            disabled={loading}
            onClick={handleBanUser}
        >
            {loading ? "Banning..." : "Ban"}
        </AdminButton>
    );
}

export default BanUserModal;