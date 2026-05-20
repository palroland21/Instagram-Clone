describe('Authentication', () => {
    it('allows a user to register and log in', () => {
        cy.buildTestUser('e2e_auth').then((user) => {
            cy.visit('/');

            cy.contains('button', /^register$/i).click();
            cy.get('[data-cy="register-username"]').type(user.username);
            cy.get('[data-cy="register-email"]').type(user.email);
            cy.get('[data-cy="register-password"]').type(user.password);
            cy.get('[data-cy="register-confirm-password"]').type(user.password);
            cy.get('[data-cy="register-full-name"]').type(user.fullName);
            cy.get('[data-cy="register-phone"]').type(user.phoneNumber);
            cy.get('[data-cy="register-bio"]').type(user.bio);
            cy.get('[data-cy="register-submit"]').click();

            cy.url().should('include', '/home');
            cy.window().its('localStorage.token').should('exist');

            cy.visit('/');
            cy.get('[data-cy="login-username"]').type(user.username);
            cy.get('[data-cy="login-password"]').type(user.password);
            cy.get('[data-cy="login-submit"]').click();

            cy.url().should('include', '/home');
            cy.window().its('localStorage.token').should('exist');
        });
    });

    it('shows an error for invalid credentials', () => {
        cy.visit('/');

        cy.get('[data-cy="login-username"]').type(`missing_${Date.now()}`);
        cy.get('[data-cy="login-password"]').type('wrongpassword');
        cy.get('[data-cy="login-submit"]').click();

        cy.contains(/invalid|error|wrong|failed|gresit|username/i).should('be.visible');
    });
});
