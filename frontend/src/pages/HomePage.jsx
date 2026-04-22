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

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isMobile={isMobile}
            />

            {/* Main content */}
            <div style={{
                marginLeft: isMobile ? 0 : 244,
                marginBottom: isMobile ? 60 : 0,
                display: 'flex',
                justifyContent: 'center',
                minHeight: '100vh',
            }}>
                {/* Center Feed */}
                <div style={{
                    width: '100%',
                    maxWidth: isMobile ? '100%' : 470,
                    padding: isMobile ? '0 0' : '0 24px',
                }}>
                    <Feed />
                </div>

                {/* Right Sidebar — only on wide screens */}
                {showRightSidebar && (
                    <div style={{ width: 320, flexShrink: 0, padding: '0 0 0 28px' }}>
                        <RightSidebar />
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage