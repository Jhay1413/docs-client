

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

    it('should access transaction table', () => {
      cy.visit('http://localhost:5173/dashboard/transactions/list');
      cy.get('[data-cy="trans-table"]').should('be.visible');
    })
  
    // it('should access transactions table', () => {
    //   cy.get('th:contains("Company Name")').should('be.visible');
    //   cy.get('th:contains("Project Name")').should('be.visible');
    //   cy.get('th:contains("Type")').should('be.visible');
    //   cy.get('th:contains("Subtype")').should('be.visible');
    //   cy.get('th:contains("Subject")').should('be.visible');
    //   cy.get('th:contains("Forwarder")').should('be.visible');
    //   cy.get('th:contains("Receiver")').scrollIntoView().should('be.visible');
    //   cy.get('th:contains("Status")').should('be.visible');
    //   cy.get('th:contains("Priority")').should('be.visible');
    //   cy.get('th:contains("Percentage")').should('be.visible');
    // });
 });