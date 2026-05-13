import {
    HeartIcon,
    HomeIcon,
    MessagesIcon,
    PlusIcon,
    SearchIcon,
} from '../Icons';

function renderProfileAvatar({ activeItem, avatarSrc, mobile = false }) {
    return (
        <img
            src={avatarSrc}
            alt="profile"
            style={{
                width: mobile ? 26 : 24,
                height: mobile ? 26 : 24,
                borderRadius: '50%',
                objectFit: 'cover',
                border: mobile && activeItem === 'profile'
                    ? '2px solid white'
                    : mobile ? '2px solid transparent' : undefined,
            }}
        />
    );
}

export function buildDesktopNavItems({ activeItem, avatarSrc, onCreate }) {
    return [
        {
            id: 'home',
            label: 'Home',
            path: '/home',
            icon: <HomeIcon filled={activeItem === 'home'} />,
        },
        {
            id: 'search',
            label: 'Search',
            path: '/search',
            icon: <SearchIcon />,
        },
        {
            id: 'messages',
            label: 'Messages',
            icon: <MessagesIcon />,
        },
        {
            id: 'notifications',
            label: 'Notifications',
            path: '/notifications',
            icon: <HeartIcon />,
        },
        {
            id: 'create',
            label: 'Create',
            icon: <PlusIcon />,
            action: onCreate,
        },
        {
            id: 'profile',
            label: 'Profile',
            path: '/profile',
            icon: renderProfileAvatar({ avatarSrc }),
        },
    ];
}

export function buildMobileNavItems({ activeItem, avatarSrc, onCreate }) {
    return [
        {
            id: 'home',
            path: '/home',
            icon: <HomeIcon filled={activeItem === 'home'} />,
        },
        {
            id: 'search',
            path: '/search',
            icon: <SearchIcon />,
        },
        {
            id: 'create',
            icon: <PlusIcon />,
            action: onCreate,
        },
        {
            id: 'notifications',
            path: '/notifications',
            icon: <HeartIcon filled={false} />,
        },
        {
            id: 'profile',
            path: '/profile',
            icon: renderProfileAvatar({ activeItem, avatarSrc, mobile: true }),
        },
    ];
}
