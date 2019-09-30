const {
  getRouteWithIndexByName,
  getRouteByName,
  getPreviousRoute,
  getNextRoute,
  doRedirect,
  routeUtils,
  routeHasIndex,
} = require('./index')

const testRoutes = [
  { name: 'start', path: '/start' },
  { name: 'personal', path: '/personal' },
  { name: 'confirmation', path: '/confirmation' },
]

describe('Routes', () => {
  test('finds route index by name', () => {
    const obj = getRouteWithIndexByName('personal', testRoutes)
    expect(obj.index).toEqual(1)
  })

  test('finds route path by name', () => {
    const obj = getRouteByName('personal', testRoutes)
    expect(obj.path).toEqual('/personal')
  })

  test("return false for previous route that doesn't exist", () => {
    const obj = getPreviousRoute('start', testRoutes)
    expect(obj.path).toEqual(false)
  })

  test('finds previous route path by name', () => {
    const obj = getPreviousRoute('personal', testRoutes)
    expect(obj.path).toEqual('/start')
  })

  test("return false for next route that doesn't exist", () => {
    const obj = getNextRoute('confirmation', testRoutes)
    expect(obj.path).toEqual(false)
  })

  test('finds next route path by name', () => {
    const obj = getNextRoute('personal', testRoutes)
    expect(obj.path).toEqual('/confirmation')
  })
})

test('getPreviousRoute will throw an error when missing params', () => {
  expect(() => {
    getPreviousRoute()
  }).toThrow()
})

test('getNextRoute will throw an error when missing params', () => {
  expect(() => {
    getNextRoute()
  }).toThrow()
})

describe('doRedirect', () => {
  test('Calls redirect if it finds the next route', () => {

    // stub for the Route class
    const route = { next: { url: () => '/somewhere' } }

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
    doRedirect({})(req, res, next)
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
