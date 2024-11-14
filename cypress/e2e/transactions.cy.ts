

describe('Transactions Test', () => {
    const email = 'records@envicomm.org';
    const password = 'records';

    beforeEach(() => {
      cy.visit('http://localhost:5173/');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should access transaction table header', () => {
      cy.visit('http://localhost:5173/dashboard/transactions/list');
      cy.get('h1.trans-header').should('be.visible').and('contain', 'List of Transactions');
    });

    it('should access transaction table search', () => {
      cy.visit('http://localhost:5173/dashboard/transactions/list');
      cy.get('[data-cy="trans-search"]').should('be.visible');
    });

    it('should access transaction table columns', () => {
      cy.visit('http://localhost:5173/dashboard/transactions/list');
      cy.get('th:contains("Transaction ID")').should('be.visible');
      cy.get('th:contains("Company Name")').should('be.visible');
      cy.get('th:contains("Project Name")').should('be.visible');
      cy.get('th:contains("Type")').should('be.visible');
      cy.get('th:contains("Subtype")').should('be.visible');
      cy.get('th:contains("Subject")').should('be.visible');
      cy.get('th:contains("Forwarder")').should('be.visible');
      cy.get('th:contains("Receiver")').scrollIntoView().should('be.visible');
      cy.get('th:contains("Status")').should('be.visible');
      cy.get('th:contains("Priority")').should('be.visible');
      cy.get('th:contains("Percentage")').should('be.visible');
    });

    it('should access transaction table data', () => {
      cy.visit('http://localhost:5173/dashboard/transactions/list');
      cy.get('td:contains("Transaction ID")').should('be.visible');
      cy.get('td:contains("Company Name")').should('be.visible');
      cy.get('td:contains("Project Name")').should('be.visible');
      cy.get('td:contains("Type")').should('be.visible');
      cy.get('td:contains("Subtype")').should('be.visible');
      cy.get('td:contains("Subject")').should('be.visible');
      cy.get('td:contains("Forwarder")').should('be.visible');
      cy.get('td:contains("Receiver")').scrollIntoView().should('be.visible');
      cy.get('td:contains("Status")').should('be.visible');
      cy.get('td:contains("Priority")').should('be.visible');
      cy.get('td:contains("Percentage")').should('be.visible');
    });
 });