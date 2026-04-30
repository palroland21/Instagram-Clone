import { NavLink } from "react-router-dom";

function AdminSidebar() {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-logo">Admin Panel</div>

            <nav className="admin-sidebar-nav">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
                    }
                >
                    Users
                </NavLink>

                <NavLink
                    to="/admin/posts"
                    className={({ isActive }) =>
                        isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
                    }
                >
                    Posts
                </NavLink>

                <NavLink
                    to="/admin/comments"
                    className={({ isActive }) =>
                        isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
                    }
                >
                    Comments
                </NavLink>
            </nav>
        </aside>
    );
}

export default AdminSidebar;