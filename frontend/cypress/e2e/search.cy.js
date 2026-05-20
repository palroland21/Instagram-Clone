describe('Search', () => {
    let user;
    let uniqueTag;
    let seededPost;

    beforeEach(() => {
        uniqueTag = `search-${Date.now()}`;

        cy.createRealUser('e2e_search').then((createdUser) => {
            user = createdUser;

            cy.createPostViaApi(user, {
                caption: `Cypress searchable post ${uniqueTag}`,
                title: `Searchable ${uniqueTag}`,
                tagNames: [uniqueTag],
            }).then((post) => {
                seededPost = post;
                cy.intercept('GET', `${Cypress.env('apiUrl')}/posts*`).as('loadPosts');
                cy.loginByApi(user, '/search');
            });
        });
    });

    it('filters posts by text or tag from real backend data', () => {
        cy.wait('@loadPosts');
        cy.contains('Loading posts...', { timeout: 30000 }).should('not.exist');
        cy.get('input[placeholder="Search by title, username or tag..."]').type(uniqueTag);

        cy.contains(seededPost.caption, { timeout: 30000 }).should('be.visible');

        cy.get('input[placeholder="Search by title, username or tag..."]').clear().type('no-results-for-this-query');
        cy.contains('No posts found for the selected filters.').should('be.visible');
    });
});
