import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../services';
import {
    buildDesktopNavItems,
    buildMobileNavItems,
} from './sidebar/sidebarItems';
import DesktopSidebar from './sidebar/DesktopSidebar';
import MobileSidebar from './sidebar/MobileSidebar';
import useSidebarUser from './sidebar/useSidebarUser';
import useUnreadNotifications from './sidebar/useUnreadNotifications';

function Sidebar({ activeItem, setActiveItem, isMobile, onPostCreated }) {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const currentUser = useSidebarUser();
    const { hasUnread, markSeen } = useUnreadNotifications();

    const avatarSrc =
        currentUser?.profilePicture ||
        `https://i.pravatar.cc/150?u=${currentUser?.id || 'me'}`;

    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleItemClick = item => {
        if (item.action) {
            item.action();
            return;
        }

        setActiveItem(item.id);

        if (item.id === 'notifications') {
            markSeen();
        }

        if (item.path) {
            navigate(item.path);
        }
    };

    const handleLogout = () => {
        clearAuthSession();
        navigate('/');
    };

    const sharedProps = {
        activeItem,
        hasUnread,
        onCloseCreateModal: closeCreateModal,
        onItemClick: handleItemClick,
        onPostCreated,
        showCreateModal,
    };

    if (isMobile) {
        return (
            <MobileSidebar
                {...sharedProps}
                items={buildMobileNavItems({
                    activeItem,
                    avatarSrc,
                    onCreate: openCreateModal,
                })}
            />
        );
    }

    return (
        <DesktopSidebar
            {...sharedProps}
            items={buildDesktopNavItems({
                activeItem,
                avatarSrc,
                onCreate: openCreateModal,
            })}
            onLogout={handleLogout}
        />
    );
}

export default Sidebar;
