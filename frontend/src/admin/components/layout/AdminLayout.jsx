import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../../styles/admin.css";

function AdminLayout({ title, subtitle, children }) {
    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-content">
                <AdminHeader title={title} subtitle={subtitle} />

                {children}
            </main>
        </div>
    );
}

export default AdminLayout;