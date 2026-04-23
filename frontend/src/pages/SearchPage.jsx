import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import PostCard from '../components/Postcard.jsx'

const API_BASE_URL = 'http://localhost:9090'

function SearchPage() {
    const [activeItem, setActiveItem] = useState('search')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [titleQuery, setTitleQuery] = useState('')
    const [usernameQuery, setUsernameQuery] = useState('')
    const [tagQuery, setTagQuery] = useState('')
    const [onlyMine, setOnlyMine] = useState(false)

    const currentUserId = localStorage.getItem('userId')
        ? Number(localStorage.getItem('userId'))
        : null

    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                setError('')

                const headers = {
                    Authorization: `Bearer ${token}`,
                }

                const postsResponse = await fetch(`${API_BASE_URL}/posts`, { headers })
                if (!postsResponse.ok) {
                    throw new Error('Failed to fetch posts')
                }

                const postsData = await postsResponse.json()

                let allComments = []
                try {
                    const commentsResponse = await fetch(`${API_BASE_URL}/comments`, { headers })
                    if (commentsResponse.ok) {
                        allComments = await commentsResponse.json()
                    }
                } catch {
                    allComments = []
                }

                const postsWithComments = postsData.map(post => ({
                    ...post,
                    comments: allComments.filter(comment => comment.postId === post.id),
                }))

                const sorted = [...postsWithComments].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )

                setPosts(sorted)
            } catch (err) {
                console.error('Search page fetch error:', err)
                setError('Could not load posts.')
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [token])

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const postTitle = (post.title || '').toLowerCase()
            const postUsername = (post.username || '').toLowerCase()
            const postTags = Array.isArray(post.tagNames)
                ? post.tagNames.map(tag => String(tag).toLowerCase())
                : []

            const matchesTitle =
                !titleQuery.trim() ||
                postTitle.includes(titleQuery.trim().toLowerCase())

            const matchesUser =
                !usernameQuery.trim() ||
                postUsername.includes(usernameQuery.trim().toLowerCase())

            const matchesTag =
                !tagQuery.trim() ||
                postTags.some(tag => tag.includes(tagQuery.trim().toLowerCase()))

            const matchesMine =
                !onlyMine || post.userId === currentUserId

            return matchesTitle && matchesUser && matchesTag && matchesMine
        })
    }, [posts, titleQuery, usernameQuery, tagQuery, onlyMine, currentUserId])

    const clearFilters = () => {
        setTitleQuery('')
        setUsernameQuery('')
        setTagQuery('')
        setOnlyMine(false)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isMobile={false}
            />

            <main
                style={{
                    marginLeft: 244,
                    maxWidth: 900,
                    padding: '32px 24px 60px',
                    marginRight: 'auto',
                }}
            >
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <h1
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            marginBottom: 24,
                        }}
                    >
                        Search posts
                    </h1>

                    <div
                        style={{
                            border: '1px solid #262626',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 24,
                            background: '#111',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={titleQuery}
                                onChange={e => setTitleQuery(e.target.value)}
                                style={inputStyle}
                            />

                            <input
                                type="text"
                                placeholder="Search by username..."
                                value={usernameQuery}
                                onChange={e => setUsernameQuery(e.target.value)}
                                style={inputStyle}
                            />

                            <input
                                type="text"
                                placeholder="Search by tag..."
                                value={tagQuery}
                                onChange={e => setTagQuery(e.target.value)}
                                style={inputStyle}
                            />

                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '0 4px',
                                    color: '#f5f5f5',
                                    fontSize: 14,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={onlyMine}
                                    onChange={e => setOnlyMine(e.target.checked)}
                                />
                                Show only my posts
                            </label>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 16,
                                gap: 12,
                                flexWrap: 'wrap',
                            }}
                        >
                            <div style={{ color: '#a8a8a8', fontSize: 14 }}>
                                Results: {filteredPosts.length}
                            </div>

                            <button onClick={clearFilters} style={clearButtonStyle}>
                                Clear filters
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div style={infoStyle}>Loading posts...</div>
                    )}

                    {error && (
                        <div style={infoStyle}>{error}</div>
                    )}

                    {!loading && !error && filteredPosts.length === 0 && (
                        <div style={infoStyle}>
                            No posts found for the selected filters.
                        </div>
                    )}

                    {!loading && !error && filteredPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid #262626',
    background: '#000',
    color: '#fff',
    outline: 'none',
    fontSize: 14,
    boxSizing: 'border-box',
}

const clearButtonStyle = {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #262626',
    background: '#000',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
}

const infoStyle = {
    color: '#a8a8a8',
    textAlign: 'center',
    padding: '24px 0',
}

export default SearchPage