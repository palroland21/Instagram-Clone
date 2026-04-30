import AdminLayout from "../components/layout/AdminLayout";
import ErrorMessage from "../components/shared/ErrorMessage";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import UsersTable from "../components/users/UsersTable";
import { useAdminUsers } from "../hooks/useAdminUsers";

function AdminUsersPage() {
    const { users, loading, error, reloadUsers } = useAdminUsers();

    return (
        <AdminLayout
            title="Users"
            subtitle="Ban, unban and inspect application users."
        >
            <div className="admin-page">
                {loading && <LoadingSpinner />}

                {!loading && error && <ErrorMessage message={error} />}

                {!loading && !error && (
                    <UsersTable users={users} onUserUpdated={reloadUsers} />
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminUsersPage;