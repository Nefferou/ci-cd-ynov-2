describe('Formulaire d\'inscription', () => {
    const user = {
        name: 'John',
        surname: 'Doe',
        email: `john.doe.${Date.now()}@example.com`,
        birthdate: '1990-01-01',
        city: 'Paris',
        postal_code: '75000'
    };

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('remplit le formulaire, soumet, voit le message de succès, et trouve le nouvel utilisateur', () => {
        cy.get('input[name="name"]').type(user.name);
        cy.get('input[name="surname"]').type(user.surname);
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="birthdate"]').type(user.birthdate);
        cy.get('input[name="city"]').type(user.city);
        cy.get('input[name="postal_code"]').type(user.postal_code);

        cy.get('button[type="submit"]').should('not.be.disabled');

        cy.contains('button', 'Sauvegarder').click();

        cy.contains('Registration successful!').should('be.visible');

        cy.contains(`${user.name} ${user.surname} - ${user.email}`).should('exist');
    });

    after(() => {
        const adminEmail = Cypress.env('TEST_ADMIN_EMAIL');
        const adminPassword = Cypress.env('TEST_ADMIN_PASSWORD');

        cy.visit('http://localhost:3000');

        cy.get('[data-testid="login-form"]').within(() => {
            cy.get('input#email').type(adminEmail);
            cy.get('input#password').type(adminPassword);
            cy.get('button[type="submit"]').contains('Login').click();
        });

        cy.contains(`Logged in as ${adminEmail}`).should('exist');

        cy.contains('li', `${user.name} ${user.surname} - ${user.email}`)
            .within(() => {
                cy.contains('Supprimer').click();
            });

        cy.contains(`${user.name} ${user.surname} - ${user.email}`).should('not.exist');
    });
});

describe('Formulaire d\'inscription - validation', () => {
    it('affiche les messages d\'erreur et le Toastr si des champs sont invalides', () => {
        cy.visit('http://localhost:3000');

        cy.get('input[name="name"]').type('1234');
        cy.get('input[name="surname"]').type('123');
        cy.get('input[name="email"]').type('email-invalide');
        cy.get('input[name="birthdate"]').type('2020-01-01');
        cy.get('input[name="city"]').type('$$$');
        cy.get('input[name="postal_code"]').type('abcde');

        cy.contains('button', 'Sauvegarder').click();

        cy.contains('Nom invalide.').should('be.visible');
        cy.contains('Prénom invalide.').should('be.visible');
        cy.contains('Email invalide.').should('be.visible');
        cy.contains('Vous devez avoir au moins 18 ans.').should('be.visible');
        cy.contains('Ville invalide.').should('be.visible');
        cy.contains('Code postal invalide.').should('be.visible');

        cy.contains('Formulaire invalide. Veuillez corriger les erreurs.').should('be.visible');

        cy.contains('1234').should('not.exist');
    });
});
