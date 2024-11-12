

describe('Transactions Test', () => {
    const email = 'records@envicomm.org';
    const password = 'records';

    beforeEach(() => {
        // Visit the login page and enter valid credentials
        cy.visit('http://localhost:5173/');
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();
        cy.visit('http://localhost:5173/dashboard/transactions/list');
      });

      it('should access transactions list', () => {
        // Enter email and password, then submit the form
        cy.get('h1.trans-header').should('be.visible').and('contain', 'List of Transactions');
      });

      it('should access transactions search field', () => {
        cy.get('input[placeholder="Search ...."]').should('be.visible').and('have.attr', 'placeholder', 'Search ....').and('have.value', '');
      });

        // Table columns validation
      it('should access transactions table', () => {
        // cy.get('th:contains("Transaction ID")').should('be.visible').and('contain', 'Transaction ID');
        cy.get('th:contains("Company Name")').should('be.visible');
        cy.get('th:contains("Project Name")').should('be.visible');
        cy.get('th:contains("Type")').should('be.visible');
        cy.get('th:contains("Subtype")').should('be.visible');
        cy.get('th:contains("Subject")').should('be.visible');
        cy.get('th:contains("Forwarder")').should('be.visible');
        cy.get('th:contains("Receiver")').scrollIntoView().should('be.visible');
        cy.get('th:contains("Status")').should('be.visible');
        cy.get('th:contains("Priority")').should('be.visible');
        // cy.get('th:contains("Due Date")').should('be.visible').and('contain', 'Due Date');
        cy.get('th:contains("Percentage")').should('be.visible');
      });
 });