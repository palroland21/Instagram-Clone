import { useState, useRef, useCallback, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:9090'

// ─── small helpers ────────────────────────────────────────────────────────────

function CloseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    )
}

function ImageIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    )
}

function ChevronIcon({ dir }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            {dir === 'left'
                ? <polyline points="15 18 9 12 15 6" />
                : <polyline points="9 18 15 12 9 6" />
            }
        </svg>
    )
}

// ─── main component ────────────────────────────────────────────────────────────

function CreatePostModal({ onClose, onPostCreated }) {
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

    const fileInputRef = useRef()

    useEffect(() => {
        return () => {
            files.forEach((item) => URL.revokeObjectURL(item.preview))
        }
    }, [files])

    const addFiles = useCallback((newFiles) => {
        const imageFiles = Array.from(newFiles).filter((f) => f.type.startsWith('image/'))

        if (imageFiles.length === 0) return

        const mapped = imageFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }))

        setFiles((prev) => {
            const updated = [...prev, ...mapped]
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

            const next = prev.filter((_, i) => i !== idx)

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
        const clean = tagInput.trim().replace(/^#/, '').toLowerCase()
        if (clean && !tags.includes(clean)) {
            setTags((prev) => [...prev, clean])
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

    const uploadSingleImage = async (file, token) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${API_BASE_URL}/uploads/image`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const data = await response.json().catch(() => null)

        if (!response.ok) {
            throw new Error(data?.message || 'Image upload failed')
        }

        return data.url
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

            const postRes = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    pictureUrls: uploadedUrls,
                    caption,
                    location,
                    tagNames: tags,
                    title: caption.trim().slice(0, 60) || 'Post',
                }),
            })

            const postData = await postRes.json().catch(() => null)

            if (!postRes.ok) {
                throw new Error(postData?.message || 'Failed to create post')
            }

            onPostCreated?.(postData)
            onClose()
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: 16,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#1a1a1a',
                    borderRadius: 16,
                    width: '100%',
                    maxWidth: step === 'edit' ? 900 : 520,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'max-width 0.3s ease',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 20px',
                        borderBottom: '1px solid #2a2a2a',
                    }}
                >
                    <div style={{ width: 28 }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
                        {step === 'upload' ? 'Create new post' : 'New post'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {step === 'edit' && (
                            <button
                                onClick={handleShare}
                                disabled={loading}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    color: loading ? '#555' : '#0095f6',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    padding: 0,
                                }}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#999',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                    {step === 'upload' && (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault()
                                setDragging(true)
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 16,
                                padding: 48,
                                cursor: 'pointer',
                                minHeight: 380,
                                background: dragging ? '#252525' : 'transparent',
                                transition: 'background 0.15s',
                                border: dragging ? '2px dashed #0095f6' : '2px dashed transparent',
                                borderRadius: 12,
                                margin: 16,
                            }}
                        >
                            <ImageIcon />
                            <div style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: 'white',
                                        marginBottom: 8,
                                    }}
                                >
                                    Drag photos here
                                </div>
                                <div
                                    style={{
                                        fontSize: 14,
                                        color: '#737373',
                                        marginBottom: 20,
                                    }}
                                >
                                    You can add multiple images
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        fileInputRef.current?.click()
                                    }}
                                    style={{
                                        background: '#0095f6',
                                        border: 'none',
                                        borderRadius: 8,
                                        color: 'white',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Select from computer
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileInput}
                            />
                        </div>
                    )}

                    {step === 'edit' && (
                        <>
                            <div
                                style={{
                                    width: 500,
                                    flexShrink: 0,
                                    background: '#000',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {files.length > 0 && (
                                    <img
                                        src={files[currentIdx]?.preview}
                                        alt={`preview ${currentIdx}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                        }}
                                    />
                                )}

                                {files.length > 1 && (
                                    <>
                                        {currentIdx > 0 && (
                                            <button
                                                onClick={() => setCurrentIdx((i) => i - 1)}
                                                style={navBtnStyle('left')}
                                            >
                                                <ChevronIcon dir="left" />
                                            </button>
                                        )}
                                        {currentIdx < files.length - 1 && (
                                            <button
                                                onClick={() => setCurrentIdx((i) => i + 1)}
                                                style={navBtnStyle('right')}
                                            >
                                                <ChevronIcon dir="right" />
                                            </button>
                                        )}

                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: 12,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                display: 'flex',
                                                gap: 6,
                                            }}
                                        >
                                            {files.map((_, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setCurrentIdx(i)}
                                                    style={{
                                                        width: i === currentIdx ? 8 : 6,
                                                        height: i === currentIdx ? 8 : 6,
                                                        borderRadius: '50%',
                                                        background: i === currentIdx ? 'white' : 'rgba(255,255,255,0.4)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={() => removeImage(currentIdx)}
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        background: 'rgba(0,0,0,0.6)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                    }}
                                >
                                    <CloseIcon />
                                </button>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        position: 'absolute',
                                        bottom: 12,
                                        right: 12,
                                        background: 'rgba(0,0,0,0.6)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 8,
                                        padding: '6px 12px',
                                        color: 'white',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    + Add more
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleFileInput}
                                />
                            </div>

                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderLeft: '1px solid #2a2a2a',
                                    overflowY: 'auto',
                                }}
                            >
                                {files.length > 1 && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: 6,
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #2a2a2a',
                                            overflowX: 'auto',
                                            scrollbarWidth: 'none',
                                        }}
                                    >
                                        {files.map((f, i) => (
                                            <img
                                                key={i}
                                                src={f.preview}
                                                alt={`thumb ${i}`}
                                                onClick={() => setCurrentIdx(i)}
                                                style={{
                                                    width: 52,
                                                    height: 52,
                                                    borderRadius: 6,
                                                    objectFit: 'cover',
                                                    flexShrink: 0,
                                                    cursor: 'pointer',
                                                    outline: i === currentIdx ? '2px solid #0095f6' : '2px solid transparent',
                                                    transition: 'outline 0.15s',
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div
                                    style={{
                                        padding: '16px 20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 20,
                                        flex: 1,
                                    }}
                                >
                                    <div>
                                        <label
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: '#999',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                display: 'block',
                                                marginBottom: 8,
                                            }}
                                        >
                                            Caption
                                        </label>
                                        <textarea
                                            placeholder="Write a caption..."
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            maxLength={2200}
                                            rows={5}
                                            style={{
                                                width: '100%',
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'white',
                                                fontSize: 14,
                                                outline: 'none',
                                                resize: 'none',
                                                lineHeight: 1.6,
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                        <div style={{ textAlign: 'right', fontSize: 11, color: '#555', marginTop: 4 }}>
                                            {caption.length}/2200
                                        </div>
                                    </div>

                                    <div style={{ height: 1, background: '#2a2a2a' }} />

                                    <div>
                                        <label
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: '#999',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                display: 'block',
                                                marginBottom: 8,
                                            }}
                                        >
                                            Tags
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 6,
                                                background: '#252525',
                                                borderRadius: 10,
                                                padding: '10px 12px',
                                                minHeight: 44,
                                                alignItems: 'center',
                                            }}
                                        >
                                            {tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    style={{
                                                        background: '#0a3d62',
                                                        color: '#64b5f6',
                                                        borderRadius: 6,
                                                        padding: '3px 10px',
                                                        fontSize: 13,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 6,
                                                    }}
                                                >
                                                    #{tag}
                                                    <button
                                                        onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#64b5f6',
                                                            cursor: 'pointer',
                                                            padding: 0,
                                                            fontSize: 14,
                                                            lineHeight: 1,
                                                            display: 'flex',
                                                        }}
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
                                                placeholder={tags.length === 0 ? 'Add tags (press Enter or Space)...' : ''}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'white',
                                                    fontSize: 13,
                                                    outline: 'none',
                                                    flex: 1,
                                                    minWidth: 80,
                                                    fontFamily: 'inherit',
                                                }}
                                            />
                                        </div>
                                        <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
                                            Press Enter, Space or comma to add a tag
                                        </div>
                                    </div>

                                    <div style={{ height: 1, background: '#2a2a2a' }} />

                                    <div>
                                        <label
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: '#999',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                display: 'block',
                                                marginBottom: 8,
                                            }}
                                        >
                                            Location
                                        </label>
                                        <input
                                            placeholder="Add location..."
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'white',
                                                fontSize: 14,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                    </div>

                                    {error && (
                                        <div
                                            style={{
                                                background: 'rgba(180,35,24,0.15)',
                                                border: '1px solid rgba(180,35,24,0.3)',
                                                color: '#ff6b6b',
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                fontSize: 13,
                                            }}
                                        >
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleShare}
                                        disabled={loading || files.length === 0}
                                        style={{
                                            marginTop: 'auto',
                                            width: '100%',
                                            padding: '12px',
                                            background: loading ? '#555' : '#0095f6',
                                            border: 'none',
                                            borderRadius: 10,
                                            color: 'white',
                                            fontSize: 15,
                                            fontWeight: 700,
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'none',
                                        }}
                                    >
                                        {loading ? 'Sharing...' : 'Share'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function navBtnStyle(side) {
    return {
        position: 'absolute',
        top: '50%',
        [side]: 10,
        transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.6)',
        border: 'none',
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    }
}

export default CreatePostModal