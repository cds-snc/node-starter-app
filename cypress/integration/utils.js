// pretier-ignore
/* eslint-disable no-undef */

// Check the Header for Canada wordmark and French/English language link

export const headerImg = () => cy.get('a > img').eq(0);
export const langLink = () => cy.get('.language-link > a');
export const homeLinkHref = () => cy.get('.canada-flag > a').eq(0);


// Check the footer for links and Canada wordmark
export const sMedia = () => cy.get('#link-1 > a')
export const mobileApp = () => cy.get('#link-2 > a')
export const aboutCA = () => cy.get('#link-3 > a')
export const tocLink = () => cy.get('#link-4 > a')
export const privacyLink = () => cy.get('#link-5 > a')

export const sMediaHref = () => cy.get('#link-1 > a');
export const mobileHref = () => cy.get('#link-2 > a')
export const aboutCAHref = () => cy.get('#link-3 > a')
export const tocHref = () => cy.get('#link-4 > a')
export const privacyHref = () => cy.get('#link-5 > a')
export const footerImg = () => cy.get('.canada-wordmark > img')

export const nextButton = () => cy.get('.buttons--next')
export const nextButtons = () => cy.get('button[class="buttons--next"]')
