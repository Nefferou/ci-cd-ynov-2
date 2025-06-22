describe("Gestion des suppressions d'utilisateurs", () => {
    const adminEmail = Cypress.env('TEST_ADMIN_EMAIL');
    const adminPassword = Cypress.env('TEST_ADMIN_PASSWORD');

    const testUser = {
        name: "Temp",
        surname: "Userdelete",
        email: "temp.user@example.com",
        birthdate: "2000-01-01",
        city: "Testville",
        postal_code: "12345"
    };

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it("ne montre pas les boutons de suppression si l'utilisateur n'est pas connecté", () => {
        cy.contains('Formulaire de Login').should('exist');

        cy.contains('Liste des inscrits').should('exist');
        cy.get('ul li').should('have.length.greaterThan', 0);

        cy.get('button').contains('Supprimer').should('not.exist');
    });

    it("permet à un administrateur connecté de supprimer un utilisateur", () => {
        cy.get('[data-testid="login-form"]').within(() => {
            cy.get('input#email').type(adminEmail);
            cy.get('input#password').type(adminPassword);
            cy.get('button[type="submit"]').contains('Login').click();
        });

        cy.contains(`Logged in as ${adminEmail}`).should('exist');

        cy.get('[data-testid="registration-form"]').within(() => {
            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="surname"]').type(testUser.surname);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="birthdate"]').type(testUser.birthdate);
            cy.get('input[name="city"]').type(testUser.city);
            cy.get('input[name="postal_code"]').type(testUser.postal_code);
            cy.get('button[type="submit"]').contains('Sauvegarder').click();
        });

        cy.wait(500);

        cy.contains(`${testUser.name} ${testUser.surname} - ${testUser.email}`).should('exist');

        cy.contains('li', `${testUser.name} ${testUser.surname} - ${testUser.email}`)
            .within(() => {
                cy.contains('Supprimer').click();
            });

        cy.contains(`${testUser.name} ${testUser.surname} - ${testUser.email}`).should('not.exist');
    });
});
