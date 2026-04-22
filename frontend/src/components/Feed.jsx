import { useState, useEffect } from 'react'
import StoriesBar from './StoriesBar'
import PostCard from './PostCard'

const API_BASE_URL = 'http://localhost:9090'

function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${API_BASE_URL}/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch posts')
                return r.json()
            })
            .then(data => {
                setPosts(data)
                setLoading(false)
            })
            .catch(() => {
                setError('Could not load posts.')
                setLoading(false)
            })
    }, [])

    return (
        <div style={{ paddingTop: 16 }}>
            <StoriesBar />
            <div style={{ marginTop: 4 }}>
                {loading && (
                    <div style={{ color: '#737373', textAlign: 'center', padding: 32 }}>Loading...</div>
                )}
                {error && (
                    <div style={{ color: '#737373', textAlign: 'center', padding: 32 }}>{error}</div>
                )}
                {!loading && !error && posts.length === 0 && (
                    <div style={{ color: '#737373', textAlign: 'center', padding: 32 }}>No posts yet.</div>
                )}
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

export default Feed
