import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/adminService";

function normalizeArray(data, key) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    if (Array.isArray(data?.[key])) {
        return data[key];
    }

    return [];
}

function isUserBanned(user) {
    return Boolean(user.banned ?? user.isBanned);
}

export function useAdminStats() {
    const [stats, setStats] = useState({
        usersCount: 0,
        bannedUsersCount: 0,
        postsCount: 0,
        commentsCount: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStats = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [usersData, postsData, commentsData] = await Promise.all([
                adminService.getUsers(),
                adminService.getPosts(),
                adminService.getComments(),
            ]);

            const users = normalizeArray(usersData, "users");
            const posts = normalizeArray(postsData, "posts");
            const comments = normalizeArray(commentsData, "comments");

            setStats({
                usersCount: users.length,
                bannedUsersCount: users.filter(isUserBanned).length,
                postsCount: posts.length,
                commentsCount: comments.length,
            });
        } catch (err) {
            setError(err.message || "Could not load dashboard stats.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return {
        stats,
        loading,
        error,
        reloadStats: loadStats,
    };
}