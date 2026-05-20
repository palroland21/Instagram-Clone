describe('Post API contract', () => {
    it('allows an owner to update and delete their post through the real backend', () => {
        cy.createRealUser('e2e_post_contract').then((user) => {
            cy.createPostViaApi(user).then((post) => {
                const updatedCaption = `Updated post caption ${Date.now()}`;
                const updatedTitle = `Updated post title ${Date.now()}`;

                cy.updatePostViaApi(user, post, {
                    caption: updatedCaption,
                    title: updatedTitle,
                    tagNames: ['updated-contract'],
                }).then((updatedPost) => {
                    expect(updatedPost.caption).to.eq(updatedCaption);
                    expect(updatedPost.title).to.eq(updatedTitle);

                    cy.request({
                        method: 'GET',
                        url: `${Cypress.env('apiUrl')}/posts/${post.id}`,
                        qs: { currentUserId: user.userId },
                        headers: { Authorization: `Bearer ${user.token}` },
                    }).then((getResponse) => {
                        expect(getResponse.body.caption).to.eq(updatedCaption);
                    });
                });

                cy.deletePostViaApi(user, post);

                cy.request({
                    method: 'GET',
                    url: `${Cypress.env('apiUrl')}/posts/${post.id}`,
                    qs: { currentUserId: user.userId },
                    headers: { Authorization: `Bearer ${user.token}` },
                    failOnStatusCode: false,
                }).its('status').should('be.oneOf', [400, 403, 404, 500]);
            });
        });
    });
});
