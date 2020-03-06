import { A11yReporter } from './../../a11y-tracker-client'

const nodeEnv = Cypress.env('NODE_ENV') || 'development'

// default to not reporting
A11yReporter.configure({
  trackerURI: undefined,
  revision: '<local>',
  project: 'node-starter-app',
})

// if we're in CI and on the master branch, do the actual reporting
if (Cypress.env['CI'] && Cypress.env['GITHUB_REF'] === 'refs/heads/master') {
  A11yReporter.configure({
    tracker: 'https://a11y-tracker.digital.canada.ca',
    revision: Cypress.env('GITHUB_GIT_HASH'),
    key: Cypress.env('A11Y_TRACKER_KEY')
  })
}

A11yReporter.setupCypress()
