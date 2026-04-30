import ChevronIcon from './icons/ChevronIcon.jsx'

function PostMediaCarousel({
                               images,
                               currentImage,
                               currentImageIndex,
                               setCurrentImageIndex,
                           }) {
    const prevImage = () => {
        setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1))
    }

    if (images.length === 0) return null

    return (
        <div
            style={{
                margin: '0 -4px',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid #262626',
                position: 'relative',
                background: '#000',
            }}
        >
            <img
                src={currentImage}
                alt={`post-${currentImageIndex}`}
                style={{
                    width: '100%',
                    maxHeight: 585,
                    objectFit: 'cover',
                    display: 'block',
                }}
            />

            {images.length > 1 && currentImageIndex > 0 && (
                <button
                    onClick={prevImage}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 10,
                        transform: 'translateY(-50%)',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(0,0,0,0.55)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ChevronIcon dir="left" />
                </button>
            )}

            {images.length > 1 && currentImageIndex < images.length - 1 && (
                <button
                    onClick={nextImage}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: 10,
                        transform: 'translateY(-50%)',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(0,0,0,0.55)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ChevronIcon dir="right" />
                </button>
            )}

            {images.length > 1 && (
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
                    {images.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            style={{
                                width: i === currentImageIndex ? 8 : 6,
                                height: i === currentImageIndex ? 8 : 6,
                                borderRadius: '50%',
                                background:
                                    i === currentImageIndex
                                        ? 'white'
                                        : 'rgba(255,255,255,0.45)',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default PostMediaCarousel