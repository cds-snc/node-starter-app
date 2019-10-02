# Canada Web Forms Starter Repo

[![Total alerts](https://img.shields.io/lgtm/alerts/g/cds-snc/node-starter-app.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cds-snc/node-starter-app/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/cds-snc/node-starter-app.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cds-snc/node-starter-app/context:javascript)

**Demo:** https://cds-node-starter.herokuapp.com

**Changelog:** [changelog.md](https://github.com/cds-snc/node-starter-app/blob/master/changelog.md)

This repository provides a codebase that can be used to quickly build web pages or forms with a Government of Canada look-and-feel. It's setup with some sensible defaults and tech choices, such as:

- Node.js 10.x
- NVM (Node Version Manager) for install Node.js versions
- [Express](https://expressjs.com/) web framework
- [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) view templates
- Sass (Syntactically Awesome Style Sheets) for reusable styles

## Cloning and pulling upstream changes

1. Create an `empty` Github repo (**must be empty**)

```bash

git remote add upstream git@github.com:cds-snc/node-starter-app.git
git pull upstream master
git remote -v // ensure the remotes are setup properly

// you should see
origin  git@github.com:cds-snc/your-repo.git (fetch)
origin  git@github.com:cds-snc/your-repo.git (push)
upstream        git@github.com:cds-snc/node-starter-app.git (fetch)
upstream        git@github.com:cds-snc/node-starter-app.git (push)
```

## Install + Dev Mode

```bash
npm install
npm run dev
```

## Adding Routes
Generate the route files
```
node ./bin/route.js create --route your_route_name
```

The created route directory by default contains the following files:
- your_route_name.controller.js
- your_route_name.pug
- schema.js (used for form views)


Register the route via [routes.config.js](https://github.com/cds-snc/node-starter-app/blob/master/config/routes.config.js)

```javascript
// config/routes.config.js
...
const routes = [
  { name: "your_route_name", path: "/your_route_name" },
];
...
```

Note: Delete unused route(s) directories as needed.


## Form step redirects

Redirects are handled via doRedirect. The doRedirect function will do a look up for the next route based on the routes config. 

For cases where the redirect is not straight forward you can handle manually.

```javascript
(req, res, next) => {
  const confirm = req.body.confirm;
  if (confirm === "Yes") {
    const nextRoute = getNextRoute(name);
    return res.redirect(nextRoute.path);
  }

  res.send("you said no");
};
```

## Form CSRF Protection

CSRF protection for forms is provided by [csurf](https://github.com/expressjs/csurf) middleware.

Note that the CSRF token is passed to all templates through response.locals, ie:

```javascript
// append csrfToken to all responses
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})
```

To successfully submit a form, you must include a CSRF token in a hidden field:

```html
<input type="hidden" name="_csrf" value="{{ csrfToken }}">
```

If using JS/Ajax, you can get the csrf token from the header meta tag included in the base template:

```html
<meta name="csrf-token" content="{{ csrfToken }}">
```

The following is an example of using the Fetch API to post to the `/personal` route with the CSRF token from the `<meta>` tag on the page:

```javascript
// Read the CSRF token from the <meta> tag
var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

// Make a request using the Fetch API
fetch('/process', {
  credentials: 'same-origin', // <-- includes cookies in the request
  headers: {
    'CSRF-Token': token // <-- is the csrf token as a header
  },
  method: 'POST',
  body: {
    favoriteColor: 'blue'
  }
})
```

## Locales

Text on pages is supplied via ids

```pug
block variables
  -var title = __('personal.title')

block content

  h1 #{title}

  div
    p #{__('personal.intro')}
  form(method='post')
```

```json
// locales/en.json
"personal.title": "Personal Information",
"personal.intro": "Intro copy goes here",
"form.fullname": "Full name",
```

## Form Validation

- Form validation is built into the form schema files and use [validator.js](https://github.com/validatorjs/validator.js#validators) to validate input

## Templates

- Templates currenty use Pug (formerly Jade). You can use whatever you like for a [template-engine](https://expressjs.com/en/resources/template-engines.html). There's even a server rendered [React](https://github.com/reactjs/express-react-views) engine. That said, it's bring your own layouts and helper files.

## Common View Helpers

See views/_includes

## Change configuration

Don't like the way it's setup -> it's an Express server so do your thing `app.js`

### Samples

Radio Buttons
```
include /_includes/radios
+radioButtons('card_type', {1:'Visa',2:'MasterCard'}, data.card_type, 'Name of card', errors)
```
Text Inputs
```
+textInput('form.fullname', null, 'form.fullname.desc')(class='w-3-4', id='fullname' name='fullname', autofocus, value=data.fullname)
```

## CLI

- There is a basic CLI tool that allows you to perform some functions:

```
> node ./bin/cli.js routes
[ { name: 'sample', path: '/sample' },
  { name: 'start', path: '/start' },
  { name: 'personal', path: '/personal' },
  { name: 'confirmation', path: '/confirmation' } ]
```

## Deployment

- The current default build and deploy is through GCP CloudBuild and Cloud Run. The `cloudbuild.yaml` will not work out of the box, so it will need to be tweaked as well as the permissions set correctly in GCP. [This link](https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build#continuous) explains the required steps to set up Cloud Run properly.

## Goals

- Accessible out of the box
- Keep code routes / view(s) / schemas as portable (self-contained) as possible.
- If code i.e custom validators from the routes can be re-used it should be pulled up to the `app` level
- App level code (app.js) should be touched a little as possible when building a new app based on the starter
- Implement best practices from [Form design: from zero to hero all in one blog post](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post)

> Routes should act like a plugin.
> i.e. Project B has a page you need, copy the route directory and add that route to your config.

## What this project is not

- This project aims to allow you to hit the ground running. It's not meant to be a be all end all defacto solution.

## Todo

- Adding tests for sample routes
- Adding more tests for utility functions

## Notes

This project is based on the orginal code https://github.com/cds-snc/cra-claim-tax-benefits it was born out of wanting to use that code as a base without the need to remove the unused parts everytime a new project is started.

See:

- https://github.com/cds-snc/notification-demo-service/commit/ab24e79268626e1431b301fb91614b40f9615086
- https://github.com/cds-snc/2620-passport-renewal/commit/eb41bf83825b9d8c4a56427e0cd199ccc23089eb

> Starter Cloud Build / Cloud Run setup is in place if you prefer to deploy via GCP see `notification-demo-service` which is setup to deploy using a tag.
