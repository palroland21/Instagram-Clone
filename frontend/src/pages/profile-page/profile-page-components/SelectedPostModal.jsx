import PostCard from '../../../components/postcard/Postcard';

function SelectedPostModal({ currentUserId, onClose, post }) {
    if (!post) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: 16,
            }}
        >
            <div
                onClick={event => event.stopPropagation()}
                style={{
                    background: '#000',
                    borderRadius: 8,
                    maxWidth: 600,
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <PostCard
                    post={post}
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    );
}

export default SelectedPostModal;
