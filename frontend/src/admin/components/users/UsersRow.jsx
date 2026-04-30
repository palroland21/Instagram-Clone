import UserStatusBadge from "./UserStatusBadge";
import BanUserModal from "./BanUserModal";
import UnbanUserButton from "./UnbanUserButton";

function UserRow({ user, onUserUpdated }) {
    const userId = user.id ?? user.userId;
    const username = user.username || user.name || "Unknown user";
    const email = user.email || "-";
    const role = user.role || "USER";
    const score = user.score ?? user.userScore ?? 0;
    const banned = Boolean(user.banned ?? user.isBanned);

    return (
        <tr>
            <td>
                <div className="admin-user-cell">
                    <div className="admin-avatar-placeholder">
                        {username.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <div className="admin-user-name">{username}</div>
                        <div className="admin-user-id">ID: {userId}</div>
                    </div>
                </div>
            </td>

            <td>{email}</td>
            <td>{role}</td>
            <td>{score}</td>

            <td>
                <UserStatusBadge banned={banned} />
            </td>

            <td>
                {banned ? (
                    <UnbanUserButton
                        user={user}
                        userId={userId}
                        onDone={onUserUpdated}
                    />
                ) : (
                    <BanUserModal
                        user={user}
                        userId={userId}
                        onDone={onUserUpdated}
                    />
                )}
            </td>
        </tr>
    );
}

export default UserRow;