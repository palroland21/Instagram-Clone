import { useEffect, useState } from 'react';
import { fetchNotificationsData } from '../../pages/notification-page/notification-page-components/notificationsApi';
import {
    buildNotifications,
    hasUnreadNotifications,
    markNotificationsAsSeen,
    NOTIFICATIONS_SEEN_EVENT,
} from '../../pages/notification-page/notification-page-components/notificationHelpers';
import {
    getCurrentUserId,
    getToken,
} from '../../services';

const NOTIFICATION_CHECK_INTERVAL_MS = 5000;

function useUnreadNotifications() {
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const token = getToken();
        const storedUserId = getCurrentUserId();

        if (!token || !storedUserId) {
            return;
        }

        let cancelled = false;

        const checkUnreadNotifications = async () => {
            try {
                const data = await fetchNotificationsData({
                    token,
                    currentUserId: storedUserId,
                });

                const notificationsList = buildNotifications({
                    postsData: data.postsData,
                    commentsData: data.commentsData,
                    postVotesData: data.postVotesData,
                    usersData: data.usersData,
                    currentUserId: storedUserId,
                });

                const unread = hasUnreadNotifications(
                    storedUserId,
                    notificationsList
                );

                if (!cancelled) {
                    setHasUnread(unread);
                }
            } catch (error) {
                console.error('Failed to check unread notifications:', error);
            }
        };

        const handleNotificationsSeen = () => {
            setHasUnread(false);
        };

        checkUnreadNotifications();

        const intervalId = setInterval(
            checkUnreadNotifications,
            NOTIFICATION_CHECK_INTERVAL_MS
        );

        window.addEventListener(
            NOTIFICATIONS_SEEN_EVENT,
            handleNotificationsSeen
        );

        return () => {
            cancelled = true;
            clearInterval(intervalId);
            window.removeEventListener(
                NOTIFICATIONS_SEEN_EVENT,
                handleNotificationsSeen
            );
        };
    }, []);

    const markSeen = () => {
        markNotificationsAsSeen(getCurrentUserId());
        setHasUnread(false);
    };

    return {
        hasUnread,
        markSeen,
    };
}

export default useUnreadNotifications;
