const request = require('supertest')
const app = require('../../app.js')

const mockFn = jest
  .fn((req, routePath, jsPath = null) => 'default')
  .mockImplementationOnce(() => 'https://digital.canada.ca')
  .mockImplementationOnce(() => false)

jest.mock('../../utils/load.helpers.js', () => ({
  getClientJs: () => {
    return mockFn()
  },
}))

test('Can send get request to start route and have js src set', async () => {
  const route = app.routes.get('start')
  const response = await request(app).get(route.path.en)
  expect(response.statusCode).toBe(200)
  expect(response.text).toContain('digital.canada.ca')
})
