const {
  makeRoutingTable,
  getRouteWithIndexByName,
  getRouteByName,
  doRedirect,
  routeUtils,
  routeHasIndex,
} = require('./index')

const testRoutes = makeRoutingTable([
  { name: 'start', path: '/start' },
  { name: 'personal', path: '/personal' },
  { name: 'confirmation', path: '/confirmation' },
], { directory: '/tmp' })

describe('Routes', () => {
  test('finds route by name', () => {
    const personal = testRoutes.get('personal')
    expect(personal.index).toEqual(1)
    expect(personal.path).toEqual('/personal')
  })

  test("return undefined for previous route that doesn't exist", () => {
    const start = testRoutes.get('start')
    expect(start.prev).toBeUndefined()
  })

  test('finds previous route', () => {
    const personal = testRoutes.get('personal')
    expect(personal.prev.path).toEqual('/start')
  })

  test("return undefined for next route that doesn't exist", () => {
    const confirmation = testRoutes.get('confirmation')
    expect(confirmation.next).toBeUndefined()
  })

  test('finds next route path by name', () => {
    const personal = testRoutes.get('personal').next
    expect(personal.path).toEqual('/confirmation')
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

test('Can import routeUtils functions', () => {
  const utils = routeUtils
  expect(typeof utils.getRouteByName).toBe('function')
})

test('routeHasIndex returns false for a param that has no index', () => {
  const result = routeHasIndex()
  expect(result).toBe(false)
})

test('routeHasIndex returns false for an object that has no index', () => {
  const result = routeHasIndex({ test: true })
  expect(result).toBe(false)
})

test('routeHasIndex returns true for an object that an index', () => {
  const result = routeHasIndex({ index: 1 })
  expect(result).toBe(true)
})
