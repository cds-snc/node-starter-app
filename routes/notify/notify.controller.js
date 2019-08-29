const path = require("path");
const { checkSchema } = require("express-validator");
const {
  getNextRoute,
  checkErrors,
  checkNonce,
  generateNonce,
  getRouteByName,
  getSessionData
} = require("./../../utils");
const { Schema } = require("./schema.js");

module.exports = app => {
  // add this dir to the views path
  const name = "notify";
  const route = getRouteByName(name);

  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  app.get(route.path, (req, res) => {
    res.render(name, {
      data: getSessionData(req),
      name,
      nonce: generateNonce()
    });
  });

  app.post(
    route.path,
    checkNonce,
    checkSchema(Schema),
    checkErrors(name),
    (req, res, next) => {
      const confirm = req.body.confirm;
      if (confirm === "Yes") {
        const nextRoute = getNextRoute(name);
        return res.redirect(nextRoute.path);
      }

      res.send("you said no");
    }
  );
};
