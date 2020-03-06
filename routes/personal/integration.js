describe('personal', () => {
  beforeEach(() => cy.visit('/en/personal'))

  it('has a title', () => {
    cy.contains("Personal Information").should('be.visible')
    cy.reportA11y()
  })

  it('shows errors', () => {
    cy.get('form').submit()
    cy.contains('errors').should('be.visible')
    cy.reportA11y()
  })
})
