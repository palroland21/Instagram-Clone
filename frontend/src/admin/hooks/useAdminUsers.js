import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/adminService";

export function useAdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getUsers();

            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Could not load users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return {
        users,
        loading,
        error,
        reloadUsers: loadUsers,
    };
}