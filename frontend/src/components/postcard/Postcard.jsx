import { useState, useEffect } from 'react'
import { API_BASE_URL, buildFileUrl } from './postcard-components/postCardUtils.js'
import PostHeader from './postcard-components/PostHeader.jsx'
import PostMediaCarousel from './postcard-components/PostMediaCarousel.jsx'
import PostActions from './postcard-components/PostActions.jsx'
import PostStats from './postcard-components/PostStats.jsx'
import PostCaption from './postcard-components/PostCaption.jsx'
import CommentsSection from './postcard-components/CommentsSection.jsx'
import AddComment from './postcard-components/AddComment.jsx'

function PostCard({ post: initialPost, currentUserId }) {
    const [post, setPost] = useState(initialPost)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [editForm, setEditForm] = useState({
        caption: '',
        location: '',
        pictureUrls: '',
        tagNames: ''
    })

    const [liked, setLiked] = useState(Boolean(post.likedByCurrentUser))
    const [disliked, setDisliked] = useState(Boolean(post.dislikedByCurrentUser))
    const [saved, setSaved] = useState(false)

    const [likeCount, setLikeCount] = useState(Number(post.likeCount) || 0)
    const [dislikeCount, setDislikeCount] = useState(Number(post.dislikeCount) || 0)
    const [voteCount, setVoteCount] = useState(Number(post.voteCount) || 0)

    const [comments, setComments] = useState(post.comments || [])
    const [commentText, setCommentText] = useState('')
    const [showComments, setShowComments] = useState(false)

    const [expanded, setExpanded] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (initialPost) {
            if (post) {
                Object.assign(initialPost, post);
            }

            initialPost.likedByCurrentUser = liked;
            initialPost.dislikedByCurrentUser = disliked;
            initialPost.likeCount = likeCount;
            initialPost.dislikeCount = dislikeCount;
            initialPost.voteCount = voteCount;
            initialPost.comments = comments;
        }
    }, [post, liked, disliked, likeCount, dislikeCount, voteCount, comments, initialPost]);

    if (isDeleted) return null

    const images = Array.isArray(post.pictureUrls) && post.pictureUrls.length > 0
        ? post.pictureUrls.map(buildFileUrl)
        : post.pictureUrl ? [buildFileUrl(post.pictureUrl)] : []

    const currentImage = images[currentImageIndex] || ''

    const sortedComments = [...comments].sort((a, b) => {
        const byVotes = (Number(b.voteCount) || 0) - (Number(a.voteCount) || 0)
        return byVotes !== 0 ? byVotes : new Date(a.postedAt || 0) - new Date(b.postedAt || 0)
    })

    const isCurrentUserValid = () => currentUserId !== null && currentUserId !== undefined && !Number.isNaN(Number(currentUserId))

    const isOwner = Number(currentUserId) === Number(post.userId)

    const handleDeletePost = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/posts/${post.id}?userId=${currentUserId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setIsDeleted(true)
            } else {
                console.error("Nu s-a putut șterge postarea")
            }
        } catch (error) {
            console.error("Eroare la ștergere:", error)
        }
    }

    const handleReportPost = () => {
        alert("Postarea a fost raportată echipei de moderare.")
    }

    const openEditModal = () => {
        setEditForm({
            caption: post.caption || '',
            location: post.location || '',
            pictureUrls: (post.pictureUrls || []).join('\n') || post.pictureUrl || '',
            tagNames: (post.tagNames || []).join(', ')
        })
        setIsEditing(true)
    }

    const handleUpdatePost = async () => {
        const urls = editForm.pictureUrls.split('\n').map(s => s.trim()).filter(Boolean)
        const tags = editForm.tagNames.split(',').map(s => s.trim().replace(/^#/, '')).filter(Boolean)

        const payload = {
            userId: currentUserId,
            caption: editForm.caption,
            location: editForm.location,
            pictureUrls: urls,
            pictureUrl: urls.length > 0 ? urls[0] : null,
            tagNames: tags
        }

        try {
            const res = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                const updatedPost = await res.json()
                setPost(updatedPost)
                setIsEditing(false)
            } else {
                const errorData = await res.text()
                console.error("Eroare la update postare:", errorData)
                alert("Nu s-a putut salva: " + errorData)
            }
        } catch (error) {
            console.error("Eroare request update:", error)
            alert("Eroare de conexiune la server.")
        }
    }

    const handlePostVote = async (voteType) => {
        if (!isCurrentUserValid()) {
            console.error('currentUserId missing')
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/post-votes/toggle?userId=${currentUserId}&postId=${post.id}&voteType=${voteType}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            if (!response.ok) throw new Error('Failed to toggle post vote')

            const data = await response.json()

            setLiked(Boolean(data.liked))
            setDisliked(Boolean(data.disliked))
            setLikeCount(Number(data.likeCount) || 0)
            setDislikeCount(Number(data.dislikeCount) || 0)
            setVoteCount(Number(data.voteCount) || 0)
        } catch (error) {
            console.error('Post vote error:', error)
        }
    }

    const handleCommentVote = async (commentId, voteType) => {
        if (!isCurrentUserValid()) {
            console.error('currentUserId missing')
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/comment-votes/toggle?userId=${currentUserId}&commentId=${commentId}&voteType=${voteType}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            if (!response.ok) throw new Error('Failed to toggle comment vote')

            const data = await response.json()

            setComments((prev) =>
                prev.map((comment) =>
                    Number(comment.id) === Number(commentId)
                        ? {
                            ...comment,
                            likedByCurrentUser: Boolean(data.liked),
                            dislikedByCurrentUser: Boolean(data.disliked),
                            likeCount: Number(data.likeCount) || 0,
                            dislikeCount: Number(data.dislikeCount) || 0,
                            voteCount: Number(data.voteCount) || 0,
                        }
                        : comment
                )
            )
        } catch (error) {
            console.error('Comment vote error:', error)
        }
    }

    const handlePostComment = async () => {
        if (!commentText.trim()) return
        if (!isCurrentUserValid()) {
            console.error('currentUserId missing')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    postId: post.id,
                    text: commentText.trim(),
                }),
            })

            if (!response.ok) throw new Error('Failed to post comment')

            const newComment = await response.json()

            const enrichedComment = {
                ...newComment,
                userId: newComment.userId ?? currentUserId,
                username: newComment.username || 'user',
                userProfilePicture: buildFileUrl(newComment.userProfilePicture || ''),
                pictureUrl: buildFileUrl(newComment.pictureUrl || ''),
                likeCount: Number(newComment.likeCount) || 0,
                dislikeCount: Number(newComment.dislikeCount) || 0,
                voteCount: Number(newComment.voteCount) || 0,
                likedByCurrentUser: Boolean(newComment.likedByCurrentUser),
                dislikedByCurrentUser: Boolean(newComment.dislikedByCurrentUser),
            }

            setComments((prev) => [...prev, enrichedComment])
            setCommentText('')
            setShowComments(true)
        } catch (error) {
            console.error('Comment error:', error)
        }
    }

    return (
        <>
            <article style={{ borderBottom: '1px solid #262626', paddingBottom: 8, marginBottom: 8 }}>
                <PostHeader
                    post={post}
                    isOwner={isOwner}
                    onEditClick={openEditModal}
                    onDeleteClick={handleDeletePost}
                    onReportClick={handleReportPost}
                />

                <PostMediaCarousel
                    images={images}
                    currentImage={currentImage}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                />

                <div style={{ padding: '8px 4px 0' }}>
                    <PostActions
                        liked={liked} disliked={disliked} saved={saved}
                        setSaved={setSaved} handlePostVote={handlePostVote}
                        setShowComments={setShowComments}
                    />
                    <PostStats voteCount={voteCount} likeCount={likeCount} dislikeCount={dislikeCount} />
                    <PostCaption post={post} expanded={expanded} setExpanded={setExpanded} />
                    <CommentsSection showComments={showComments} sortedComments={sortedComments} handleCommentVote={handleCommentVote} />
                    <AddComment commentText={commentText} setCommentText={setCommentText} handlePostComment={handlePostComment} />
                </div>
            </article>

            {isEditing && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16
                }}>
                    <div style={{ background: '#262626', borderRadius: 12, width: '100%', maxWidth: 500, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <h2 style={{ color: 'white', margin: 0, fontSize: 18 }}>Edit Post</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ color: '#f5f5f5', fontSize: 14 }}>Caption</label>
                            <textarea
                                value={editForm.caption}
                                onChange={e => setEditForm({ ...editForm, caption: e.target.value })}
                                rows={3}
                                style={{ background: '#363636', border: '1px solid #4a4a4a', color: 'white', padding: 8, borderRadius: 6, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ color: '#f5f5f5', fontSize: 14 }}>Location</label>
                            <input
                                value={editForm.location}
                                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                style={{ background: '#363636', border: '1px solid #4a4a4a', color: 'white', padding: 8, borderRadius: 6 }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ color: '#f5f5f5', fontSize: 14 }}>Tags (comma separated)</label>
                            <input
                                value={editForm.tagNames}
                                placeholder="nature, travel, sunset"
                                onChange={e => setEditForm({ ...editForm, tagNames: e.target.value })}
                                style={{ background: '#363636', border: '1px solid #4a4a4a', color: 'white', padding: 8, borderRadius: 6 }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ color: '#f5f5f5', fontSize: 14 }}>Picture URLs (One URL per line)</label>
                            <textarea
                                value={editForm.pictureUrls}
                                placeholder="http://example.com/image1.jpg&#10;http://example.com/image2.jpg"
                                onChange={e => setEditForm({ ...editForm, pictureUrls: e.target.value })}
                                rows={4}
                                style={{ background: '#363636', border: '1px solid #4a4a4a', color: 'white', padding: 8, borderRadius: 6, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{ background: 'transparent', border: 'none', color: '#f5f5f5', cursor: 'pointer', padding: '8px 16px', fontWeight: 600 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePost}
                                style={{ background: '#0095f6', border: 'none', color: 'white', cursor: 'pointer', padding: '8px 16px', borderRadius: 8, fontWeight: 600 }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PostCard