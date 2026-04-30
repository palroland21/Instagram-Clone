import TagInput from './TagInput'

function PostDetailsPanel({
                              files,
                              currentIdx,
                              setCurrentIdx,
                              caption,
                              setCaption,
                              location,
                              setLocation,
                              tagInput,
                              setTagInput,
                              tags,
                              setTags,
                              addTag,
                              handleTagKey,
                              error,
                              loading,
                              onShare,
                          }) {
    return (
        <div className="create-post-details-panel">
            {files.length > 1 && (
                <div className="create-post-thumbnails">
                    {files.map((file, index) => (
                        <img
                            key={index}
                            src={file.preview}
                            alt={`thumb ${index}`}
                            onClick={() => setCurrentIdx(index)}
                            className={`create-post-thumbnail ${
                                index === currentIdx
                                    ? 'create-post-thumbnail--active'
                                    : ''
                            }`}
                        />
                    ))}
                </div>
            )}

            <div className="create-post-fields">
                <div>
                    <label className="create-post-label">
                        Caption
                    </label>

                    <textarea
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        maxLength={2200}
                        rows={5}
                        className="create-post-textarea"
                    />

                    <div className="create-post-counter">
                        {caption.length}/2200
                    </div>
                </div>

                <div className="create-post-separator" />

                <TagInput
                    tags={tags}
                    setTags={setTags}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    addTag={addTag}
                    handleTagKey={handleTagKey}
                />

                <div className="create-post-separator" />

                <div>
                    <label className="create-post-label">
                        Location
                    </label>

                    <input
                        placeholder="Add location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="create-post-input"
                    />
                </div>

                {error && (
                    <div className="create-post-error">
                        {error}
                    </div>
                )}

                <button
                    onClick={onShare}
                    disabled={loading || files.length === 0}
                    className="create-post-mobile-share-btn"
                >
                    {loading ? 'Sharing...' : 'Share'}
                </button>
            </div>
        </div>
    )
}

export default PostDetailsPanel