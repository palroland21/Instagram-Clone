import { HeartIcon } from '../../Icons.jsx'
import XVoteIcon from './icons/XVoteIcon.jsx'
import { buildFileUrl } from './postCardUtils.js'

function CommentsSection({ showComments, sortedComments, handleCommentVote }) {
    if (!showComments) return null

    return (
        <div style={{ marginBottom: 8 }}>
            {sortedComments.length === 0 ? (
                <div style={{ fontSize: 14, color: '#737373' }}>
                    No comments yet.
                </div>
            ) : (
                sortedComments.map((comment, index) => (
                    <div
                        key={comment.id || index}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            marginBottom: 12,
                        }}
                    >
                        <img
                            src={
                                buildFileUrl(comment.userProfilePicture) ||
                                `https://i.pravatar.cc/100?u=${comment.userId || comment.username || index}`
                            }
                            alt={comment.username || 'user'}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                flexShrink: 0,
                                marginTop: 2,
                            }}
                        />

                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: 14,
                                    color: '#f5f5f5',
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word',
                                }}
                            >
                                <span style={{ fontWeight: 700, marginRight: 6 }}>
                                    {comment.username || 'user'}
                                </span>
                                <span>{comment.text}</span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 6,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <button
                                    onClick={() => handleCommentVote(comment.id, 'LIKE')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <HeartIcon
                                        filled={Boolean(comment.likedByCurrentUser)}
                                        size={13}
                                    />
                                </button>

                                <button
                                    onClick={() => handleCommentVote(comment.id, 'DISLIKE')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: Boolean(comment.dislikedByCurrentUser)
                                            ? '#ff3040'
                                            : '#f5f5f5',
                                    }}
                                >
                                    <XVoteIcon
                                        filled={Boolean(comment.dislikedByCurrentUser)}
                                        size={13}
                                    />
                                </button>

                                <span style={{ fontSize: 12, color: '#737373' }}>
                                    score: {Number(comment.voteCount) || 0}
                                </span>

                                <span style={{ fontSize: 12, color: '#737373' }}>
                                    {Number(comment.likeCount) || 0} likes
                                </span>

                                <span style={{ fontSize: 12, color: '#737373' }}>
                                    {Number(comment.dislikeCount) || 0} dislikes
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default CommentsSection