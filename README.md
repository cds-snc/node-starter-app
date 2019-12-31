# Canada Web Forms Starter Repo for Node.js

[![Total alerts](https://img.shields.io/lgtm/alerts/g/cds-snc/node-starter-app.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cds-snc/node-starter-app/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/cds-snc/node-starter-app.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cds-snc/node-starter-app/context:javascript)

**Demo:** https://cds-node-starter.herokuapp.com

**Changelog:** [changelog.md](https://github.com/cds-snc/node-starter-app/blob/master/changelog.md)

This repository provides a codebase that can be used to quickly build web pages or forms with a Government of Canada look-and-feel. 

It provides the following functionality:

- Create web pages that look like GC pages
- Add endpoints ([routes/URLs](#adding-routes)) for web form workflows, complete with [form validation](#form-validation)
- Prevents [forged cross-site requests](#form-csrf-protection)
- Translation ready, [using name/value pairs configs](#locales)
- A complete localization solution, including `/en/` and `/fr/` URL namespaces
- Fast deployment, currently for:
  - [Amazon Web Services](cdk) via [AWS CDK](https://aws.amazon.com/cdk/)
  - [Azure](terraform/readme.md) via [Terraform](https://terraform.io)
  - [Google Cloud Platform](cloudbuild.yaml) via [Google Cloud Build](https://cloud.google.com/cloud-build/)
- Continuous integration checks that run automatically via [GitHub Actions](https://github.com/features/actions)
  - [Accessibility](.github/workflows/a11y.yml)
  - [Code Styling / Linting]((.github/workflows/nodejs.yml))
  - Scanning codebase for [accidental secret leaking]((.github/workflows/secret.yml))

It's setup with some sensible defaults and tech choices, such as:

- Node.js >= 10.x
- NVM (Node Version Manager) for install Node.js versions
- [Express](https://expressjs.com/) web framework
- [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) view templates
- Sass (Syntactically Awesome Style Sheets) for reusable styles
- [Tailwindcss](https://tailwindcss.com/) a utility-first css framework for rapidly building custom designs
- [PostCSS](https://postcss.org/)
- [PurgeCSS](https://www.purgecss.com/)

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

## Custom styles, Sass, PostCSS, TailwindCSS, and PurgeCSS

There is a base set of SASS stylesheets included by default that provide a good base visual starting point.

TailwindCSS is included, but completely optional. If you don't like it, you can just remove the @tailwind directives in app.scss, remove the tailwind.scss customizations, and remove the tailwindcss plugin from postcss.config.js.

Webpack loads app.scss and imported sheets, runs them through PostCSS which parses SASS, sets up Tailwindcss, compiles, minimizes with cssnano, and applies autoprefixer. On production builds, everything gets passed through PurgeCSS to remove any unused classes to really reduce file size.

app.scss is where we recommend you place custom SASS or CSS rules.


## Adding Routes
Generate the route files
```
node ./bin/route.js create --route your_route_name
```

The created route directory by default contains the following files:
- your_route_name.controller.js
- your_route_name.njk
- schema.js (used for form views)
- client.js (optional - page-specific js for the browser)


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

Redirects are handled via `route.doRedirect()`. The doRedirect function will do a look up for the next route based on the routes config.

For cases where the redirect is not straight forward you can pass in a function, which can return a route name or a route object:

```javascript
// routes.config.js
const routes = [
  ...
  { name: 'my-route', ..., skipTo: 'other-route' }
  ...
]

// my-route.controller.js
route.draw(app)
  .post(..., route.doRedirect((req, res) => shouldSkip(req) ? route.skipTo : route.next))
```

Note that there is nothing specific about the name `skipTo`: any key that is set in the routes configuration will be visible from the `route` object the controller receives.

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

The following is an example of using the Fetch API in the browser to post to the `/personal` route with the CSRF token from the `<meta>` tag on the page:

```javascript
// - client.js - //

// Read the CSRF token from the <meta> tag
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

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

Text on pages is supplied via content IDs, and the localization framework provides the correct text depending on the locale. All form macros (such as `textInput`) receive these IDs for labels or other content.

``` jinja2
{% block content %}
  <h1>{{ __('personal.title') }}</h1>

  <div>
    <p>{{ __('personal.intro') }}</p>
  </div>

  <form method="post">
    {{ textInput('fullname', 'form.fullname') }}
  </form>
{% endblock %}
```

```js
// locales/en.json
{
// ...
  "personal.title": "Personal Information",
  "personal.intro": "Intro copy goes here",
  "form.fullname": "Full name",
// ...
}
```

## Form Validation

- Form validation is built into the form schema files and use [validator.js](https://github.com/validatorjs/validator.js#validators) to validate input

> To mark fields showing as required you can pass required: true as an attribute
## Template Engine

[Nunjucks](https://mozilla.github.io/nunjucks/)

## Common View Helpers

See views/_includes

## Change configuration

Don't like the way it's setup -> it's an Express server so do your thing `app.js`

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


## Notes

This project is based on the orginal code https://github.com/cds-snc/cra-claim-tax-benefits it was born out of wanting to use that code as a base without the need to remove the unused parts everytime a new project is started.

See:

- https://github.com/cds-snc/notification-demo-service/commit/ab24e79268626e1431b301fb91614b40f9615086
- https://github.com/cds-snc/2620-passport-renewal/commit/eb41bf83825b9d8c4a56427e0cd199ccc23089eb

> Starter Cloud Build / Cloud Run setup is in place if you prefer to deploy via GCP see `notification-demo-service` which is setup to deploy using a tag.

<hr>
<hr>

# Dépôt de départ pour la création de formulaires Web du GC pour Node.js 

**Démo:** https://cds-node-starter.herokuapp.com

**Journal des modifications:** [changelog.md](https://github.com/cds-snc/node-starter-app/blob/master/changelog.md)

Ce dépôt fournit un code base pouvant être utilisé pour créer rapidement des pages Web ou des formulaires Web à l’image du Gouvernement du Canada.

- Création de pages Web de même apparence que les pages du GC
- Ajout de points d’extrémité [routes/URL](#adding-routes) pour les workflows de formulaires Web, avec [validation](#validation-de-formulaire) de formulaire 
- Protection [contre les requêtes intersites falsifiées](#form-csrf-protection)
- Traduction possible grâce à des configurations de [paires nom/valeur](#locales)
- Déploiement rapide disponible pour :
  - Web Amazon Services via [AWS CDK](https://aws.amazon.com/cdk/)
  - [Azure](terraform/readme.md) via [Terraform](https://terraform.io)
  - [Google Cloud Platform](cloudbuild.yaml) (GCP) via [Google Cloud Build](https://cloud.google.com/cloud-build/)
  - Contrôles à partir de l’intégration continue qui s’exécutent de façon automatique via Actions GitHub 
  - [Accessibilité](.github/workflows/a11y.yml)
  - [Stylisation et linting du code](.github/workflows/nodejs.yml)
  - Balayage du code base pour les fuites [accidentelles de clés secrètes](.github/workflows/secret.yml)


Le dépôt est configuré avec des valeurs par défaut et des choix technologiques pratiques comme:

- Node.js >= 10.x
- NVM (Node Version Manager) pour les versions Install de Node.js 
- L’infrastructure d’applications Web [Express](https://expressjs.com)
- Les modèles de vues [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) 
- Sass (Syntactically Awesome Style Sheets) pour des styles réutilisables
- [Tailwind CSS](https://tailwindcss.com), une infrastructure utilitaire CSS pour la création rapide de designs personnalisés
- [PostCSS](https://postcss.org)
- [PurgeCSS](https://www.purgecss.com)

## Cloner et tirer des modifications en amont

1. Créez un dépôt GitHub empty (doit être vide)

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

## Install + Mode Dev

```bash
npm install
npm run dev
```

## Styles personnalisés, Sass, PostCSS, TailwindCSS et PurgeCSS

Il existe un ensemble de base de feuilles de styles qui est inclus par défaut et qui fournit un bon point de départ pour un visuel de base. 

TailwindCSS est inclus, mais est tout à fait facultatif. Si vous ne l’aimez pas, vous n’avez qu’à supprimer les directives @tailwind dans app.scss, les personnalisations tailwind.scss, et le plugiciel tailwindcss dans postcss.config.js. 

Webpack charge app.scss et les feuilles importées, les exécute par l’intermédiaire de PostCSS qui analyse les fichiers SASS, configure Tailwindcss, compile, minifie avec CSSnano et applique Autoprefixer. Sur les versions de production, tout passe par PurgeCSS pour éliminer les classes inutilisées et réduire véritablement la taille des fichiers.

app.scss est l’endroit où nous recommandons que vous placiez des règles SASS ou CSS personnalisées.

## Ajouter des routes

Générez les fichiers de route

```bash
node ./bin/route.js create --route your_route_name
```

Le répertoire de la route créé contient par défaut les fichiers suivants :
 - your_route_name.controller.js
 - your_route_name.njk
 - schema.js (utilisé pour les vues de formulaires)

Enregistrez la route via [routes.config.js](https://github.com/cds-snc/node-starter-app/blob/master/config/routes.config.js)

```javascript
// config/routes.config.js
...
const routes = [
  { name: "your_route_name", path: "/your_route_name" },
];
...
```

Remarque : Supprimez au besoin les répertoires de routes inutilisés.

## Redirections pour étapes de formulaire

Les redirections sont gérées avec route.doRedirect(). La fonction doRedirect recherche la route suivante en fonction de la configuration des routes.

Pour les situations où la redirection n’est pas simple, vous pouvez introduire une fonction qui retourne un nom de route ou un objet de route :

```javascript
// routes.config.js
const routes = [
  ...
  { name: 'my-route', ..., skipTo: 'other-route' }
  ...
]

// my-route.controller.js
route.draw(app)
  .post(..., route.doRedirect((req, res) => shouldSkip(req) ? route.skipTo : route.next))
```

## Protection CSRF pour formulaires

La protection contre la falsification de requête intersites (CSRF)[https://github.com/expressjs/csurf] est fournie par l’intergiciel csurf.

Notez que le jeton CSRF est transmis à tous les modèles par l’intermédiaire de response.locals, c’est-à-dire : 

```javascript
// append csrfToken to all responses
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})
```

Pour réussir à soumettre un formulaire, vous devez inclure un jeton CSRF dans un champ caché :

```javascript
<input type="hidden" name="_csrf" value="{{ csrfToken }}">
```

Si vous utilisez JS/Ajax, vous pouvez obtenir le jeton CSRF à partir de la balise d’en-tête meta incluse dans le modèle de base :

```javascript
<meta name="csrf-token" content="{{ csrfToken }}">
```

L’exemple suivant est un exemple d’utilisation de l’API Fetch pour publier sur la route /personal avec le jeton CSRF provenant de la balise <meta>  sur la page :

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

## Paramètres régionaux

Le texte dans les pages est fourni par des ID. 

```javascript
block variables
  -var title = __('personal.title')

block content

  h1 #{title}

  div
    p #{__('personal.intro')}
  form(method='post')
```

```javascript
// locales/en.json
"personal.title": "Personal Information",
"personal.intro": "Intro copy goes here",
"form.fullname": "Full name",
```

## Validation de formulaire
- La validation des formulaires est intégrée dans les fichiers de schéma des formulaires et elle utilise [validator.js](https://github.com/validatorjs/validator.js#validators) pour valider les entrées.

> Pour indiquer que des champs sont requis, vous pouvez faire passer required: true comme attribut.

## Template Engine

[Nunjucks](https://mozilla.github.io/nunjucks)

## Aides de vue communes

Consultez views/_includes

## Changer la configuration

Vous n’aimez pas la configuration actuelle -> c’est un serveur Express, donc faites ce que vous souhaitez app.js

## Interface de ligne de commande (CLI)
 - Il y a un outil CLI de base qui vous permet d’exécuter certaines fonctions :

```bash
> node ./bin/cli.js routes
[ { name: 'sample', path: '/sample' },
  { name: 'start', path: '/start' },
  { name: 'personal', path: '/personal' },
  { name: 'confirmation', path: '/confirmation' } ]
```

## Déploiement

La version et le déploiement par défaut actuels se font via GCP Cloud Build et Cloud Run. Le cloudbuild.yaml n’est pas une solution toute faite, donc il devra être ajusté, tout comme les permissions correctement définies dans GCP. [Ce lien](https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build#continuous) explique les étapes requises pour bien configurer Cloud Run.

## Objectifs

- Fonctions d’accessibilité prêtes à l’emploi
- Maintien des routes de code, des vue(s) et des schémas dans un état aussi portable (complet) que possible.
- Si le code, c’est-à-dire les validateurs personnalisés des routes, peut être réutilisé, il doit être remonté au niveau app
- Avoir à toucher le moins possible le code au niveau de l’app (app.js) lors de la création d’une nouvelle application basée sur le créateur de formulaire
- Mise en oeuvre des meilleures pratiques issues de [Conception de formulaire : de zéro à héros en un article de blogue](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post/) (en anglais)

> Les routes devraient agir comme un plugiciel. Ex. : Soit le Projet B, qui a une page dont vous avez besoin. Copiez le répertoire de la route et ajoutez cette route à votre configuration.

## Ce que le projet n’est pas
- Le projet a pour objectif de vous permettre de démarrer sur les chapeaux de roue. Il n’offre pas une solution de facto universelle.

## Notes

Le projet est basé sur le code original de https://github.com/cds-snc/cra-claim-tax-benefits et est né de la volonté d’utiliser ce code comme base, sans avoir à éliminer les parties inutilisées chaque fois qu’un nouveau projet débute.

Consultez :

 - https://github.com/cds-snc/notification-demo-service/commit/ab24e79268626e1431b301fb91614b40f9615086
 - https://github.com/cds-snc/2620-passport-renewal/commit/eb41bf83825b9d8c4a56427e0cd199ccc23089eb
 
 
La configuration pour Starter Cloud Build / Cloud Run est établie; si vous préférez déployer via GCP consultez notification-demo-service, qui est configuré pour faire des déploiements en utilisant une balise.
