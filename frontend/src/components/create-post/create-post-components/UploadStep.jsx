import { ImageIcon } from './icons'

function UploadStep({ dragging, setDragging, onDrop, onSelectFiles }) {
    return (
        <div
            className={`create-post-upload ${
                dragging ? 'create-post-upload--dragging' : ''
            }`}
            onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={onSelectFiles}
        >
            <ImageIcon />

            <div className="create-post-upload-text">
                <div className="create-post-upload-title">
                    Drag photos here
                </div>

                <div className="create-post-upload-subtitle">
                    You can add multiple images
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelectFiles()
                    }}
                    className="create-post-select-btn"
                >
                    Select from computer
                </button>
            </div>
        </div>
    )
}

export default UploadStep