const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const INTERNAL_ADMIN_SECRET =
    import.meta.env.VITE_INTERNAL_ADMIN_SECRET;

async function adminRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-INTERNAL-SECRET": INTERNAL_ADMIN_SECRET,
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

    deletePost(postId) {
        return adminRequest(`/internal/admin/posts/${postId}`, {
            method: "DELETE",
        });
    },

    deleteComment(commentId) {
        return adminRequest(`/internal/admin/comments/${commentId}`, {
            method: "DELETE",
        });
    },

    editPost(postId, data) {
        return adminRequest(`/internal/admin/posts/${postId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    editComment(commentId, data) {
        return adminRequest(`/internal/admin/comments/${commentId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },
};