// create an array of routes to allow us to
// a) easily chanage the route paths
// b) add the ability to lookup previous and next routes
const routes = [
  { name: "start", path: "/start" },
  { name: "personal", path: "/personal" },
  { name: "notify", path: "/notify" },
  { name: "confirmation", path: "/confirmation" },
  { name: "clear", path: "/clear" }
];

// configRoutes is called from app.js
// the controller(s) path gets added to the app view engine
// via app.set("views", [...app.get("views"), path.join(__dirname, "./")]);
// this keeps each "route" / view / schema grouped together
const configRoutes = app => {
  app.set("appRoutes", routes);
  require("../routes/clear/clear.controller")(app);
  require("../routes/start/start.controller")(app);
  require("../routes/personal/personal.controller")(app);
  require("../routes/notify/notify.controller")(app);
  require("../routes/confirmation/confirmation.controller")(app);
  require("../routes/global/global.controller")(app);
};

// define what a route object looks like
const Route = { name: false, path: false };

module.exports = {
  configRoutes,
  Route,
  routes
};
