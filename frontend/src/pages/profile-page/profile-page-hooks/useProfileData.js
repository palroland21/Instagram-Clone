import { useEffect, useState } from 'react';
import {
    decodeJwtPayload,
    fetchProfilePosts,
    fetchUserByUsername,
    getCurrentUserId,
    getToken,
    isCypressTestUser,
} from '../../../services';
import { sortPostsNewestFirst } from '../profileUtils';

function useProfileData({ navigate, targetUsername }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUserId = getCurrentUserId();
    const currentUsername = decodeJwtPayload(getToken())?.sub;

    const isOwner = user && (
        Number(user.id) === Number(currentUserId) ||
        (!targetUsername && user.username === currentUsername)
    );

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            const token = getToken();

            if (!token) {
                navigate('/');
                return;
            }

            const payload = decodeJwtPayload(token);

            if (!payload) {
                navigate('/');
                return;
            }

            const usernameToLoad = targetUsername || payload.sub;

            try {
                let fullUser;

                try {
                    fullUser = await fetchUserByUsername(usernameToLoad, token);
                } catch {
                    navigate('/home');
                    return;
                }

                if (isCypressTestUser(fullUser)) {
                    navigate('/home');
                    return;
                }

                if (cancelled) return;

                const userPostsData = await fetchProfilePosts({
                    token,
                    userId: fullUser.id,
                    currentUserId,
                });

                if (cancelled) return;

                const userPosts = userPostsData.filter(
                    post => Number(post.userId) === Number(fullUser.id)
                );

                setUser(fullUser);
                setPosts(sortPostsNewestFirst(userPosts));
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [currentUserId, navigate, targetUsername]);

    const addCreatedPost = newPost => {
        if (newPost) {
            setPosts(prevPosts => [newPost, ...prevPosts]);
        }
    };

    return {
        currentUserId,
        isOwner,
        loading,
        posts,
        setUser,
        user,
        addCreatedPost,
    };
}

export default useProfileData;
