describe("Affichage des détails d'un utilisateur", () => {
    const adminEmail = Cypress.env('TEST_ADMIN_EMAIL');
    const adminPassword = Cypress.env('TEST_ADMIN_PASSWORD');

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it("n'affiche pas les détails si l'utilisateur n'est pas connecté", () => {
        cy.contains('Liste des inscrits').should('be.visible');

        cy.get('ul > li').first().click();
        cy.contains("Détails de l'utilisateur").should('not.exist');
    });

    it("affiche les détails si l'utilisateur est connecté", () => {
        cy.get('[data-testid="login-form"]').within(() => {
            cy.get('input#email').type(adminEmail);
            cy.get('input#password').type(adminPassword);
            cy.get('button[type="submit"]').contains('Login').click();
        });

        cy.contains('Logged in as').should('be.visible');
        cy.contains('Liste des inscrits').should('be.visible');

        cy.get('ul > li').first().click();
        cy.contains("Détails de l'utilisateur").should('be.visible');
    });
});
