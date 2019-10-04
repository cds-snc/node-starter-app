# Changelog

## [5.0.0] - 2019-10-04

### Updated
- Support for localized routes using `route.draw(app).get(...)`
  * BREAKING: `route.path` now returns an object with `.en`, `.fr`, etc keys.

### Added
- `route.applySchema(schema)` is a middleware that does the schema-related parts of what was formerly `defaultMiddleware`.
- `route.doRedirect()` is a middleware that will redirect to the next route in the correct locale
- `route.doRedirect((req, res) => routeOrName)` is a middleware that will compute the next redirect route, and redirect there in the correct locale.


## [4.0.1] - 2019-10-02
### Updated
Linting rules + include utils directory
Don't save `redirect` or `csrf` form data to session

### Added
Husky git hooks


## [4.0.0] - 2019-10-01
### Updated
Refactored the route helpers - we now pass a `Route` object into the controller alongside the `app`.

Additional properties added:
- route.name
- route.defaultMiddleware
- route.next
- route.prev
- route.get('personal').path

```
app
    .get(route.path, (req, res) => {
      res.render(route.name, routeUtils.getViewData(req))
    })
    .post(
      route.path,
      route.defaultMiddleware({ schema: Schema }),
    )
```

### Removed
- getPreviousRoute()
- getNextRoute()
- getNextRouteURL()
- getDefaultMiddleware()

## [3.2.0] - 2019-09-27
### Updated
- validateRouteData(req, schema) allows a route data to be validated from another route

## [3.0.1] - 2019-09-26
### Added
- added getNextRouteURL helper to get next route with query params
### Updated
- updated nextRoute redirect to include query params


## [3.0.0] - 2019-09-26
### Updated
- refactored the textInput and textArea macros with better defaults, simpler use
```
  {{ textInput('fullname', 'form.fullname', { class: "w-3-4" }) }}
  {{ textArea('address', 'form.address', { hint: 'form.address.desc' }) }}
```


## [2.2.1] - 2019-09-26
### Added
- filter spreadParams for future use
  see: https://github.com/cds-snc/node-starter-app/pull/69
