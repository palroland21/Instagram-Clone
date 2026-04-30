function ChevronIcon({ dir }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {dir === 'left'
                ? <polyline points="15 18 9 12 15 6" />
                : <polyline points="9 18 15 12 9 6" />
            }
        </svg>
    )
}

export default ChevronIcon