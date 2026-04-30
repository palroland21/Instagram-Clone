import { DotsIcon } from '../../Icons.jsx'
import { buildFileUrl, timeAgo } from './postCardUtils.js'

function PostHeader({ post }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 4px 8px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                    src={
                        buildFileUrl(post.userProfilePicture) ||
                        `https://i.pravatar.cc/150?u=${post.userId}`
                    }
                    alt={post.username}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5' }}>
                            {post.username}
                        </span>

                        <span style={{ color: '#737373', fontSize: 14 }}>•</span>

                        <span style={{ fontSize: 14, color: '#737373' }}>
                            {post.createdAt ? timeAgo(post.createdAt) : ''}
                        </span>
                    </div>

                    {post.location && (
                        <div style={{ fontSize: 12, color: '#737373' }}>
                            {post.location}
                        </div>
                    )}
                </div>
            </div>

            <button
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                }}
            >
                <DotsIcon />
            </button>
        </div>
    )
}

export default PostHeader