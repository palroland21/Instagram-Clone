import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/adminService";

function normalizePostsResponse(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    if (Array.isArray(data?.posts)) {
        return data.posts;
    }

    return [];
}

export function useAdminPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getPosts();
            const normalizedPosts = normalizePostsResponse(data);

            setPosts(normalizedPosts);
        } catch (err) {
            setError(err.message || "Could not load posts.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    return {
        posts,
        loading,
        error,
        reloadPosts: loadPosts,
    };
}