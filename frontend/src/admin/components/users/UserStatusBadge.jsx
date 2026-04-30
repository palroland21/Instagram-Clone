function UserStatusBadge({ banned }) {
    return (
        <span className={banned ? "admin-badge banned" : "admin-badge active"}>
      {banned ? "Banned" : "Active"}
    </span>
    );
}

export default UserStatusBadge;