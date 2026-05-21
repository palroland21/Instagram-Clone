const TEST_DATA_MARKERS = ['cypress', 'e2e_']

function hasTestMarker(value) {
    return typeof value === 'string' &&
        TEST_DATA_MARKERS.some(marker => value.toLowerCase().includes(marker))
}

function hasAnyTestMarker(values) {
    return values.some(hasTestMarker)
}

export function isCypressTestUser(user = {}) {
    return hasAnyTestMarker([
        user.username,
        user.name,
        user.fullName,
        user.email,
        user.bio,
    ])
}

export function isCypressTestComment(comment = {}) {
    return hasAnyTestMarker([
        comment.username,
        comment.authorUsername,
        comment.text,
        comment.content,
        comment.postTitle,
        comment.title,
        comment.author?.username,
        comment.author?.fullName,
        comment.user?.username,
        comment.user?.fullName,
        comment.post?.title,
        comment.post?.text,
        comment.post?.content,
        comment.post?.caption,
        comment.post?.author?.username,
        comment.post?.author?.fullName,
        comment.post?.user?.username,
        comment.post?.user?.fullName,
    ])
}

export function isCypressTestPost(post = {}) {
    const tagNames = Array.isArray(post.tagNames) ? post.tagNames : []

    return hasAnyTestMarker([
        post.username,
        post.authorUsername,
        post.title,
        post.caption,
        post.text,
        post.description,
        post.content,
        post.author?.username,
        post.author?.fullName,
        post.user?.username,
        post.user?.fullName,
        ...tagNames,
    ])
}
