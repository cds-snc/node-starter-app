/* eslint-disable no-undef */

import { headerImg, langLink, privacyLink, tocLink, aboutCA, sMedia, mobileApp, aboutCAHref, sMediaHref, mobileHref, tocHref, privacyHref, footerImg } from './utils'

function checkA11y(cy) {
    cy.checkA11y({
        runonly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa"],
        },
    });
}


describe('Items shown on the province page', () => {
    beforeEach(() => {
        cy.visit('//en/province')

    })
    it.skip('Has no detectable a11y violations on load', () => {
        // Test the page at initial load
        cy.injectAxe()
        cy.url().should('contains', '/en/province')
        checkA11y(cy)
    })
    it('should go to the province page and show header image and links ', () => {
        cy.get(headerImg).should('be.visible')
        cy.get(langLink).should('be.visible', 'Français')

        })
    it('should check footer info for links and canada image', () => {
        cy.get(aboutCA).should('be.visible').and('contain', 'About Canada.ca')
        cy.get(sMedia).should('be.visible').and('contain', 'Social media')
        cy.get(mobileApp).should('be.visible').and('contain', 'Mobile applications')
        cy.get(tocLink).should('contain', 'Terms and conditions')
        cy.get(privacyLink).should('contain', 'Privacy')
    
        cy.get(aboutCAHref).should('have.attr', 'href', 'https://www.canada.ca/en/government/about.html')
        cy.get(sMediaHref).should('have.attr', 'href', 'https://www.canada.ca/en/social.html')
        cy.get(mobileHref).should('have.attr', 'href', 'https://www.canada.ca/en/mobile.html')
        cy.get(tocHref).should('have.attr', 'href', 'https://www.canada.ca/en/transparency/terms.html')
        cy.get(privacyHref).should('have.attr', 'href', 'https://www.canada.ca/en/transparency/privacy.html')
    
        cy.get(footerImg).should('be.visible')
       })

       it('should show the header steps ', () => {  
        cy.get('#steps-banner').should('be.visible')
        .and('contain.text', 'Step 2 of 4 – Select a location')     
       })

})