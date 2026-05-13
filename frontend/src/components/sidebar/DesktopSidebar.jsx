import { LogoutIcon } from '../Icons';
import CreatePostModal from '../create-post/CreatePostModal.jsx';
import UnreadNotificationBell from './UnreadNotificationBell';

function DesktopSidebar({
    activeItem,
    hasUnread,
    items,
    onItemClick,
    onLogout,
    onPostCreated,
    onCloseCreateModal,
    showCreateModal,
}) {
    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 244,
                    background: '#000',
                    borderRight: '1px solid #262626',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '8px 12px 20px',
                    zIndex: 100,
                }}
            >
                <div style={{ padding: '25px 12px 16px' }}>
                    <span
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: 22,
                            fontWeight: 'bold',
                            color: 'white',
                            letterSpacing: '-0.5px',
                            display: 'block',
                        }}
                    >
                        Instagram
                    </span>
                </div>

                <nav
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                    }}
                >
                    {items.map(item => {
                        const isNotificationsItem = item.id === 'notifications';
                        const shouldBeBold =
                            activeItem === item.id ||
                            (isNotificationsItem && hasUnread);

                        return (
                            <button
                                key={item.id}
                                onClick={() => onItemClick(item)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: '12px 12px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontSize: 15,
                                    fontWeight: shouldBeBold ? 700 : 400,
                                    transition: 'background 0.15s',
                                    width: '100%',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={event => {
                                    event.currentTarget.style.background = '#1a1a1a';
                                }}
                                onMouseLeave={event => {
                                    event.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span style={{ flexShrink: 0 }}>
                                    {item.icon}
                                </span>

                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    {item.label}

                                    {isNotificationsItem && hasUnread && (
                                        <UnreadNotificationBell />
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 400,
                        width: '100%',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={event => {
                        event.currentTarget.style.background = '#1a1a1a';
                    }}
                    onMouseLeave={event => {
                        event.currentTarget.style.background = 'transparent';
                    }}
                >
                    <LogoutIcon />
                    <span>Log out</span>
                </button>
            </div>

            {showCreateModal && (
                <CreatePostModal
                    onClose={onCloseCreateModal}
                    onPostCreated={onPostCreated}
                />
            )}
        </>
    );
}

export default DesktopSidebar;
