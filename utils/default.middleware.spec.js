const { getDefaultMiddleware, errorArray2ErrorObject } = require('../utils')
const { validationResult } = require('express-validator')

const Schema = {
  fullname: {
    isLength: {
      errorMessage: 'errors.fullname.length',
      options: { min: 3, max: 200 },
    },
  },
}

test('can catch errors using default middleware', async () => {
  const req = {
    body: { fullname: '', json: true },
    session: { formdata: {} },
  }

  const next = jest.fn()

  const res = {
    query: {},
    headers: {},
    status: number => {},
    render: () => {
      console.log('test')
    },
    data: null,
    json(payload) {
      return payload
    },
    cookie(name, value, options) {
      this.headers[name] = value
    },
  }

  const options = { schema: Schema, name: 'personal' }

  // get an array of middleWare
  const middleWare = getDefaultMiddleware(options)

  //run checkSchema()
  await middleWare[0][0](req, res, next)

  //run checkErrors()
  const result = middleWare[1](req, res, next)

  const errors = errorArray2ErrorObject(validationResult(req))

  expect(result.hasOwnProperty('fullname')).toEqual(true)
  expect(errors.fullname.param).toEqual('fullname')
})
