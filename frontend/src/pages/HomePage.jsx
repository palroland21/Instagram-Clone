import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import RightSidebar from '../components/RightSidebar'

function HomePage() {
    const [activeItem, setActiveItem] = useState('home')
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [showRightSidebar, setShowRightSidebar] = useState(window.innerWidth >= 1100)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
            setShowRightSidebar(window.innerWidth >= 1100)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const LEFT_SIDEBAR_WIDTH = 244
    const RIGHT_SIDEBAR_WIDTH = 320
    const RIGHT_GAP = 32

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isMobile={isMobile}
            />

            {/* Main content */}
            <div
                style={{
                    minHeight: '100vh',
                    paddingBottom: isMobile ? '74px' : 0,
                    boxSizing: 'border-box',

                    ...(isMobile
                        ? {
                            display: 'flex',
                            justifyContent: 'center',
                        }
                        : {
                            marginLeft: LEFT_SIDEBAR_WIDTH,
                            marginRight: showRightSidebar ? RIGHT_SIDEBAR_WIDTH + RIGHT_GAP : 0,
                            display: 'flex',
                            justifyContent: 'center',
                        }),
                }}
            >
                {/* Center Feed */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: isMobile ? '100%' : 470,
                        padding: isMobile ? '0 16px' : '0 0px',
                        boxSizing: 'border-box',
                    }}
                >
                    <Feed />
                </div>
            </div>

            {/* Right Sidebar — only on wide screens */}
            {showRightSidebar && !isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: RIGHT_SIDEBAR_WIDTH,
                        height: '100vh',
                        padding: '20px 24px 0 0',
                        boxSizing: 'border-box',
                        overflowY: 'auto',
                    }}
                >
                    <RightSidebar />
                </div>
            )}
        </div>
    )
}

export default HomePage