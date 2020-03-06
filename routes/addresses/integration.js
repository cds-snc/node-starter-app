describe('addresses', () => {
  it('shows addresses', () => {
    cy.visit('/en/addresses')
    cy.reportA11y()
  })
})
