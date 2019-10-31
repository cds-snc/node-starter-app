/* eslint-disable no-undef */


function checkA11y(cy){ 
    cy.checkA11y({
      runonly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa"]}});
  }
  
  describe('Items shown on the Landing page', () => {
    beforeEach(() => {
      cy.visit('/')
     
    })
    it('Has no detectable a11y violations on load', () => {
      // Test the page at initial load
      cy.injectAxe()
      cy.url().should('contains', '/')
       checkA11y(cy)
    })
  })