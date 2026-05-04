function PostsGrid({ posts, getPostImages, onPostClick }) {
    return (
        <div style={{ borderTop: '1px solid #262626', paddingTop: 12 }}>
            {posts.length === 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        color: '#737373',
                        padding: '48px 0',
                        fontSize: 14,
                    }}
                >
                    No posts yet.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                    {posts.map(post => {
                        const images = getPostImages(post)
                        const firstImage = images[0] || ''

                        return (
                            <div
                                key={post.id}
                                onClick={() => onPostClick(post)}
                                style={{
                                    aspectRatio: '1',
                                    overflow: 'hidden',
                                    background: '#111',
                                    cursor: 'pointer',
                                }}
                            >
                                {firstImage ? (
                                    <img
                                        src={firstImage}
                                        alt={post.title || 'post'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#1a1a1a',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: '#737373',
                                                padding: 4,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {post.title || post.caption || 'No image'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default PostsGrid