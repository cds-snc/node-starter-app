const { getSessionData, saveSessionData } = require('./session.helpers')

const formVals = [
  {
    name: 'with generic values',
    before: { phone: '613-111-1111' },
    after: { phone: '613-111-1111' },
  },
  {
    name: 'but NOT the _csrf key',
    before: { phone: '613-111-1111', _csrf: '123' },
    after: { phone: '613-111-1111' },
  },
  {
    name: 'but NOT the redirect key',
    before: { phone: '613-111-1111', redirect: '/end' },
    after: { phone: '613-111-1111' },
  },
]
formVals.map(formVal => {
  test(`Can get and set form data for the session ${formVal.name}`, () => {
    const req = {}
    req.session = {}
    req.body = formVal.before
    expect(getSessionData(req)).toStrictEqual({})
    saveSessionData(req)
    expect(req.session.formdata).toStrictEqual(formVal.after)
    expect(getSessionData(req)).toStrictEqual(formVal.after)
  })
})
