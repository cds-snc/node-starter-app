const { mockSession } = require('./../../utils/test.helpers')
const setSession = mockSession()

const request = require('supertest')
const app = require('../../app.js')

test('Confirmation receives 200 when data exists', async () => {
  setSession({ fullname: 'My full name' })
  const route = app.routes.get('confirmation')
  const response = await request(app).get(route.path.en)
  expect(response.text).toContain('My full name')
  expect(response.statusCode).toBe(200)
})
