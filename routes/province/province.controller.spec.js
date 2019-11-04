const request = require('supertest')
const app = require('../../app.js')

test('Can send get request landing route ', async () => {
  const route = app.routes.get('landing')
  const response = await request(app).get(route.path.en)
  expect(response.statusCode).toBe(200)
})
