import { useState } from 'react'
import { API_BASE_URL, buildFileUrl } from './postcard-components/postCardUtils.js'
import PostHeader from './postcard-components/PostHeader.jsx'
import PostMediaCarousel from './postcard-components/PostMediaCarousel.jsx'
import PostActions from './postcard-components/PostActions.jsx'
import PostStats from './postcard-components/PostStats.jsx'
import PostCaption from './postcard-components/PostCaption.jsx'
import CommentsSection from './postcard-components/CommentsSection.jsx'
import AddComment from './postcard-components/AddComment.jsx'

function PostCard({ post, currentUserId }) {
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

    const images =
        Array.isArray(post.pictureUrls) && post.pictureUrls.length > 0
            ? post.pictureUrls.map(buildFileUrl)
            : post.pictureUrl
                ? [buildFileUrl(post.pictureUrl)]
                : []

    const currentImage = images[currentImageIndex] || ''

    const sortedComments = [...comments].sort((a, b) => {
        const byVotes = (Number(b.voteCount) || 0) - (Number(a.voteCount) || 0)

        if (byVotes !== 0) {
            return byVotes
        }

        return new Date(a.postedAt || 0) - new Date(b.postedAt || 0)
    })

    const isCurrentUserValid = () => {
        return currentUserId !== null && currentUserId !== undefined && !Number.isNaN(Number(currentUserId))
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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to toggle post vote')
            }

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to toggle comment vote')
            }

            const data = await response.json()

            setComments((prevComments) =>
                prevComments.map((comment) =>
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

            if (!response.ok) {
                throw new Error('Failed to post comment')
            }

            const newComment = await response.json()

            const enrichedComment = {
                ...newComment,
                userId:
                    newComment.userId ??
                    newComment.authorId ??
                    newComment.user?.id ??
                    newComment.author?.id ??
                    currentUserId,
                username:
                    newComment.username ||
                    newComment.author?.username ||
                    'user',
                userProfilePicture: buildFileUrl(
                    newComment.userProfilePicture ||
                    newComment.author?.profilePicture ||
                    newComment.user?.profilePicture ||
                    ''
                ),
                pictureUrl: buildFileUrl(
                    newComment.pictureUrl ||
                    newComment.picture ||
                    newComment.imageUrl ||
                    newComment.image ||
                    ''
                ),
                likeCount: Number(newComment.likeCount) || 0,
                dislikeCount: Number(newComment.dislikeCount) || 0,
                voteCount: Number(newComment.voteCount) || 0,
                likedByCurrentUser: Boolean(newComment.likedByCurrentUser),
                dislikedByCurrentUser: Boolean(newComment.dislikedByCurrentUser),
            }

            setComments((prevComments) => [...prevComments, enrichedComment])
            setCommentText('')
            setShowComments(true)
        } catch (error) {
            console.error('Comment error:', error)
        }
    }

    return (
        <article
            style={{
                borderBottom: '1px solid #262626',
                paddingBottom: 8,
                marginBottom: 8,
            }}
        >
            <PostHeader post={post} />

            <PostMediaCarousel
                images={images}
                currentImage={currentImage}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
            />

            <div style={{ padding: '8px 4px 0' }}>
                <PostActions
                    liked={liked}
                    disliked={disliked}
                    saved={saved}
                    setSaved={setSaved}
                    handlePostVote={handlePostVote}
                    setShowComments={setShowComments}
                />

                <PostStats
                    voteCount={voteCount}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                />

                <PostCaption
                    post={post}
                    expanded={expanded}
                    setExpanded={setExpanded}
                />

                <CommentsSection
                    showComments={showComments}
                    sortedComments={sortedComments}
                    handleCommentVote={handleCommentVote}
                />

                <AddComment
                    commentText={commentText}
                    setCommentText={setCommentText}
                    handlePostComment={handlePostComment}
                />
            </div>
        </article>
    )
}

export default PostCard