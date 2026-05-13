import { useEffect, useState } from 'react';
import {
    fetchCurrentUser,
    getCurrentUserId,
    getToken,
} from '../../services';

function useSidebarUser() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = getToken();
        const storedUserId = getCurrentUserId();

        if (!token) return;

        const loadCurrentUser = async () => {
            try {
                const me = await fetchCurrentUser({ token, storedUserId });
                setCurrentUser(me || null);
            } catch (error) {
                console.error('Failed to load current user:', error);
                setCurrentUser(null);
            }
        };

        loadCurrentUser();
    }, []);

    return currentUser;
}

export default useSidebarUser;
