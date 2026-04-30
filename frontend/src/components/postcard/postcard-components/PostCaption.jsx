function PostCaption({ post, expanded, setExpanded }) {
    const captionText = post.caption || ''
    const tagLine = post.tagNames?.length > 0
        ? post.tagNames.map((tag) => `#${tag}`).join(' ')
        : ''

    const fullText = [captionText, tagLine].filter(Boolean).join('\n')
    const isLong = fullText.length > 125
    const displayText = isLong && !expanded ? fullText.slice(0, 125) : fullText

    const renderLine = (line, key) => {
        const parts = line.split(/(#\S+)/g)

        return (
            <span key={key}>
                {parts.map((part, index) =>
                    part.startsWith('#') ? (
                        <span
                            key={index}
                            style={{
                                color: '#0095f6',
                                cursor: 'pointer',
                            }}
                        >
                            {part}
                        </span>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
            </span>
        )
    }

    if (!fullText) return null

    return (
        <div
            style={{
                fontSize: 14,
                color: '#f5f5f5',
                lineHeight: 1.5,
                marginBottom: 4,
            }}
        >
            <span
                style={{
                    fontWeight: 700,
                    marginRight: 6,
                    cursor: 'pointer',
                }}
            >
                {post.username}
            </span>

            {displayText.split('\n').map((line, index, arr) => (
                <span key={index}>
                    {renderLine(line, index)}
                    {index < arr.length - 1 && <br />}
                </span>
            ))}

            {isLong && (
                <span
                    onClick={() => setExpanded((prev) => !prev)}
                    style={{
                        color: '#737373',
                        cursor: 'pointer',
                        marginLeft: 4,
                    }}
                >
                    {expanded ? ' less' : '... more'}
                </span>
            )}
        </div>
    )
}

export default PostCaption