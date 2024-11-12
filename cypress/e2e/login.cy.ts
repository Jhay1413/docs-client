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

  