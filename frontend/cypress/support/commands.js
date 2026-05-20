const pixel =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function apiUrl() {
    return Cypress.env('apiUrl');
}

function uniqueSuffix() {
    return `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function assertOk(response, action) {
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`${action} failed with ${response.status}: ${JSON.stringify(response.body)}`);
    }
}

Cypress.Commands.add('buildTestUser', (prefix = 'e2e_user') => {
    const suffix = uniqueSuffix();

    return cy.wrap({
        username: `${prefix}_${suffix}`,
        email: `${prefix}_${suffix}@example.com`,
        password: 'Password123!',
        fullName: `Cypress ${prefix}`,
        phoneNumber: `07${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        bio: `Created by Cypress ${suffix}`,
        profilePicture: pixel,
    });
});

Cypress.Commands.add('registerRealUser', (user) => {
    return cy.request({
        method: 'POST',
        url: `${apiUrl()}/auth/register`,
        body: user,
        failOnStatusCode: false,
    }).then((response) => {
        assertOk(response, 'registerRealUser');

        return {
            ...user,
            token: response.body.token,
            userId: response.body.userId,
            role: response.body.role,
        };
    });
});

Cypress.Commands.add('createRealUser', (prefix = 'e2e_user') => {
    return cy.buildTestUser(prefix).then((user) => cy.registerRealUser(user));
});

Cypress.Commands.add('loginByApi', (user, path = '/home') => {
    return cy.request({
        method: 'POST',
        url: `${apiUrl()}/auth/login`,
        body: {
            username: user.username,
            password: user.password,
        },
        failOnStatusCode: false,
    }).then((response) => {
        assertOk(response, 'loginByApi');

        const session = {
            ...user,
            token: response.body.token,
            userId: response.body.userId,
            username: response.body.username,
            role: response.body.role,
        };

        return cy.visit(path, {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', session.token);
                win.localStorage.setItem('userId', String(session.userId));
                win.localStorage.setItem('username', session.username);
                win.localStorage.setItem('role', session.role || 'USER');

                if (session.phoneNumber) {
                    win.localStorage.setItem('phoneNumber', session.phoneNumber);
                }
            },
        }).then(() => session);
    });
});

Cypress.Commands.add('createPostViaApi', (user, overrides = {}) => {
    const suffix = uniqueSuffix();
    const body = {
        userId: user.userId,
        pictureUrls: [pixel],
        location: 'Cluj-Napoca',
        caption: `Cypress real backend post ${suffix}`,
        title: `Cypress post ${suffix}`,
        tagNames: [`cypress-${suffix}`],
        ...overrides,
    };

    return cy.request({
        method: 'POST',
        url: `${apiUrl()}/posts`,
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        body,
        failOnStatusCode: false,
    }).then((response) => {
        assertOk(response, 'createPostViaApi');
        return response.body;
    });
});

Cypress.Commands.add('createCommentViaApi', (user, post, text = `Cypress comment ${uniqueSuffix()}`) => {
    return cy.request({
        method: 'POST',
        url: `${apiUrl()}/comments`,
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        body: {
            userId: user.userId,
            postId: post.id,
            text,
        },
        failOnStatusCode: false,
    }).then((response) => {
        assertOk(response, 'createCommentViaApi');
        return response.body;
    });
});

Cypress.Commands.add('togglePostVoteViaApi', (user, post, voteType = 'LIKE') => {
    return cy.request({
        method: 'POST',
        url: `${apiUrl()}/post-votes/toggle`,
        qs: {
            userId: user.userId,
            postId: post.id,
            voteType,
        },
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        failOnStatusCode: false,
    }).then((response) => {
        assertOk(response, 'togglePostVoteViaApi');
        return response.body;
    });
});

Cypress.Commands.add('updatePostViaApi', (user, post, overrides = {}) => {
    const body = {
        userId: user.userId,
        pictureUrls: post.pictureUrls?.length ? post.pictureUrls : [pixel],
        location: post.location || 'Cluj-Napoca',
        caption: post.caption,
        title: post.title,
        tagNames: post.tagNames?.length ? post.tagNames : ['cypress'],
        ...overrides,
    };

    return cy.request({
        method: 'PUT',
        url: `${apiUrl()}/posts/${post.id}`,
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        body,
        failOnStatusCode: false,
    }).then((response) => {
        assertOk(response, 'updatePostViaApi');
        return response.body;
    });
});

Cypress.Commands.add('deletePostViaApi', (user, post) => {
    return cy.request({
        method: 'DELETE',
        url: `${apiUrl()}/posts/${post.id}`,
        qs: {
            userId: user.userId,
        },
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        failOnStatusCode: false,
    }).then((response) => {
        assertOk(response, 'deletePostViaApi');
        return response.body;
    });
});
