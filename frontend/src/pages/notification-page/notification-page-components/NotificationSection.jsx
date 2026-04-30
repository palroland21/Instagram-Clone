import NotificationItem from './NotificationItem'

function NotificationSection({ title, items }) {
    if (items.length === 0) return null

    return (
        <section className="notifications-section">
            <h2 className="notifications-section-title">
                {title}
            </h2>

            <div>
                {items.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                ))}
            </div>
        </section>
    )
}

export default NotificationSection