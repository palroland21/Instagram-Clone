function AdminButton({
                         children,
                         variant = "default",
                         type = "button",
                         disabled = false,
                         onClick,
                     }) {
    return (
        <button
            type={type}
            className={`admin-button admin-button-${variant}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default AdminButton;