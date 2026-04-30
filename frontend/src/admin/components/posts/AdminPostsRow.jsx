import DeletePostButton from "./DeletePostButton";
import EditPostModal from "./EditPostModal";

function getPostId(post) {
    return post.id ?? post.postId;
}

function getAuthorName(post) {
    return (
        post.author?.username ||
        post.authorUsername ||
        post.username ||
        post.user?.username ||
        "Unknown author"
    );
}

function getPostText(post) {
    return post.text || post.description || post.content || "-";
}

function getCreatedAt(post) {
    const rawDate =
        post.createdAt ||
        post.creationDate ||
        post.createdDate ||
        post.dateCreated;

    if (!rawDate) {
        return "-";
    }

    return new Date(rawDate).toLocaleString();
}

function AdminPostRow({ post, onPostUpdated }) {
    const postId = getPostId(post);
    const title = post.title || "Untitled post";
    const text = getPostText(post);
    const authorName = getAuthorName(post);
    const createdAt = getCreatedAt(post);
    const status = post.status || "-";

    return (
        <tr>
            <td>
                <div className="admin-post-title">{title}</div>
                <div className="admin-post-id">ID: {postId}</div>
            </td>

            <td>{authorName}</td>

            <td>
                <div className="admin-post-text">
                    {text}
                </div>
            </td>

            <td>{status}</td>
            <td>{createdAt}</td>

            <td>
                <div className="admin-actions-cell">
                    <EditPostModal
                        post={post}
                        postId={postId}
                        onDone={onPostUpdated}
                    />

                    <DeletePostButton
                        post={post}
                        postId={postId}
                        onDone={onPostUpdated}
                    />
                </div>
            </td>
        </tr>
    );
}

export default AdminPostRow;