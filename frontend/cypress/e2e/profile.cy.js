describe('Profile', () => {
    let viewer;
    let target;
    let seededPost;

    beforeEach(() => {
        cy.createRealUser('e2e_profile_viewer').then((createdViewer) => {
            viewer = createdViewer;

            cy.createRealUser('e2e_profile_target').then((createdTarget) => {
                target = createdTarget;

                return cy.createPostViaApi(target, {
                    caption: `Profile post for ${target.username}`,
                    title: `Profile grid post ${target.username}`,
                    tagNames: ['profile-e2e'],
                }).then((post) => {
                    seededPost = post;
                    cy.intercept('GET', `${Cypress.env('apiUrl')}/posts*`).as('loadPosts');
                    return cy.loginByApi(viewer, `/profile/${target.username}`);
                });
            });
        });
    });

    it('shows another user profile and can follow them', () => {
        cy.wait('@loadPosts');
        cy.contains(target.username, { timeout: 30000 }).should('be.visible');
        cy.get(`img[alt="${seededPost.title}"]`, { timeout: 30000 }).should('be.visible');

        cy.contains('button', /^follow$/i).click();
        cy.contains('button', /^following$/i).should('be.visible');
        cy.contains('followers').parent().contains('1').should('exist');
    });
});
