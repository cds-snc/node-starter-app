const { makeRoutingTable, doRedirect } = require('./index')

const testRoutes = makeRoutingTable(
  [
    { name: 'start', path: { en: '/start', fr: '/debut' } },
    { name: 'personal', path: { en: '/personal', fr: '/personnel' }, otherKey: 42 },
    { name: 'confirmation', path: '/confirmation' },
  ],
  ['en', 'fr'],
  { directory: '/tmp' },
)

const start = testRoutes.get('start')
const personal = testRoutes.get('personal')
const confirmation = testRoutes.get('confirmation')

describe('Routes', () => {
  test('finds route by name', () => {
    expect(start.index).toEqual(0)
    expect(personal.index).toEqual(1)
    expect(confirmation.index).toEqual(2)
  })

  test('prefixes paths', () => {
    expect(start.path.fr).toEqual('/fr/debut')
    expect(confirmation.path.en).toEqual('/en/confirmation')
  })

  test('preserves custom keys', () => {
    expect(personal.otherKey).toEqual(42)
  })

  test("return undefined for previous route that doesn't exist", () => {
    expect(start.prev).toBeUndefined()
  })

  test('finds previous route', () => {
    expect(start.prev).toBeUndefined()
    expect(personal.prev).toEqual(start)
    expect(confirmation.prev).toEqual(personal)
  })

  test('finds next route', () => {
    expect(start.next).toEqual(personal)
    expect(personal.next).toEqual(confirmation)
    expect(confirmation.next).toBeUndefined()
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
