function TagInput({
                      tags,
                      setTags,
                      tagInput,
                      setTagInput,
                      addTag,
                      handleTagKey,
                  }) {
    return (
        <div>
            <label className="create-post-label">
                Tags
            </label>

            <div className="create-post-tags-box">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="create-post-tag"
                    >
                        #{tag}

                        <button
                            onClick={() =>
                                setTags((prev) =>
                                    prev.filter((item) => item !== tag)
                                )
                            }
                            className="create-post-tag-remove-btn"
                        >
                            ×
                        </button>
                    </span>
                ))}

                <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKey}
                    onBlur={addTag}
                    placeholder={
                        tags.length === 0
                            ? 'Add tags (press Enter or Space)...'
                            : ''
                    }
                    className="create-post-tag-input"
                />
            </div>

            <div className="create-post-hint">
                Press Enter, Space or comma to add a tag
            </div>
        </div>
    )
}

export default TagInput