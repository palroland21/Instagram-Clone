import { useEffect, useState } from 'react'
import PostCard from './postcard/Postcard.jsx'

const API_BASE_URL = 'http://localhost:9090'

function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const currentUserId = localStorage.getItem('userId')
        ? Number(localStorage.getItem('userId'))
        : null

    const getOwnerId = (item) =>
        item.userId ?? item.authorId ?? item.user?.id ?? item.author?.id ?? null

    const buildFileUrl = (value) => {
        if (!value) return ''

        if (
            value.startsWith('http://') ||
            value.startsWith('https://') ||
            value.startsWith('data:')
        ) {
            return value
        }

        return `${API_BASE_URL}${value.startsWith('/') ? '' : '/'}${value}`
    }

    const normalizeComment = (comment) => ({
        ...comment,
        userId: Number(getOwnerId(comment)),
        username:
            comment.username ||
            comment.author?.username ||
            'user',
        userProfilePicture: buildFileUrl(
            comment.userProfilePicture ||
            comment.author?.profilePicture ||
            comment.user?.profilePicture ||
            ''
        ),
        pictureUrl: buildFileUrl(
            comment.pictureUrl ||
            comment.picture ||
            comment.imageUrl ||
            comment.image ||
            ''
        ),
        likeCount: Number(comment.likeCount) || 0,
        dislikeCount: Number(comment.dislikeCount) || 0,
        voteCount: Number(comment.voteCount) || 0,
        likedByCurrentUser: Boolean(comment.likedByCurrentUser),
        dislikedByCurrentUser: Boolean(comment.dislikedByCurrentUser),
    })

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
                setLoading(true)
                setError('')

                const [postsRes, usersRes] = await Promise.all([
                    fetch(postsUrl, { headers }),
                    fetch(`${API_BASE_URL}/users`, { headers }),
                ])

                if (!postsRes.ok) {
                    throw new Error('Failed to fetch posts')
                }

                if (!usersRes.ok) {
                    throw new Error('Failed to fetch users')
                }

                const postsData = await postsRes.json()
                const usersData = await usersRes.json()

                const usersMap = new Map(
                    usersData.map((user) => [Number(user.id), user])
                )

                const enrichedPosts = postsData
                    .map((post) => {
                        const ownerId = Number(getOwnerId(post))
                        const author = usersMap.get(ownerId)

                        const normalizedComments = Array.isArray(post.comments)
                            ? post.comments
                                .map(normalizeComment)
                                .sort((a, b) => {
                                    const byVotes = (Number(b.voteCount) || 0) - (Number(a.voteCount) || 0)
                                    if (byVotes !== 0) return byVotes

                                    return new Date(a.postedAt || 0) - new Date(b.postedAt || 0)
                                })
                            : []

                        return {
                            ...post,
                            userId: ownerId,
                            username:
                                post.username ||
                                post.author?.username ||
                                author?.username ||
                                'user',
                            userProfilePicture: buildFileUrl(
                                post.userProfilePicture ||
                                post.author?.profilePicture ||
                                author?.profilePicture ||
                                ''
                            ),
                            pictureUrls: Array.isArray(post.pictureUrls)
                                ? post.pictureUrls.map((url) => buildFileUrl(url))
                                : [],
                            pictureUrl: buildFileUrl(
                                post.pictureUrl ||
                                post.picture ||
                                post.imageUrl ||
                                post.image ||
                                post.photoUrl ||
                                ''
                            ),
                            likeCount: Number(post.likeCount) || 0,
                            dislikeCount: Number(post.dislikeCount) || 0,
                            voteCount: Number(post.voteCount) || 0,
                            likedByCurrentUser: Boolean(post.likedByCurrentUser),
                            dislikedByCurrentUser: Boolean(post.dislikedByCurrentUser),
                            comments: normalizedComments,
                        }
                    })
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

                setPosts(enrichedPosts)
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