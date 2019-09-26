# Changelog

## [3.0.1] - 2019-09-26
### Added
- updated nextRoute redirect to include query params
- added getNextRouteURL helper to get next route with query params


## [3.0.0] - 2019-09-26
### Added
- refactored the textInput and textArea macros with better defaults, simpler use
```
  {{ textInput('fullname', 'form.fullname', { class: "w-3-4" }) }}
  {{ textArea('address', 'form.address', { hint: 'form.address.desc' }) }}
```


## [2.2.1] - 2019-09-26
### Added
- filter spreadParams for future use 
  see: https://github.com/cds-snc/node-starter-app/pull/69
