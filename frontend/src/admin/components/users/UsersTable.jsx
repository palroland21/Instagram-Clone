import EmptyState from "../shared/EmptyState";
import UsersRow from "./UsersRow.jsx";

function UsersTable({ users, onUserUpdated }) {
    if (!users.length) {
        return <EmptyState message="No users found." />;
    }

    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead>
                <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {users.map((user) => (
                    <UsersRow
                        key={user.id}
                        user={user}
                        onUserUpdated={onUserUpdated}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersTable;