function AdminHeader({ title, subtitle }) {
    return (
        <header className="admin-header">
            <div>
                <h1 className="admin-header-title">{title}</h1>

                {subtitle && (
                    <p className="admin-header-subtitle">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="admin-header-badge">
                Moderator access
            </div>
        </header>
    );
}

export default AdminHeader;