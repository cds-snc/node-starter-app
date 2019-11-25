# Changelog

## [6.1.0] - 2019-11-25

### Updated
- Redirect back with errors. This *may* be a breaking change if you have written any customizations to deal with issues surrounding `renderPageWithErrors` in `validate.helpers.js`.  That method has been removed, and now on validation errors, we flash the errors to the session and redirect back to the `get` route.

### Removed
- `renderPageWithErrors` has been removed from `validate.helpers.js`

## [6.0.3] - 2019-11-22

- Nodemon [2.0.1](https://github.com/remy/nodemon/releases/tag/v2.0.1) 
  `Fixes ubuntu loop waiting for sub processes`

## [6.0.2] - 2019-11-20

### Updated 
- Fixed checkbox styling that broke when we merged Tailwind CSS
- Nodemon [2.0.0](https://github.com/remy/nodemon/releases/tag/v2.0.0) 
- Minor package bumps 

## [6.0.1] - 2019-11-15

- Fixed failing dependencies

## [6.0.0] - 2019-11-14

### Added 
- [Tailwind CSS](https://tailwindcss.com)
- [PostCSS](https://github.com/postcss/postcss) to handle SASS processing & CSS Autoprefixing
- [PurgeCSS](https://www.purgecss.com/) to purge unused css at build
- [cssnano](https://cssnano.co/) for minifying css

### Updated 
- Moved output path for CSS & JS files. 
  Before `/styles.css` after `/dist/css/styles.css`

- Moved clientJsDir 
  Before `/js/dist/` after `/dist/js/`

- Webpack now handles CSS loading, extracting

- Changed stylesheet entrypoint to `app.scss` which imports the default node-starter styles and tailwind

- Renamed the node-starter class `container` to `outer-container` due to a conflict with tailwindcss

- Fixed the infinite loop issue #116

### Removed
- sassMiddleware
- `normalize.css` (tailwindcss already includes it)

## [5.0.4] - 2019-11-06

### Added 
- Added webpack-cli

## [5.0.3] - 2019-10-17

### Added 
- Added `{ required: true }` for form inputs which adds * required to the field label fixes [#98](https://github.com/cds-snc/node-starter-app/issues/98)


## [5.0.2] - 2019-10-15

### Updated 
- Moved cross env to be a dev dependency to fix Heroku deployment

## [5.0.1] - 2019-10-10

### Added 
- cross env for proper support of Node environment variables on Windows

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
