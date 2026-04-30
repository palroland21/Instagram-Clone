import { useState, useRef, useCallback, useEffect } from 'react'
import ModalHeader from './ModalHeader'
import UploadStep from './UploadStep'
import EditStep from './EditStep'
import { createPost, uploadSingleImage } from './createPostApi'

function CreatePostContent({ onClose, onPostCreated }) {
    const [step, setStep] = useState('upload')
    const [files, setFiles] = useState([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [dragging, setDragging] = useState(false)

    const [caption, setCaption] = useState('')
    const [location, setLocation] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fileInputRef = useRef(null)
    const filesRef = useRef([])

    useEffect(() => {
        filesRef.current = files
    }, [files])

    useEffect(() => {
        return () => {
            filesRef.current.forEach((item) => {
                URL.revokeObjectURL(item.preview)
            })
        }
    }, [])

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    const addFiles = useCallback((newFiles) => {
        const imageFiles = Array.from(newFiles).filter((file) =>
            file.type.startsWith('image/')
        )

        if (imageFiles.length === 0) return

        const mappedFiles = imageFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }))

        setFiles((prev) => {
            const updated = [...prev, ...mappedFiles]
            setCurrentIdx(updated.length - 1)
            return updated
        })

        setStep('edit')
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        addFiles(e.dataTransfer.files)
    }

    const handleFileInput = (e) => {
        addFiles(e.target.files)
        e.target.value = ''
    }

    const removeImage = (idx) => {
        setFiles((prev) => {
            if (prev[idx]) {
                URL.revokeObjectURL(prev[idx].preview)
            }

            const next = prev.filter((_, index) => index !== idx)

            if (next.length === 0) {
                setStep('upload')
                setCurrentIdx(0)
            } else {
                setCurrentIdx(Math.max(0, Math.min(idx, next.length - 1)))
            }

            return next
        })
    }

    const addTag = () => {
        const cleanTag = tagInput.trim().replace(/^#/, '').toLowerCase()

        if (cleanTag && !tags.includes(cleanTag)) {
            setTags((prev) => [...prev, cleanTag])
        }

        setTagInput('')
    }

    const handleTagKey = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            e.preventDefault()
            addTag()
        }

        if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            setTags((prev) => prev.slice(0, -1))
        }
    }

    const handleShare = async () => {
        if (files.length === 0) return

        setError('')
        setLoading(true)

        try {
            const token = localStorage.getItem('token')
            const userId = Number(localStorage.getItem('userId'))

            if (!token) {
                throw new Error('You are not logged in.')
            }

            if (!userId) {
                throw new Error('User id not found.')
            }

            const uploadedUrls = await Promise.all(
                files.map(({ file }) => uploadSingleImage(file, token))
            )

            const postData = await createPost({
                token,
                userId,
                pictureUrls: uploadedUrls,
                caption,
                location,
                tags,
            })

            onPostCreated?.(postData)
            onClose()
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="create-post-overlay" onClick={onClose}>
            <div
                className={`create-post-modal ${
                    step === 'edit' ? 'create-post-modal--edit' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <ModalHeader
                    step={step}
                    loading={loading}
                    onClose={onClose}
                    onShare={handleShare}
                />

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="create-post-hidden-input"
                    onChange={handleFileInput}
                />

                <div className="create-post-body">
                    {step === 'upload' && (
                        <UploadStep
                            dragging={dragging}
                            setDragging={setDragging}
                            onDrop={handleDrop}
                            onSelectFiles={openFileDialog}
                        />
                    )}

                    {step === 'edit' && (
                        <EditStep
                            files={files}
                            currentIdx={currentIdx}
                            setCurrentIdx={setCurrentIdx}
                            removeImage={removeImage}
                            onSelectFiles={openFileDialog}
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
                            onShare={handleShare}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreatePostContent