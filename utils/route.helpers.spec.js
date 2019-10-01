const {
  makeRoutingTable,
  doRedirect,
  routeUtils,
} = require('./index')

const testRoutes = makeRoutingTable([
  { name: 'start', path: { en: '/start', fr: '/debut' } },
  { name: 'personal', path: { en: '/personal', fr: '/personnel' } },
  { name: 'confirmation', path: '/confirmation' },
], { directory: '/tmp' }).en

describe('Routes', () => {
  test('finds route by name', () => {
    const personal = testRoutes.get('personal')
    expect(personal.index).toEqual(1)
    expect(personal.path).toEqual('/en/personal')
  })

  test("return undefined for previous route that doesn't exist", () => {
    const start = testRoutes.get('start')
    expect(start.prev).toBeUndefined()
  })

  test('finds previous route', () => {
    const personal = testRoutes.get('personal')
    expect(personal.prev.path).toEqual('/en/start')
  })

  test("return undefined for next route that doesn't exist", () => {
    const confirmation = testRoutes.get('confirmation')
    expect(confirmation.next).toBeUndefined()
  })

  test('finds next route path by name', () => {
    const confirmation = testRoutes.get('personal').next
    expect(confirmation.path).toEqual('/en/confirmation')
  })

  test('finds same route in a different locale', () => {
    const confirmation = testRoutes.get('confirmation').withLocale('fr')
    expect(confirmation.locale).toEqual('fr')
    expect(confirmation.path).toEqual('/fr/confirmation')
  })

  test('uses the localized path name', () => {
    const start = testRoutes.get('start').withLocale('fr')
    expect(start.path).toEqual('/fr/debut')
  })
})

describe('doRedirect', () => {
  test('Calls redirect if it finds the next route', () => {
    const route = testRoutes.get('personal')

    const req = { body: {} }
    const next = jest.fn()
    const redirectMock = jest.fn()
    const res = {
      query: {},
      headers: {},
      data: null,
      redirect: () => {
        redirectMock()
      },
    }

    doRedirect(route)(req, res, next)
    expect(next.mock.calls.length).toBe(0)
    expect(redirectMock.mock.calls.length).toBe(1)
  })

  test('Calls next if json is requested', () => {
    const req = { body: { json: true } }
    const next = jest.fn()
    const res = {}
    doRedirect(testRoutes.get('confirmation'))(req, res, next)
    expect(next.mock.calls.length).toBe(1)
  })
})
