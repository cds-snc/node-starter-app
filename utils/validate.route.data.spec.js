const { validateRouteData } = require('../utils')

test('receives an error when missing data for a route schema', async () => {
  const req = {
    body: { fullname: '', json: true },
  }

  const schema = {
    fullname: {
      isLength: {
        errorMessage: 'errors.fullname.length',
        options: { min: 3, max: 200 },
      },
    },
  }

  const result = await validateRouteData(req, schema)
  expect(result.errors.fullname.param).toEqual('fullname')
})

test('receives an error when missing data for a route schema', async () => {
  const req = {
    body: { fullname: 'My Full Name', json: true },
  }

  const schema = {
    fullname: {
      isLength: {
        errorMessage: 'errors.fullname.length',
        options: { min: 3, max: 200 },
      },
    },
  }

  const result = await validateRouteData(req, schema)
  expect(result.status).toEqual(true)
  expect(result.errors).toEqual(undefined)
})
