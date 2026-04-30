function AddComment({ commentText, setCommentText, handlePostComment }) {
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
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
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
                }}
            />

            <button
                onClick={handlePostComment}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0095f6',
                    fontSize: 14,
                    fontWeight: 600,
                    opacity: commentText.trim() ? 1 : 0.4,
                }}
            >
                Post
            </button>
        </div>
    )
}

export default AddComment