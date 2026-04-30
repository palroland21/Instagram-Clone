function PostStats({ voteCount, likeCount, dislikeCount }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14,
                fontWeight: 600,
                color: '#f5f5f5',
                marginBottom: 6,
                flexWrap: 'wrap',
            }}
        >
            <span>score: {voteCount}</span>
            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            <span>{dislikeCount} {dislikeCount === 1 ? 'dislike' : 'dislikes'}</span>
        </div>
    )
}

export default PostStats