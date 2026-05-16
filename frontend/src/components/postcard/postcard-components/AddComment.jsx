function AddComment({ commentText, setCommentText, handlePostComment, disabled = false }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 8,
                paddingTop: 4,
            }}
        >
            <input
                placeholder={disabled ? 'Comments are closed.' : 'Add a comment...'}
                value={commentText}
                disabled={disabled}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !disabled) {
                        handlePostComment()
                    }
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#f5f5f5',
                    fontSize: 14,
                    flex: 1,
                    outline: 'none',
                    padding: 0,
                    opacity: disabled ? 0.65 : 1,
                }}
            />

            <button
                onClick={handlePostComment}
                disabled={disabled}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    color: '#0095f6',
                    fontSize: 14,
                    fontWeight: 600,
                    opacity: !disabled && commentText.trim() ? 1 : 0.4,
                }}
            >
                Post
            </button>
        </div>
    )
}

export default AddComment
