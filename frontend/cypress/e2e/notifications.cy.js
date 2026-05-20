describe('Notifications', () => {
    it('shows real comment and like notifications for the post owner', () => {
        cy.createRealUser('e2e_notification_owner').then((owner) => {
            cy.createRealUser('e2e_notification_actor').then((actor) => {
                const commentText = `Notification comment ${Date.now()}`;

                cy.createPostViaApi(owner, {
                    title: `Notification post ${Date.now()}`,
                    caption: 'Post that receives notifications',
                    tagNames: ['notifications-e2e'],
                }).then((post) => {
                    cy.createCommentViaApi(actor, post, commentText);
                    cy.togglePostVoteViaApi(actor, post, 'LIKE');

                    cy.intercept('GET', `${Cypress.env('apiUrl')}/posts*`).as('loadPosts');
                    cy.intercept('GET', `${Cypress.env('apiUrl')}/comments*`).as('loadComments');
                    cy.intercept('GET', `${Cypress.env('apiUrl')}/post-votes*`).as('loadVotes');

                    cy.loginByApi(owner, '/notifications');
                    cy.wait('@loadPosts');
                    cy.wait('@loadComments');
                    cy.wait('@loadVotes');

                    cy.contains(actor.username, { timeout: 30000 }).should('be.visible');
                    cy.contains('commented on your post').should('be.visible');
                    cy.contains(commentText).should('be.visible');
                    cy.contains('liked your post').should('be.visible');
                });
            });
        });
    });
});
