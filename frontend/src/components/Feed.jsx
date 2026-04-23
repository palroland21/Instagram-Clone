import { useEffect, useState } from 'react'
import PostCard from './PostCard'

const API_BASE_URL = 'http://localhost:9090'

function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const currentUserId = localStorage.getItem('userId')
        ? Number(localStorage.getItem('userId'))
        : null

    const getOwnerId = item =>
        item.userId ?? item.authorId ?? item.user?.id ?? item.author?.id ?? null

    const buildFileUrl = value => {
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

                const [postsRes, usersRes, commentsRes] = await Promise.all([
                    fetch(postsUrl, { headers }),
                    fetch(`${API_BASE_URL}/users`, { headers }),
                    fetch(`${API_BASE_URL}/comments`, { headers }),
                ])

                if (!postsRes.ok) {
                    throw new Error('Failed to fetch posts')
                }

                if (!usersRes.ok) {
                    throw new Error('Failed to fetch users')
                }

                const postsData = await postsRes.json()
                const usersData = await usersRes.json()
                const commentsData = commentsRes.ok ? await commentsRes.json() : []

                const usersMap = new Map(
                    usersData.map(user => [Number(user.id), user])
                )

                const enrichedPosts = postsData
                    .map(post => {
                        const ownerId = Number(getOwnerId(post))
                        const author = usersMap.get(ownerId)

                        const postComments = commentsData
                            .filter(comment => Number(comment.postId) === Number(post.id))
                            .map(comment => {
                                const commentOwnerId = Number(getOwnerId(comment))
                                const commentAuthor = usersMap.get(commentOwnerId)

                                return {
                                    ...comment,
                                    userId: commentOwnerId,
                                    username:
                                        comment.username ||
                                        comment.author?.username ||
                                        commentAuthor?.username ||
                                        'user',
                                    userProfilePicture: buildFileUrl(
                                        comment.userProfilePicture ||
                                        comment.author?.profilePicture ||
                                        commentAuthor?.profilePicture ||
                                        ''
                                    ),
                                    pictureUrl: buildFileUrl(
                                        comment.pictureUrl ||
                                        comment.picture ||
                                        comment.imageUrl ||
                                        comment.image ||
                                        ''
                                    ),
                                }
                            })

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
                            pictureUrl: buildFileUrl(
                                post.pictureUrl ||
                                post.picture ||
                                post.imageUrl ||
                                post.image ||
                                post.photoUrl ||
                                ''
                            ),
                            comments: postComments,
                        }
                    })
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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

                {!loading && !error && posts.map(post => (
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