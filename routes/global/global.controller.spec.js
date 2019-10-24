const request = require('supertest')
const app = require('../../app.js')

test('Returns 404', async () => {
  const response = await request(app).get("/some-route-that-doesn't exist")
  expect(response.statusCode).toBe(404)
})

test('Returns 500', async () => {
  const response = await request(app).get('/test-500')
  expect(response.statusCode).toBe(500)
})

test('Returns 302', async () => {
  const response = await request(app).get('/clear')
  expect(response.statusCode).toBe(302)
})
