describe('confirmation', () => {
  it('shows stuff', () => {
    cy.visit('/en/confirmation')
    cy.contains('Confirmation').should('be.visible')
    cy.contains('Français').should('be.visible')
    cy.contains('English').should('not.be.visible')
  })

  it('shows stuff, in french', () => {
    cy.visit('/fr/confirmation')
    cy.contains('English').should('be.visible')
  })
})
