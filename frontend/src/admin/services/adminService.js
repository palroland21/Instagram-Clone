import { getToken } from "../../services/apiClient";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

const INTERNAL_ADMIN_SECRET =
    import.meta.env.VITE_INTERNAL_ADMIN_SECRET || "admin-service-secret-123";

async function parseAdminResponse(response) {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(data) {
    if (typeof data === "string" && data) {
        return data;
    }

    return data?.message || data?.error || "Request failed";
}

async function adminRequest(path, options = {}) {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "X-INTERNAL-SECRET": INTERNAL_ADMIN_SECRET,
            ...options.headers,
        },
    });

    const data = await parseAdminResponse(response);

    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }

    return data;
}

async function publicRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        let errorMessage = "Request failed";

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            errorMessage = await response.text();
        }

        throw new Error(errorMessage || "Request failed");
    }

    const contentType = response.headers.get("content-type");

    if (response.status === 204) {
        return null;
    }

    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return response.text();
}

export const adminService = {
    getUsers() {
        return adminRequest("/internal/admin/users");
    },

    banUser(userId) {
        return adminRequest(`/internal/admin/users/${userId}/ban`, {
            method: "PUT",
        });
    },

    unbanUser(userId) {
        return adminRequest(`/internal/admin/users/${userId}/unban`, {
            method: "PUT",
        });
    },

    getPosts() {
        return publicRequest("/posts");
    },

    getModerationPosts() {
        return publicRequest("/posts?page=0&size=20&excludeTestData=true");
    },

    deletePost(postId) {
        return adminRequest(`/internal/admin/posts/${postId}`, {
            method: "DELETE",
        });
    },

    editPost(postId, data) {
        return adminRequest(`/internal/admin/posts/${postId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    deleteComment(commentId) {
        return adminRequest(`/internal/admin/comments/${commentId}`, {
            method: "DELETE",
        });
    },

    editComment(commentId, data) {
        return adminRequest(`/internal/admin/comments/${commentId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },
    getComments() {
        return publicRequest("/comments");
    },

    getModerationComments() {
        return publicRequest("/comments?page=0&size=20&excludeTestData=true");
    },
};
