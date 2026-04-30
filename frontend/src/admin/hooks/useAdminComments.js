import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/adminService";

function normalizeCommentsResponse(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    if (Array.isArray(data?.comments)) {
        return data.comments;
    }

    return [];
}

export function useAdminComments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadComments = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getComments();
            const normalizedComments = normalizeCommentsResponse(data);

            setComments(normalizedComments);
        } catch (err) {
            setError(err.message || "Could not load comments.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    return {
        comments,
        loading,
        error,
        reloadComments: loadComments,
    };
}