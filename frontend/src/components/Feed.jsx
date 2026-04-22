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

        const url = currentUserId
            ? `${API_BASE_URL}/posts?currentUserId=${currentUserId}`
            : `${API_BASE_URL}/posts`

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch posts')
                return r.json()
            })
            .then(data => {
                setPosts(data)
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