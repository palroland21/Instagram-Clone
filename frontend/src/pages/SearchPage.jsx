import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import PostCard from '../components/postcard/Postcard.jsx'

const API_BASE_URL = 'http://localhost:9090'

function SearchPage() {
    const [activeItem, setActiveItem] = useState('search')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
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

                if (!token) {
                    setError('You are not logged in.')
                    setLoading(false)
                    return
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                }

                const postsUrl = currentUserId
                    ? `${API_BASE_URL}/posts?currentUserId=${currentUserId}`
                    : `${API_BASE_URL}/posts`

                const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
                    fetch(postsUrl, { headers }),
                    fetch(`${API_BASE_URL}/users`, { headers }),
                    fetch(`${API_BASE_URL}/comments`, { headers }),
                ])

                if (!postsResponse.ok) {
                    throw new Error('Failed to fetch posts')
                }

                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch users')
                }

                const postsData = await postsResponse.json()
                const usersData = await usersResponse.json()
                const commentsData = commentsResponse.ok ? await commentsResponse.json() : []

                const usersMap = new Map(
                    usersData.map(user => [Number(user.id), user])
                )

                const enrichedPosts = postsData
                    .map(post => {
                        const author = usersMap.get(Number(post.userId))

                        const postComments = commentsData
                            .filter(comment => Number(comment.postId) === Number(post.id))
                            .map(comment => {
                                const commentAuthor = usersMap.get(Number(comment.userId))

                                return {
                                    ...comment,
                                    username: comment.username || commentAuthor?.username || 'user',
                                    userProfilePicture:
                                        comment.userProfilePicture || commentAuthor?.profilePicture || '',
                                }
                            })

                        return {
                            ...post,
                            username: post.username || author?.username || 'user',
                            userProfilePicture:
                                post.userProfilePicture || author?.profilePicture || '',
                            comments: postComments,
                        }
                    })
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setPosts(enrichedPosts)
            } catch (err) {
                console.error('Search page fetch error:', err)
                setError('Could not load posts.')
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [token, currentUserId])

    const filteredPosts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        return posts.filter(post => {
            const postTitle = (post.title || '').toLowerCase()
            const postUsername = (post.username || '').toLowerCase()
            const postTags = Array.isArray(post.tagNames)
                ? post.tagNames.map(tag => String(tag).toLowerCase())
                : []

            const matchesSearch =
                !query ||
                postTitle.includes(query) ||
                postUsername.includes(query) ||
                postTags.some(tag => tag.includes(query))

            const matchesMine =
                !onlyMine || Number(post.userId) === Number(currentUserId)

            return matchesSearch && matchesMine
        })
    }, [posts, searchQuery, onlyMine, currentUserId])

    const clearFilters = () => {
        setSearchQuery('')
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
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
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
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 24,
                            background: '#111',
                        }}
                    >
                        <div style={{ marginBottom: 18 }}>
                            <input
                                type="text"
                                placeholder="Search by title, username or tag..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={searchInputStyle}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 16,
                                flexWrap: 'wrap',
                            }}
                        >
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    color: '#f5f5f5',
                                    fontSize: 15,
                                    fontWeight: 500,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={onlyMine}
                                    onChange={e => setOnlyMine(e.target.checked)}
                                />
                                Show only my posts
                            </label>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <button onClick={clearFilters} style={clearButtonStyle}>
                                    Clear filters
                                </button>
                            </div>
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

const searchInputStyle = {
    width: '100%',
    padding: '16px 18px',
    borderRadius: 12,
    border: '1px solid #262626',
    background: '#000',
    color: '#fff',
    outline: 'none',
    fontSize: 16,
    boxSizing: 'border-box',
}

const clearButtonStyle = {
    padding: '10px 14px',
    borderRadius: 10,
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