import { useState, useEffect } from 'react'
import PostCard from './PostCard'

const API_BASE_URL = 'http://localhost:9090'

function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const currentUserId = localStorage.getItem('userId')
        ? Number(localStorage.getItem('userId'))
        : null

    useEffect(() => {
        const token = localStorage.getItem('token')

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

        const loadFeed = async () => {
            try {
                const [postsRes, usersRes, commentsRes] = await Promise.all([
                    fetch(postsUrl, { headers }),
                    fetch(`${API_BASE_URL}/users`, { headers }),
                    fetch(`${API_BASE_URL}/comments`, { headers }),
                ])

                if (!postsRes.ok) throw new Error('Failed to fetch posts')
                if (!usersRes.ok) throw new Error('Failed to fetch users')

                const postsData = await postsRes.json()
                const usersData = await usersRes.json()
                const commentsData = commentsRes.ok ? await commentsRes.json() : []

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
                                    userProfilePicture: comment.userProfilePicture || commentAuthor?.profilePicture || '',
                                }
                            })

                        return {
                            ...post,
                            username: post.username || author?.username || 'user',
                            userProfilePicture: post.userProfilePicture || author?.profilePicture || '',
                            comments: postComments,
                        }
                    })
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setPosts(enrichedPosts)
                setLoading(false)
            } catch (err) {
                console.error('Fetch posts error:', err)
                setError('Could not load posts.')
                setLoading(false)
            }
        }

        loadFeed()
    }, [currentUserId])

    return (
        <div style={{ paddingTop: 16 }}>
            <div style={{ marginTop: 4 }}>
                {loading && (
                    <div style={{ color: '#737373', textAlign: 'center', padding: 32 }}>
                        Loading...
                    </div>
                )}

                {error && (
                    <div style={{ color: '#737373', textAlign: 'center', padding: 32 }}>
                        {error}
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div style={{ color: '#737373', textAlign: 'center', padding: 32 }}>
                        No posts yet.
                    </div>
                )}

                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        </div>
    )
}

export default Feed