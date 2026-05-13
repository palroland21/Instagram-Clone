import { useEffect, useState } from 'react';
import {
    decodeJwtPayload,
    fetchPosts,
    fetchUserById,
    fetchUsers,
    getCurrentUserId,
    getToken,
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
                const [users, allPosts] = await Promise.all([
                    fetchUsers(token),
                    fetchPosts({ token }),
                ]);

                const basicUser = users.find(
                    item => item.username === usernameToLoad
                );

                if (!basicUser) {
                    navigate('/home');
                    return;
                }

                let fullUser = basicUser;

                try {
                    const userDetails = await fetchUserById(basicUser.id, token);
                    fullUser = {
                        ...basicUser,
                        ...userDetails,
                    };
                } catch {
                    fullUser = basicUser;
                }

                if (cancelled) return;

                const userPosts = allPosts.filter(
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
    }, [navigate, targetUsername]);

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
