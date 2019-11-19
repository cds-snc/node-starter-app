/* eslint-disable no-undef */

import { headerImg, langLink, nextButton, privacyLink, tocLink, aboutCA, sMedia, mobileApp, aboutCAHref, sMediaHref, mobileHref, tocHref, privacyHref, footerImg } from './utils'

function checkA11y(cy) {
    cy.checkA11y({
        runonly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa"],
        },
    });
}


describe('Items shown on the registration page', () => {
    beforeEach(() => {
        cy.visit('/en/registration')

    })
    it('Has no detectable a11y violations on load', () => {
        // Test the page at initial load
        cy.injectAxe()
        cy.url().should('contains', '/en/registration')
        checkA11y(cy)
    })

    it('should go to the landing page and show header image and links ', () => {
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
        .and('contain.text', 'Step 1 of 4 – Enter your information')     
       })

    it('should have Application number and email address entry boxes', () => {
        cy.get('#applicationNumber__label').should('be.visible').and('contain.text', 'Application number')
        cy.get(':nth-child(2) > .form-message').should('contains.text', 'This number is at the top of the mailed letter')
        cy.get('#applicationNumber').should('be.enabled')
        cy.get('#email__label').should('be.visible').and('contain.text', 'Email address')
        cy.get(':nth-child(3) > .form-message').should('contains.text', "This is where we will send a confirmation email when you are done")
        cy.get('#email').should('be.enabled')
        cy.get('#confirmEmail__label').should('be.visible').and('contain.text', 'Confirm email address')
        cy.get(':nth-child(4) > .form-message').should('contains.text', 'Please re-enter your email address')
        cy.get('#confirmEmail').should('be.enabled')
        cy.get('#radio-text').should('contain.text', 'Do you require an accessible work station?')
        cy.get('#accessibleYes').should('be.visible')
        cy.get('#accessibleNo').should('be.visible')
        cy.get(nextButton).should('be.enabled').and('be.visible')
      })

    it('should show error messages for empty entries', () => {
       cy.get('.buttons--next').click()
         cy.injectAxe()
           checkA11y(cy) 
       cy.get('.error-list__header').should('be.visible').and('contain.text', 'Please correct the errors on the page')
     //   cy.get('p').should('contain.text', 'Please check these sections for errors:')
       cy.get(':nth-child(1) > .error-list__link').should('contain.text', 'Incorrect Number')
       cy.get(':nth-child(2) > .error-list__link').should('contain.text', 'Email is required')
       cy.get(':nth-child(3) > .error-list__link').should('contain.text', 'Email is required')
       cy.get(':nth-child(4) > .error-list__link').should('contain.text', 'Please indicate if you require an accessible work station')
        
       cy.get('#applicationNumber-error').should('be.visible').and('contain.text','Incorrect Number')
        //  .and('contain.text', 'We need your Application number so we can confirm your identity.')
       cy.get('#email-error').should('contains.text', 'Email is required')
       cy.get('#confirmEmail-error').should('contain.text', 'Email is required')
           
       })

    it('should show error message for incorrect Application number', () => {
        cy.fixture('user').then(data => {
          cy.get('#applicationNumber').type(data.wrongFileNumber, { force: true })
          cy.get('#email').type(data.email, { force: true })
          cy.get('#confirmEmail').type(data.email, { force: true })
          cy.get('#accessibleYes').click()
          cy.get('.buttons--next').click()
          cy.get('#applicationNumber-error').should('be.visible')
          .and('contain.text', 'Incorrect Number')
        //  cy.get('li > a').should('contain.text', 'Application number')
        
        })})
    it('should show error message for incorrect email address format', () => {
        cy.fixture('user').then(data => {
            cy.get('#applicationNumber').type(data.applicationNumber, { force: true })
            cy.get('#email').type(data.emailIncorrectFormat, { force: true })
            cy.get('#confirmEmail').type(data.emailIncorrectFormat, { force: true })
            cy.get('#accessibleYes').click()
            cy.get('.buttons--next').click()
            cy.get('.error-list__link')
            .should('contain.text', 'Email must be formatted correctly') 
            cy.get('#email-error')
              .should('contain.text', 'Email must be formatted correctly')
        })})

    it('should show error message for non matching email address', () => {
        cy.fixture('user').then(data => {
            cy.get('#applicationNumber').type(data.applicationNumber, { force: true })
            cy.get('#email').type(data.email, { force: true })
            cy.get('#confirmEmail').type(data.emailIncorrectMatch, { force: true })
            cy.get('#accessibleYes').click()
            cy.get('.buttons--next').click()
            cy.get('#email-error')
              .should('not.be.visible')
            cy.get('.error-list__link')
              .should('contain.text', 'Email addresses must match')
            cy.get('#confirmEmail-error').should('contain.text', 'Email addresses must match')   
        })})

    it('should scroll on error message click', () => {
        
        cy.fixture('user').then(data => {
        cy.get('#applicationNumber').type(data.wrongFileNumber, { force: true })
        cy.get('#email').type(data.emailIncorrectFormat, { force: true })
        cy.get('#confirmEmail').type(data.emailIncorrectMatch, { force: true })
        cy.get('.buttons--next').click()
        cy.injectAxe()
                // Application number link click
        cy.get('#applicationNumber-error').should('be.visible')
        cy.get(':nth-child(1) > .error-list__link').click()
        cy.window().then(($window) => {
            expect($window.scrollY).to.be.closeTo(700, 200);
            })
        
        checkA11y(cy)
                // Email address error link
        cy.get('#email-error').should('be.visible')
        cy.get(':nth-child(2) > .error-list__link').click()
        cy.window().then(($window) => {
              expect($window.scrollY).to.be.closeTo(780, 200);
         })

            // confirm email address error link
        cy.get('#confirmEmail-error').should('be.visible')
        cy.get(':nth-child(3) > .error-list__link').click()
        cy.window().then(($window) => {
           expect($window.scrollY).to.be.closeTo(920, 200);
           })
        checkA11y(cy)
            // confirm accessible work station error link
        cy.get('#accessible-error').should('be.visible')
        cy.get(':nth-child(4) > .error-list__link').click()
        cy.window().then(($window) => {
            expect($window.scrollY).to.be.closeTo(920, 200);
             })
        checkA11y(cy)
           
     })})
 
     it('should move to calendar page with successful entires.', () => {  
        cy.fixture('user').then(data => {
        cy.get('#applicationNumber').type(data.applicationNumber, { force: true })
        cy.get('#email').type(data.email, { force: true })
        cy.get('#confirmEmail').type(data.email, { force: true })
        cy.get('#email-error').should('not.be.visible')  
        cy.get('#radio-text').should('contain.text', 'Do you require an accessible work station?')
        cy.get('#accessibleYes').should('be.visible').click()
        cy.get('#accessibleNo').should('be.visible')
        cy.get('.buttons--next').click()
            // TODO: no calendar page yet - check that it goes to the page once added
        })})
  

})