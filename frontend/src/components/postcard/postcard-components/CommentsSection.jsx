import { HeartIcon } from '../../Icons.jsx'
import XVoteIcon from './icons/XVoteIcon.jsx'
import { buildFileUrl } from './postCardUtils.js'

function CommentsSection({
                             showComments,
                             sortedComments,
                             currentUserId,
                             editingCommentId,
                             editingCommentText,
                             openCommentMenuId,
                             setEditingCommentText,
                             setOpenCommentMenuId,
                             handleCommentVote,
                             onStartEditComment,
                             onCancelEditComment,
                             onUpdateComment,
                             onDeleteComment,
                         }) {
    if (!showComments) return null

    return (
        <div style={{ marginBottom: 8 }}>
            {sortedComments.length === 0 ? (
                <div style={{ fontSize: 14, color: '#737373' }}>
                    No comments yet.
                </div>
            ) : (
                sortedComments.map((comment, index) => {
                    const isOwner = Number(currentUserId) === Number(comment.userId)
                    const isEditing = Number(editingCommentId) === Number(comment.id)

                    return (
                        <div
                            key={comment.id || index}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 10,
                                marginBottom: 12,
                                position: 'relative',
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

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 8,
                                        fontSize: 14,
                                        color: '#f5f5f5',
                                        lineHeight: 1.4,
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontWeight: 700, marginRight: 6 }}>
                                            {comment.username || 'user'}
                                        </span>

                                        {isEditing ? (
                                            <input
                                                value={editingCommentText}
                                                onChange={(e) => setEditingCommentText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        onUpdateComment(comment)
                                                    }

                                                    if (e.key === 'Escape') {
                                                        onCancelEditComment()
                                                    }
                                                }}
                                                autoFocus
                                                style={{
                                                    width: '100%',
                                                    marginTop: 6,
                                                    background: '#111',
                                                    border: '1px solid #363636',
                                                    borderRadius: 6,
                                                    color: '#f5f5f5',
                                                    fontSize: 14,
                                                    outline: 'none',
                                                    padding: '6px 8px',
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                        ) : (
                                            <span>{comment.text}</span>
                                        )}
                                    </div>

                                    {isOwner && !isEditing && (
                                        <div style={commentMenuWrapStyle}>
                                            <button
                                                type="button"
                                                aria-label="Comment options"
                                                onClick={() =>
                                                    setOpenCommentMenuId((currentId) =>
                                                        Number(currentId) === Number(comment.id)
                                                            ? null
                                                            : comment.id
                                                    )
                                                }
                                                style={commentOptionsButtonStyle}
                                            >
                                                <span style={commentOptionsDotStyle} />
                                                <span style={commentOptionsDotStyle} />
                                            </button>

                                            {Number(openCommentMenuId) === Number(comment.id) && (
                                                <div style={commentMenuStyle}>
                                                    <button
                                                        type="button"
                                                        onClick={() => onStartEditComment(comment)}
                                                        style={commentMenuItemStyle}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteComment(comment.id)}
                                                        style={{
                                                            ...commentMenuItemStyle,
                                                            color: '#ff3040',
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
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
                                    {!isEditing && (
                                        <>
                                            <button
                                                onClick={() => handleCommentVote(comment.id, 'LIKE')}
                                                disabled={isOwner}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: isOwner ? 'not-allowed' : 'pointer',
                                                    opacity: isOwner ? 0.35 : 1,
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
                                                disabled={isOwner}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: isOwner ? 'not-allowed' : 'pointer',
                                                    opacity: isOwner ? 0.35 : 1,
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: comment.dislikedByCurrentUser
                                                        ? '#ff3040'
                                                        : '#f5f5f5',
                                                }}
                                            >
                                                <XVoteIcon
                                                    filled={Boolean(comment.dislikedByCurrentUser)}
                                                    size={13}
                                                />
                                            </button>
                                        </>
                                    )}

                                    <span style={{ fontSize: 12, color: '#737373' }}>
                                        score: {Number(comment.voteCount) || 0}
                                    </span>

                                    <span style={{ fontSize: 12, color: '#737373' }}>
                                        {Number(comment.likeCount) || 0} likes
                                    </span>

                                    <span style={{ fontSize: 12, color: '#737373' }}>
                                        {Number(comment.dislikeCount) || 0} dislikes
                                    </span>

                                    {isEditing && (
                                        <>
                                            <button
                                                onClick={() => onUpdateComment(comment)}
                                                style={commentActionButtonStyle}
                                            >
                                                Save
                                            </button>

                                            <button
                                                onClick={onCancelEditComment}
                                                style={commentActionButtonStyle}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

const commentActionButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#737373',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    padding: 0,
}

const commentMenuWrapStyle = {
    position: 'relative',
    flexShrink: 0,
    marginTop: -2,
}

const commentOptionsButtonStyle = {
    width: 20,
    height: 20,
    border: 'none',
    background: 'transparent',
    color: '#a8a8a8',
    cursor: 'pointer',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: 0,
}

const commentOptionsDotStyle = {
    width: 3,
    height: 3,
    borderRadius: '50%',
    background: 'currentColor',
    display: 'block',
}

const commentMenuStyle = {
    position: 'absolute',
    right: 0,
    top: 26,
    minWidth: 112,
    background: '#262626',
    border: '1px solid #363636',
    borderRadius: 8,
    boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
    overflow: 'hidden',
    zIndex: 20,
}

const commentMenuItemStyle = {
    width: '100%',
    border: 'none',
    background: 'transparent',
    color: '#f5f5f5',
    cursor: 'pointer',
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    padding: '9px 12px',
    textAlign: 'left',
}

export default CommentsSection
