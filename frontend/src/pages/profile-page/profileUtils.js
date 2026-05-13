export const cleanPhoneNumber = value => {
    return String(value || '').replace(/\D/g, '');
};

export const getFirstValidPhoneNumber = (...values) => {
    for (const value of values) {
        const digits = cleanPhoneNumber(value);

        if (digits.length >= 10 && digits.length <= 15) {
            return digits;
        }
    }

    return '';
};

export const getPhoneNumberFromUserObject = userObject => {
    return getFirstValidPhoneNumber(
        userObject?.phoneNumber,
        userObject?.phone,
        userObject?.telephone,
        userObject?.mobile
    );
};

export const getPostImages = post => {
    if (Array.isArray(post.pictureUrls) && post.pictureUrls.length > 0) {
        return post.pictureUrls;
    }

    if (post.pictureUrl) return [post.pictureUrl];
    if (post.picture) return [post.picture];
    if (post.imageUrl) return [post.imageUrl];
    if (post.image) return [post.image];

    return [];
};

export const sortPostsNewestFirst = posts => {
    return [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
};
