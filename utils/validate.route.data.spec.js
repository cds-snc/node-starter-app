const { validateRouteData } = require('../utils')

test('receives an error when missing data for a route schema', async () => {
  const req = {
    session: { formdata: { fullname: '', json: true } },
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
    session: { formdata: { fullname: 'the full name', json: true } },
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

test('receives an error when missing data for a route schema email', async () => {
  const req = {
    session: { formdata: { email: '', json: true } },
  }

  const schema = {
    email: {
      isLength: {
        errorMessage: 'errors.email.length',
        options: { min: 3, max: 200 },
      },
    },
  }

  const result = await validateRouteData(req, schema)
  expect(result.errors.email.param).toEqual('email')
})

test('receives an error when missing data for a route schema email', async () => {
  const req = {
    session: { formdata: { email: 'the full email', json: true } },
  }

  const schema = {
    email: {
      isLength: {
        errorMessage: 'errors.email.length',
        options: { min: 3, max: 200 },
      },
    },
  }

  const result = await validateRouteData(req, schema)
  expect(result.status).toEqual(true)
  expect(result.errors).toEqual(undefined)
})
