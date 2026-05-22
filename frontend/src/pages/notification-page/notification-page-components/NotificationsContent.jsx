import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import NotificationSection from './NotificationSection'
import { fetchNotificationsData } from './notificationsApi'
import {
    groupNotifications,
    markNotificationsAsSeen,
} from './notificationHelpers'
import { getCurrentUserId, getToken } from '../../../services'

function NotificationsContent() {
    const [activeItem, setActiveItem] = useState('notifications')
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const token = getToken()
    const currentUserId = getCurrentUserId()

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true)
                setError('')

                if (!token || !currentUserId) {
                    setError('You are not logged in.')
                    setLoading(false)
                    return
                }

                const notificationsList = await fetchNotificationsData({
                    token,
                    currentUserId,
                })

                setNotifications(notificationsList)

                markNotificationsAsSeen(currentUserId, notificationsList)
            } catch (err) {
                console.error('Notifications fetch error:', err)
                setError('Could not load notifications.')
            } finally {
                setLoading(false)
            }
        }

        loadNotifications()
    }, [token, currentUserId])

    const groupedNotifications = useMemo(() => {
        return groupNotifications(notifications)
    }, [notifications])

    return (
        <div className="notifications-page">
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isMobile={false}
            />

            <main className="notifications-main">
                <div className="notifications-container">
                    <h1 className="notifications-title">
                        Notifications
                    </h1>

                    {loading && (
                        <div className="notifications-info">
                            Loading notifications...
                        </div>
                    )}

                    {error && (
                        <div className="notifications-info">
                            {error}
                        </div>
                    )}

                    {!loading && !error && notifications.length === 0 && (
                        <div className="notifications-info">
                            No notifications yet.
                        </div>
                    )}

                    {!loading && !error && notifications.length > 0 && (
                        <>
                            <NotificationSection
                                title="Today"
                                items={groupedNotifications.today}
                            />

                            <NotificationSection
                                title="This week"
                                items={groupedNotifications.thisWeek}
                            />

                            <NotificationSection
                                title="Older"
                                items={groupedNotifications.older}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default NotificationsContent
