// E2E Testing for the ENDOCTRACK Login functionality

describe('Login Test', () => {
  const email = 'manager@envicomm.org';
  const password = 'manager';

  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('http://localhost:5173/');
  });

  it('should display the login form', () => {
    // login form elements 
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should log in successfully with valid credentials', () => {
    // Enter email and password, then submit the form
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard/overview');
    cy.get('h1').should('contain', 'Welcome');
  });

  it('should display an error message with invalid credentials', () => {
    // Enter incorrect credentials
    cy.get('input[name="email"]').type('invalid@envicomm.org');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Toast messsage
    cy.get('.Toastify__toast-body', { timeout: 5000 })
    .should('be.visible')
    .and('contain', 'Something went wrong while logging in !');
  });
});




describe('Transactions Test', () => {
  const email = 'records@envicomm.org';
  const password = 'records';

  before(() => {
      // Visit the login page and enter valid credentials
      cy.visit('http://localhost:5173/');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
    });

    it('should access transactions list', () => {
      // Enter email and password, then submit the form
      cy.visit('http://localhost:5173/dashboard/transactions/list');
      cy.get('h1.trans-header').should('be.visible').and('contain', 'List of Transactions');
      cy.get('input[placeholder="Search ...."]').should('be.visible').and('have.attr', 'placeholder', 'Search ....').and('have.value', '');

      // Table columns validation
      // cy.get('th:contains("Transaction ID")').should('be.visible').and('contain', 'Transaction ID');
      cy.get('th:contains("Company Name")').should('be.visible');
      cy.get('th:contains("Project Name")').should('be.visible').and('contain', 'Project Name');
      cy.get('th:contains("Type")').should('be.visible').and('contain', 'Type');
      cy.get('th:contains("Subtype")').should('be.visible').and('contain', 'Subtype');
      cy.get('th:contains("Subject")').should('be.visible').and('contain', 'Subject');
      cy.get('th:contains("Forwarder")').should('be.visible').and('contain', 'Forwarder');
      cy.get('th:contains("Receiver")').should('be.visible').and('contain', 'Receiver');
      cy.get('th:contains("Status")').should('be.visible').and('contain', 'Status');
      cy.get('th:contains("Priority")').should('be.visible').and('contain', 'Priority');
      // cy.get('th:contains("Due Date")').should('be.visible').and('contain', 'Due Date');
      cy.get('th:contains("Percentage")').should('be.visible').and('contain', 'Percentage');
    });
});
  