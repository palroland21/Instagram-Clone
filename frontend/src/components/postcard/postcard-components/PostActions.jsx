import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon } from '../../Icons.jsx'
import XVoteIcon from './icons/XVoteIcon.jsx'

function PostActions({
                         liked,
                         disliked,
                         saved,
                         setSaved,
                         handlePostVote,
                         setShowComments,
                     }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
            }}
        >
            <div style={{ display: 'flex', gap: 16 }}>
                <button
                    onClick={() => handlePostVote('LIKE')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <HeartIcon filled={liked} size={24} />
                </button>

                <button
                    onClick={() => handlePostVote('DISLIKE')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        color: disliked ? '#ff3040' : '#f5f5f5',
                    }}
                >
                    <XVoteIcon filled={disliked} size={22} />
                </button>

                <button
                    onClick={() => setShowComments((prev) => !prev)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <CommentIcon />
                </button>

                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <ShareIcon />
                </button>
            </div>

            <button
                onClick={() => setSaved((s) => !s)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <BookmarkIcon filled={saved} />
            </button>
        </div>
    )
}

export default PostActions