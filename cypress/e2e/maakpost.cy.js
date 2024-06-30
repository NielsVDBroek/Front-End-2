describe('template spec', () => {
  it('passes', () => {
    // Visit the site
    cy.visit('http://localhost:5173/')

    // Navigate to login page
    cy.get('#cypress-test-login-button').click()

    //Register als nodig is
    // // Navigate to registration page
    // cy.get('#cypress-test-register-button').click()

    // // Register a new user
    // cy.get('#email-address').type('test@cypress.com')
    // cy.get('#password').type('Cypresstest123')
    // cy.get('#cypress-test-submit-register').click()

    // // Complete account setup
    // cy.get('#cypress-test-username-field').type('CypressTestUsername')
    // cy.get('#finalize-account-button').click()

    //Login
    cy.get('#cypress-test-login-form-button').click()
    cy.get('#email-address').type('test@cypress.com')
    cy.get('#password').type('Cypresstest123')
    cy.get('#cypress-test-login-form').click()


    // Navigate back to home
    cy.get('#cypress-test-home-button').click()
    
    // Create a new post
    // Click "Maak post" button to open the post creation modal
    cy.get('.maak-post-btn').click()

    // Add content to the post
    cy.get('input[placeholder="Post content..."]').type('This is a test post')

    // Submit the post
    cy.get('#cypress-test-submit-post').click()

    // Verify the post content is in the document
    cy.contains('This is a test post').should('be.visible')
  })
})
