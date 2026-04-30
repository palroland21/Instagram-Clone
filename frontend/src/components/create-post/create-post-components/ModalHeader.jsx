import { CloseIcon } from './icons'

function ModalHeader({ step, loading, onClose, onShare }) {
    return (
        <div className="create-post-header">
            <div className="create-post-header-spacer" />

            <span className="create-post-title">
                {step === 'upload' ? 'Create new post' : 'New post'}
            </span>

            <div className="create-post-header-actions">
                {step === 'edit' && (
                    <button
                        onClick={onShare}
                        disabled={loading}
                        className="create-post-share-btn"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                )}

                <button
                    onClick={onClose}
                    className="create-post-close-btn"
                >
                    <CloseIcon />
                </button>
            </div>
        </div>
    )
}

export default ModalHeader