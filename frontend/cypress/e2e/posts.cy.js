describe('Posts', () => {
    let viewer;
    let author;
    let seededPost;

    beforeEach(() => {
        cy.createRealUser('e2e_viewer').then((createdViewer) => {
            viewer = createdViewer;

            cy.createRealUser('e2e_author').then((createdAuthor) => {
                author = createdAuthor;
                cy.createPostViaApi(author).then((post) => {
                    seededPost = post;
                    cy.intercept('GET', `${Cypress.env('apiUrl')}/posts*`).as('loadPosts');
                    cy.loginByApi(viewer);
                });
            });
        });
    });

    it('shows the feed for a logged in user', () => {
        cy.wait('@loadPosts');
        cy.contains(seededPost.caption, { timeout: 30000 }).should('be.visible');
        cy.get('[data-cy="post-card"]').should('have.length.greaterThan', 0);
    });

    it('allows a logged in user to like a post', () => {
        cy.wait('@loadPosts');
        cy.contains(seededPost.caption, { timeout: 30000 }).should('be.visible');
        cy.get('[data-cy="post-card"]').first().within(() => {
            cy.get('[data-cy="like-button"]').click();
        });

        cy.contains(/1/).should('exist');
    });

    it('allows a logged in user to comment on a post', () => {
        const comment = `Cypress comment ${Date.now()}`;

        cy.intercept('POST', `${Cypress.env('apiUrl')}/comments`).as('createComment');
        cy.wait('@loadPosts');
        cy.contains(seededPost.caption, { timeout: 30000 }).should('be.visible');
        cy.get('[data-cy="post-card"]').first().within(() => {
            cy.get('[data-cy="comment-button"]').click();
            cy.get('[data-cy="comment-input"]').type(comment);
            cy.get('[data-cy="comment-submit"]').click();
        });

        cy.wait('@createComment');
        cy.contains(comment).should('be.visible');
    });
});
