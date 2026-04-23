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
        const headers = { 'Authorization': `Bearer ${token}` }

        const url = currentUserId
            ? `${API_BASE_URL}/posts?currentUserId=${currentUserId}`
            : `${API_BASE_URL}/posts`

        fetch(url, { headers })
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch posts')
                return r.json()
            })
            .then(async (data) => {
                // Sort newest first
                const sorted = [...data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )

                // Fetch comments for every post in parallel
                const withComments = await Promise.all(
                    sorted.map(async (post) => {
                        try {
                            const res = await fetch(`${API_BASE_URL}/comments`, { headers })
                            if (!res.ok) return { ...post, comments: [] }
                            const allComments = await res.json()
                            const postComments = allComments.filter(c => c.postId === post.id)
                            return { ...post, comments: postComments }
                        } catch {
                            return { ...post, comments: [] }
                        }
                    })
                )

                setPosts(withComments)
                setLoading(false)
            })
            .catch(err => {
                console.error('Fetch posts error:', err)
                setError('Could not load posts.')
                setLoading(false)
            })
    }, [])

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