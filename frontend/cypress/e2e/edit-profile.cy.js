describe('Edit profile', () => {
    it('updates profile details through the real backend and can log in afterwards', () => {
        cy.createRealUser('e2e_edit_profile').then((user) => {
            const nextFullName = `Updated Cypress User ${Date.now()}`;
            const nextBio = `Bio updated by Cypress ${Date.now()}`;
            const nextUsername = `${user.username}_updated`;

            cy.request({
                method: 'PUT',
                url: `${Cypress.env('apiUrl')}/users/${user.userId}`,
                headers: { Authorization: `Bearer ${user.token}` },
                body: {
                    username: nextUsername,
                    email: user.email,
                    fullName: nextFullName,
                    bio: nextBio,
                    profilePicture: user.profilePicture,
                    phoneNumber: '+40712345678',
                },
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 201]);
                expect(response.body.username).to.eq(nextUsername);
                expect(response.body.fullName).to.eq(nextFullName);
                expect(response.body.bio).to.eq(nextBio);
            });

            cy.request({
                method: 'POST',
                url: `${Cypress.env('apiUrl')}/auth/login`,
                body: {
                    username: nextUsername,
                    password: user.password,
                },
            }).its('body.username').should('eq', nextUsername);
        });
    });
});
