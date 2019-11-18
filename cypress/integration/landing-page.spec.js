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
    it('should go to the landing page and show header image and links ', () => {
            cy.get(headerImg).should('be.visible')
            cy.get(langLink).should('be.visible', 'Français')

        })
        // it('should check footer info for links and canada image', () => {
        //   cy.url().should('contains', '/')
        //   cy.get(aboutCA).should('be.visible').and('contain', 'About Canada.ca')
        //   cy.get(sMedia).should('be.visible').and('contain', 'Social media')
        //   cy.get(mobileApp).should('be.visible').and('contain', 'Mobile applications')
        //   cy.get(tocLink).should('contain', 'Terms and Conditions')
        //   cy.get(privacyLink).should('contain', 'Privacy')

    //   cy.get(aboutCAHref).should('have.attr', 'href', 'https://www.canada.ca/en/government/about.html')
    //   cy.get(sMediaHref).should('have.attr', 'href', 'https://www.canada.ca/en/social.html')
    //   cy.get(mobileHref).should('have.attr', 'href', 'https://www.canada.ca/en/mobile.html')
    //   cy.get(tocHref).should('have.attr', 'href', 'https://digital.canada.ca/legal/terms/')
    //   cy.get(privacyHref).should('have.attr', 'href', '/privacy')

    //    cy.get(footerImg).should('be.visible')
    //   })
    it('should have text on the start page that informs the user', () => {
        cy.get('h1').should('be.visible')
            .and('contain.text', 'Request an appointment for fingerprints and photo (biometrics)')
        cy.get('#content').should('contain.text', 'You will need')
        cy.get('ul>li').eq(0).should('contain.text', 'Your Application number')
        cy.get('ul>li').eq(1).should('contain.text', 'A valid email address')
        cy.get('#privacy-notice').should('contain.text', 'Privacy notice')
            // needs to be updated with actual notice text
        cy.get('#privacy-text').should('contain.text', 'Lorem')

    })
    it('should verify the Privacy Notice default and errors and seleted state and a11y', () => {
        // verify the box is located on the page and by default not selected
        cy.get('input[id="policystart.policyAgree"]').should('be.visible').and('not.be.selected')
        cy.get('label[for="policystart.policyAgree"]').should('contain.text', 'I have read and accept the privacy policy')
            // verify error message shown if box not checked
        cy.get('button[type="submit"]').click({ force: true })
        cy.get('.error-list').should('contain.text', 'Please correct the errors on the page')
        cy.get('.error-list__link').should('contain.text', 'In order to start your request, you must first read and accept the privacy notice statement.')

        // Privacy policy error link
        cy.get('.error-list__link').click()
        cy.window().then(($window) => {
            expect($window.scrollY).to.be.closeTo(600, 200);
        })
        cy.get('#policy-error').should('be.visible')
        cy.get('#policy-error').should('contain.text', 'In order to start your request, you must first read and accept the privacy notice statement.')
        cy.get('input[id="policystart.policyAgree"]').click()
        cy.get('input[id="policystart.policyAgree"]').should('be.visible').and('be.checked')
            //  cy.get('#policy-error').should('not.be.visible')

    })

})