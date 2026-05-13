import { useCallback, useEffect, useState } from 'react';
import {
    fetchFollowers,
    fetchFollowing,
    getToken,
    toggleFollow,
} from '../../../services';

function useProfileFollow({ currentUserId, user }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);
    const [followModalType, setFollowModalType] = useState(null);
    const [followUsers, setFollowUsers] = useState([]);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const loadFollowCounts = useCallback((userId, token) => {
        fetchFollowers(userId, token)
            .then(data => {
                const uniqueFollowersCount = Array.isArray(data)
                    ? new Set(data.map(item => item.id)).size
                    : 0;

                setFollowersCount(uniqueFollowersCount);

                if (Array.isArray(data)) {
                    const amIFollowing = data.some(
                        item => Number(item.id) === Number(currentUserId)
                    );

                    setIsFollowing(amIFollowing);
                }
            })
            .catch(() => setFollowersCount(0));

        fetchFollowing(userId, token)
            .then(data => {
                const uniqueFollowingCount = Array.isArray(data)
                    ? new Set(data.map(item => item.id)).size
                    : 0;

                setFollowingCount(uniqueFollowingCount);
            })
            .catch(() => setFollowingCount(0));
    }, [currentUserId]);

    useEffect(() => {
        if (!user) return;

        loadFollowCounts(user.id, getToken());
    }, [loadFollowCounts, user]);

    const openFollowModal = async type => {
        if (!user) return;

        setFollowModalType(type);
        setLoadingFollow(true);
        setFollowUsers([]);

        const token = getToken();

        try {
            const data = type === 'followers'
                ? await fetchFollowers(user.id, token)
                : await fetchFollowing(user.id, token);

            setFollowUsers(data);
        } catch (error) {
            console.error('Error fetching follow data:', error);
        } finally {
            setLoadingFollow(false);
        }
    };

    const handleToggleFollow = async () => {
        if (!user || isTogglingFollow) return;

        setIsTogglingFollow(true);

        const method = isFollowing ? 'DELETE' : 'POST';

        try {
            await toggleFollow({
                token: getToken(),
                currentUserId,
                targetUserId: user.id,
                isFollowing,
            });

            setIsFollowing(!isFollowing);
            setFollowersCount(prev =>
                method === 'DELETE' ? Math.max(0, prev - 1) : prev + 1
            );
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setIsTogglingFollow(false);
        }
    };

    return {
        followersCount,
        followingCount,
        followModalType,
        followUsers,
        isFollowing,
        loadingFollow,
        closeFollowModal: () => setFollowModalType(null),
        handleToggleFollow,
        openFollowModal,
    };
}

export default useProfileFollow;
