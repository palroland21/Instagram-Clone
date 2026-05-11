import { useEffect, useState } from 'react'
import PostCard from './postcard/Postcard.jsx'
import { fetchFeedPosts, getCurrentUserId, getToken } from '../services'

function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const currentUserId = getCurrentUserId()

    useEffect(() => {
        const token = getToken()

        if (!token) {
            setError('You are not logged in.')
            setLoading(false)
            return
        }

        const loadFeed = async () => {
            try {
                setLoading(true)
                setError('')

                setPosts(await fetchFeedPosts({ token, currentUserId }))
            } catch (err) {
                console.error('Fetch posts error:', err)
                setError('Could not load posts.')
            } finally {
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

                {!loading && !error && posts.map((post) => (
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
