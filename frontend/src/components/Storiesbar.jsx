import { STORIES, CURRENT_USER } from '../mockData'

const GRADIENT_RING = 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
const SEEN_RING = '#333'

function StoryAvatar({ story }) {
    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer' }}
        >
            <div style={{
                background: story.seen ? SEEN_RING : GRADIENT_RING,
                borderRadius: '50%',
                padding: 2,
            }}>
                <div style={{ background: '#000', borderRadius: '50%', padding: 2 }}>
                    <img
                        src={story.avatar}
                        alt={story.username}
                        style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                    />
                </div>
            </div>
            <span style={{
                fontSize: 12,
                color: story.seen ? '#737373' : '#f5f5f5',
                maxWidth: 64,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
        {story.username}
      </span>
        </div>
    )
}

function StoriesBar() {
    return (
        <div style={{ borderBottom: '1px solid #262626', padding: '16px 0' }}>
            <div style={{
                display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4,
                scrollbarWidth: 'none',
            }}>
                {/* Your Story */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={CURRENT_USER.avatar}
                            alt="your story"
                            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '1px solid #333' }}
                        />
                        <div style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 20, height: 20, borderRadius: '50%',
                            background: '#0095f6', border: '2px solid #000',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, color: 'white', fontWeight: 'bold', lineHeight: 1,
                        }}>
                            +
                        </div>
                    </div>
                    <span style={{ fontSize: 12, color: '#f5f5f5', maxWidth: 64, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Your story
          </span>
                </div>

                {/* Other stories */}
                {STORIES.map(story => (
                    <StoryAvatar key={story.id} story={story} />
                ))}
            </div>
        </div>
    )
}

export default StoriesBar