// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
beforeEach(() => {
    cy.session('user-session', () => {
      cy.visit('http://localhost:5173/');
      cy.get('input[name="email"]').type('records@envicomm.org');
      cy.get('input[name="password"]').type('records');
      cy.get('button[type="submit"]').click();
    });
  });


// Alternatively you can use CommonJS syntax:
// require('./commands')