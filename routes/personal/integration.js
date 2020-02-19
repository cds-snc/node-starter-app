describe('personal', () => {
  it('has a button', () => {
    cy.visit('/en/personal')
    cy.contains("Personal Information").should('be.visible')
  })
})
