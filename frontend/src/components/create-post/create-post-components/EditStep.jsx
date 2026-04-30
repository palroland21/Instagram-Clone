import ImagePreviewPanel from './ImagePreviewPanel'
import PostDetailsPanel from './PostDetailsPanel'

function EditStep({
                      files,
                      currentIdx,
                      setCurrentIdx,
                      removeImage,
                      onSelectFiles,
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
        <>
            <ImagePreviewPanel
                files={files}
                currentIdx={currentIdx}
                setCurrentIdx={setCurrentIdx}
                removeImage={removeImage}
                onSelectFiles={onSelectFiles}
            />

            <PostDetailsPanel
                files={files}
                currentIdx={currentIdx}
                setCurrentIdx={setCurrentIdx}
                caption={caption}
                setCaption={setCaption}
                location={location}
                setLocation={setLocation}
                tagInput={tagInput}
                setTagInput={setTagInput}
                tags={tags}
                setTags={setTags}
                addTag={addTag}
                handleTagKey={handleTagKey}
                error={error}
                loading={loading}
                onShare={onShare}
            />
        </>
    )
}

export default EditStep