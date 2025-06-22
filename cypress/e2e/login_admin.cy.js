describe('Connexion administrateur', () => {
    const adminEmail = Cypress.env('TEST_ADMIN_EMAIL');
    const adminPassword = Cypress.env('TEST_ADMIN_PASSWORD');

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('doit permettre à un admin de se connecter et d’afficher son email', () => {
        cy.get('[data-testid="login-form"]').within(() => {
            cy.get('input#email').type(adminEmail);
            cy.get('input#password').type(adminPassword);
            cy.get('button[type="submit"]').contains('Login').click();
        });

        cy.contains(`Logged in as ${adminEmail}`).should('be.visible');
    });

    it('affiche un message d’erreur si les identifiants sont incorrects', () => {
        cy.get('[data-testid="login-form"]').within(() => {
            cy.get('input#email').type('admin@test.com');
            cy.get('input#password').type('admin123');
            cy.get('button[type="submit"]').contains('Login').click();
        });

        cy.contains('Email or password is incorrect.').should('be.visible');
    });
});
