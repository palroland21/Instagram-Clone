describe('Main navigation', () => {
    beforeEach(() => {
        cy.createRealUser('e2e_nav').then((user) => {
            cy.loginByApi(user);
        });
    });

    it('navigates between main pages', () => {
        cy.visit('/home');

        cy.get('[data-cy="nav-home"]').click();
        cy.url().should('include', '/home');

        cy.get('[data-cy="nav-search"]').click();
        cy.url().should('include', '/search');

        cy.get('[data-cy="nav-notifications"]').click();
        cy.url().should('include', '/notifications');

        cy.get('[data-cy="nav-profile"]').click();
        cy.url().should('include', '/profile');
    });
});
