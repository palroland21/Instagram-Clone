import './create-post-components/createPostModal.css'
import CreatePostContent from './create-post-components/CreatePostContent'

function CreatePostModal({ onClose, onPostCreated }) {
    return (
        <CreatePostContent
            onClose={onClose}
            onPostCreated={onPostCreated}
        />
    )
}

export default CreatePostModal