function ProfileInfo({
                         user,
                         postsCount,
                         followersCount,
                         followingCount,
                         avatarSrc,
                         onEditProfile,
                         onOpenFollowers,
                         onOpenFollowing,
                         isOwner,
                         isFollowing,
                         onToggleFollow,
                         onMessage
                     }) {
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 16 }}>
                <img
                    src={avatarSrc}
                    alt={user.username}
                    style={{
                        width: 86,
                        height: 86,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #333',
                        flexShrink: 0,
                    }}
                />

                <div style={{ display: 'flex', gap: 56, flex: 1, justifyContent: 'center' }}>
                    {[
                        { label: 'posts', value: postsCount },
                        { label: 'followers', value: followersCount, action: onOpenFollowers },
                        { label: 'following', value: followingCount, action: onOpenFollowing },
                    ].map(item => (
                        <div
                            key={item.label}
                            onClick={item.action}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                cursor: item.action ? 'pointer' : 'default',
                            }}
                        >
                            <span style={{ fontSize: 17, fontWeight: 700 }}>{item.value}</span>
                            <span style={{ fontSize: 14 }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                {user.fullName && (
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        {user.fullName}
                    </div>
                )}

                {user.bio && (
                    <div style={{ fontSize: 14, color: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
                        {user.bio}
                    </div>
                )}
            </div>

            {isOwner ? (
                <button
                    onClick={onEditProfile}
                    style={{
                        width: '100%',
                        padding: '7px 16px',
                        background: 'transparent',
                        border: '1px solid #363636',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: 24,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#1a1a1a'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                    }}
                >
                    Edit profile
                </button>
            ) : (
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    <button
                        onClick={onToggleFollow}
                        style={{
                            flex: 1,
                            padding: '7px 16px',
                            background: isFollowing ? '#363636' : '#0095f6',
                            border: 'none',
                            borderRadius: 8,
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button
                        onClick={onMessage}
                        style={{
                            flex: 1,
                            padding: '7px 16px',
                            background: '#363636',
                            border: 'none',
                            borderRadius: 8,
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Message
                    </button>
                </div>
            )}
        </>
    )
}

export default ProfileInfo