import { ChevronIcon, CloseIcon } from './icons'

function ImagePreviewPanel({
                               files,
                               currentIdx,
                               setCurrentIdx,
                               removeImage,
                               onSelectFiles,
                           }) {
    return (
        <div className="create-post-preview-panel">
            {files.length > 0 && (
                <img
                    src={files[currentIdx]?.preview}
                    alt={`preview ${currentIdx}`}
                    className="create-post-preview-image"
                />
            )}

            {files.length > 1 && (
                <>
                    {currentIdx > 0 && (
                        <button
                            onClick={() => setCurrentIdx((index) => index - 1)}
                            className="create-post-nav-btn create-post-nav-btn--left"
                        >
                            <ChevronIcon dir="left" />
                        </button>
                    )}

                    {currentIdx < files.length - 1 && (
                        <button
                            onClick={() => setCurrentIdx((index) => index + 1)}
                            className="create-post-nav-btn create-post-nav-btn--right"
                        >
                            <ChevronIcon dir="right" />
                        </button>
                    )}

                    <div className="create-post-dots">
                        {files.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIdx(index)}
                                className={`create-post-dot ${
                                    index === currentIdx
                                        ? 'create-post-dot--active'
                                        : ''
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}

            <button
                onClick={() => removeImage(currentIdx)}
                className="create-post-remove-image-btn"
            >
                <CloseIcon />
            </button>

            <button
                onClick={onSelectFiles}
                className="create-post-add-more-btn"
            >
                + Add more
            </button>
        </div>
    )
}

export default ImagePreviewPanel