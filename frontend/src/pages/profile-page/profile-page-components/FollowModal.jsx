function FollowModal({
                         followModalType,
                         followUsers,
                         loadingFollow,
                         onClose,
                     }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 16,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#262626',
                    borderRadius: 12,
                    width: '100%',
                    maxWidth: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '70vh',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 24px',
                        borderBottom: '1px solid #363636',
                    }}
                >
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: 'white',
                            textTransform: 'capitalize',
                        }}
                    >
                        {followModalType}
                    </span>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#737373',
                            fontSize: 18,
                            cursor: 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div
                    style={{
                        padding: 16,
                        overflowY: 'auto',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                    }}
                >
                    {loadingFollow ? (
                        <div style={{ textAlign: 'center', color: '#737373', padding: '20px 0' }}>
                            Loading...
                        </div>
                    ) : followUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#737373', padding: '20px 0' }}>
                            No {followModalType} yet.
                        </div>
                    ) : (
                        followUsers.map(user => (
                            <div
                                key={user.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                <img
                                    src={user.profilePicture || `https://i.pravatar.cc/150?u=${user.id}`}
                                    alt={user.username}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                                        {user.username}
                                    </span>

                                    {user.fullName && (
                                        <span style={{ color: '#737373', fontSize: 13 }}>
                                            {user.fullName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FollowModal