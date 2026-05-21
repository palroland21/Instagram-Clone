import { useCallback, useEffect, useRef, useState } from 'react'
import PostCard from './postcard/Postcard.jsx'
import { fetchFeedPosts, getCurrentUserId, getToken } from '../services'

const FEED_PAGE_SIZE = 12

function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)
    const [error, setError] = useState('')
    const loadMoreRef = useRef(null)

    const currentUserId = getCurrentUserId()

    const loadPage = useCallback(async (pageToLoad, replacePosts = false) => {
        const token = getToken()

        if (!token) {
            setError('You are not logged in.')
            setLoading(false)
            return
        }

        try {
            if (replacePosts) {
                setLoading(true)
            } else {
                setLoadingMore(true)
            }

            setError('')

            const nextPosts = await fetchFeedPosts({
                token,
                currentUserId,
                page: pageToLoad,
                size: FEED_PAGE_SIZE,
            })

            setPosts((currentPosts) => {
                if (replacePosts) {
                    return nextPosts
                }

                const currentIds = new Set(currentPosts.map((post) => post.id))
                const uniqueNextPosts = nextPosts.filter((post) => !currentIds.has(post.id))
                return [...currentPosts, ...uniqueNextPosts]
            })

            setHasMore(nextPosts.length === FEED_PAGE_SIZE)
            setPage(pageToLoad)
        } catch (err) {
            console.error('Fetch posts error:', err)
            setError('Could not load posts.')
        } finally {
            if (replacePosts) {
                setLoading(false)
            } else {
                setLoadingMore(false)
            }
        }
    }, [currentUserId])

    useEffect(() => {
        setPosts([])
        setPage(0)
        setHasMore(true)
        loadPage(0, true)
    }, [loadPage])

    useEffect(() => {
        const loadMoreElement = loadMoreRef.current

        if (!loadMoreElement || loading || loadingMore || !hasMore || error) {
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadPage(page + 1)
                }
            },
            { rootMargin: '300px 0px' }
        )

        observer.observe(loadMoreElement)

        return () => observer.disconnect()
    }, [error, hasMore, loadPage, loading, loadingMore, page])

    return (
        <div style={{ paddingTop: 16 }}>
            <div style={{ marginTop: 4 }}>
                {loading && posts.length === 0 && (
                    <div style={{ color: '#737373', textAlign: 'center', padding: 32 }}>
                        Loading...
                    </div>
                )}

                {error && posts.length === 0 && (
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

                {!loading && !error && hasMore && posts.length > 0 && (
                    <div
                        ref={loadMoreRef}
                        style={{ color: '#737373', textAlign: 'center', padding: 24 }}
                    >
                        {loadingMore ? 'Loading more posts...' : 'Scroll to load more'}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Feed
