describe('Admin happy-path flow', () => {
  const admin = {
    username: 'testadmin',
    email: 'testadmin6@example.com',
    password: 'Password123!'
  };
  const game = {
    initialTitle: 'My Test Game',
    updatedTitle: 'My Updated Game',
    thumbnailPath: 'cypress/fixtures/sample.jpg'
  };

  it('Registers, creates & runs a game, and logs out/in', () => {
    

    cy.visit('http://localhost:3000/register');
    cy.get('input[placeholder="Enter username"]').type(admin.username);
    cy.get('input[placeholder="Enter email"]').type(admin.email);
    cy.get('input[placeholder="Enter password"]').type(admin.password);
    cy.get('input[placeholder="Confirm password"]').type(admin.password);
    cy.contains('button', 'Register').click();
    
    cy.wait(1000);

    cy.url().should('include', 'http://localhost:3000/dashboard');

    // 2) CREATE A NEW GAME
    // assumes Dashboard has a "New Game" button
    cy.contains('Create new game').click();
    cy.get('input[placeholder="Enter a name for your game."]').type(game.initialTitle);
    cy.contains('button', 'Create').click();
    // should re-render dashboard with new game
    cy.contains(game.initialTitle).should('be.visible');

    // 3) OPTIONAL: EDIT NAME & THUMBNAIL
    // click the edit-name pencil
    cy.contains(game.initialTitle)
      .parent()
      .within(() => {
        cy.get('[aria-label="Edit Title"], .bi-pencil-fill').first().click();
      });
    cy.get('input[placeholder="Enter new game title"]')
      .clear()
      .type(game.updatedTitle);
    cy.contains('button', 'Save').click();
    cy.contains(game.updatedTitle).should('be.visible');

    // thumbnail edit: hover to reveal overlay then click
    cy.contains(game.updatedTitle)
      .parent()
      .find('[data-testid="game-thumbnail"]')
      .trigger('mouseover');
    cy.get('[data-testid="thumbnail-overlay"]').click();
    // now in the Upload Thumbnail modal
    cy.get('input[type="file"]').attachFile(game.thumbnailPath);
    cy.contains('button', 'Upload').click();
    // back in dashboard, could assert thumbnail img exists:
    cy.contains(game.updatedTitle)
      .parent()
      .find('img[alt="Thumbnail"]')
      .should('exist');

    // 4) START THE GAME
    cy.contains(game.updatedTitle)
      .parent()
      .within(() => {
        cy.contains('Start').click();
      });
    // should redirect to session lobby
    cy.url().should('match', /\/session\/\d+$/);

    // 5) END THE GAME (no players)
    cy.contains('button', 'End Game').click();
    // results page
    cy.url().should('match', /\/results$/);
    cy.contains('Quiz Complete!').should('be.visible');

    // 6) LOG OUT
    cy.contains('button', 'Logout').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 7) LOG BACK IN
    cy.visit('http://localhost:3000/login');
    cy.get('input[placeholder="Enter email"]').type(admin.email);
    cy.get('input[placeholder="Enter password"]').type(admin.password);
    cy.contains('button', 'Log In').click();
    cy.url().should('include', '/dashboard');
  });
});