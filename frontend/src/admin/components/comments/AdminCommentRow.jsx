import DeleteCommentButton from "./DeleteCommentButton";
import EditCommentModal from "./EditCommentModal";

function getCommentId(comment) {
  return comment.id ?? comment.commentId;
}

function getAuthorName(comment) {
  return (
    comment.author?.username ||
    comment.authorUsername ||
    comment.username ||
    comment.user?.username ||
    "Unknown author"
  );
}

function getCommentText(comment) {
  return comment.text || comment.content || "-";
}

function getPostTitle(comment) {
  return (
    comment.post?.title ||
    comment.postTitle ||
    comment.title ||
    `Post ID: ${comment.postId ?? comment.post?.id ?? "-"}`
  );
}

function getCreatedAt(comment) {
  const rawDate =
    comment.createdAt ||
    comment.creationDate ||
    comment.createdDate ||
    comment.dateCreated;

  if (!rawDate) {
    return "-";
  }

  return new Date(rawDate).toLocaleString();
}

function AdminCommentRow({ comment, onCommentUpdated }) {
  const commentId = getCommentId(comment);
  const authorName = getAuthorName(comment);
  const text = getCommentText(comment);
  const postTitle = getPostTitle(comment);
  const createdAt = getCreatedAt(comment);
  const voteCount = comment.voteCount ?? comment.score ?? comment.votes ?? 0;

  return (
    <tr>
      <td>
        <div className="admin-comment-text">{text}</div>
        <div className="admin-comment-id">ID: {commentId}</div>
      </td>

      <td>{authorName}</td>

      <td>
        <div className="admin-comment-post">
          {postTitle}
        </div>
      </td>

      <td>{voteCount}</td>
      <td>{createdAt}</td>

      <td>
        <div className="admin-actions-cell">
          <EditCommentModal
            comment={comment}
            commentId={commentId}
            onDone={onCommentUpdated}
          />

          <DeleteCommentButton
            comment={comment}
            commentId={commentId}
            onDone={onCommentUpdated}
          />
        </div>
      </td>
    </tr>
  );
}

export default AdminCommentRow;