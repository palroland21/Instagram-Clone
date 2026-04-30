function ProfileHeader({ username, onBack }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid #262626',
                position: 'sticky',
                top: 0,
                background: '#000',
                zIndex: 10,
            }}
        >
            <button
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: 22,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    lineHeight: 1,
                }}
            >
                ←
            </button>

            <span style={{ fontSize: 16, fontWeight: 700 }}>{username}</span>

            <div style={{ width: 40 }} />
        </div>
    )
}

export default ProfileHeader