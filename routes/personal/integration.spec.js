import { A11yReporter } from '@cdssnc/a11y-tracker-client'

describe('personal', () => {
  it('has a button', () => {
    cy.visit('/en/personal')
    cy.contains("Personal Information").should('be.visible')
    cy.reportA11y()
  })
})
