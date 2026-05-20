import CreatePostModal from '../create-post/CreatePostModal.jsx';
import UnreadNotificationBell from './UnreadNotificationBell';

function MobileSidebar({
    activeItem,
    hasUnread,
    items,
    onItemClick,
    onPostCreated,
    onCloseCreateModal,
    showCreateModal,
}) {
    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    background: '#000',
                    borderTop: '1px solid #262626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    zIndex: 100,
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                {items.map(item => (
                    <button
                        key={item.id}
                        data-cy={`nav-${item.id}`}
                        onClick={() => onItemClick(item)}
                        style={{
                            position: 'relative',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: activeItem === item.id ? 1 : 0.7,
                            transition: 'opacity 0.15s',
                        }}
                    >
                        {item.icon}

                        {item.id === 'notifications' && hasUnread && (
                            <UnreadNotificationBell mobile />
                        )}
                    </button>
                ))}
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

export default MobileSidebar;
