import { A11yReporter } from '@cdssnc/a11y-tracker-client'

const nodeEnv = Cypress.env('NODE_ENV') || 'development'

if (nodeEnv === 'development') {
  A11yReporter.setupCypress({
    baseURI: undefined, // no reporting in development!
    runId: '<local>'
  })
}
else if (nodeEnv === 'staging') {
  A11yReporter.setupCypress({
    baseURI: 'https://a11y-tracker.digital.canada.ca',
    runId: Cypress.env('GITHUB_GIT_HASH'),
  })
}
else {
  throw new Error(`cannot test in environment: ${nodeEnv}`)
}

afterEach(() => {
  cy.reportA11y()
})
