/// <reference types="cypress" />

describe('Admin panel', () => {
    beforeEach(function () {
        const adminUsername = Cypress.env('adminUsername');
        const adminPassword = Cypress.env('adminPassword');

        if (!adminUsername || !adminPassword) {
            this.skip();
        }

        cy.loginByApi({
            username: adminUsername,
            password: adminPassword,
        }, '/admin');
    });

    it('loads the admin dashboard', () => {
        cy.visit('/admin');

        cy.contains(/dashboard|admin|overview/i).should('be.visible');
    });

    it('loads users page', () => {
        cy.visit('/admin/users');

        cy.get('[data-cy="admin-user-row"]').should('have.length.greaterThan', 0);
    });

    it('loads posts moderation page', () => {
        cy.visit('/admin/posts');

        cy.contains(/posts|postari/i).should('be.visible');
        cy.get('[data-cy="admin-post-row"]').should('exist');
    });

    it('loads comments moderation page', () => {
        cy.visit('/admin/comments');

        cy.contains(/comments|comentarii/i).should('be.visible');
        cy.get('[data-cy="admin-comment-row"]').should('exist');
    });
});
