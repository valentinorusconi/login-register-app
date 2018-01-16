const AuthenticationController = require("./controllers/authentication"),
  express = require("express"),
  passportService = require("./config/passport"),
  passport = require("passport");

//Middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

const REQUIRE_ADMIN = "Admin",
  REQUIRE_OWNNER = "Owner",
  REQUIRE_CLIENT = "Client",
  REQUIRE_MEMBER = "Member";

module.exports = (app) => {
  const apiRoutes = express.Router(),
    authRoutes = express.Router();

    //=====================
    //Auth authRoutes
    //=====================

    //Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    //Registration route
    authRoutes.post("/register", AuthenticationController.register);

    //Login route
    authRoutes.post("/login", AuthenticationController.login);

  //Set url for Api group apiRoutes
  app.use("/api",apiRoutes);
}
