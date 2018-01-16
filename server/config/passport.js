// Importing Passport, strategies and config
const passport = require("passport"),
  User = require("../models/User"),
  config = require("./main"),
  JwtStragtegy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  LocalStrategy = require("passport-local");

const localOptions = { usernameField: "email" };

//Setting up local login Strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne(
    {
      email: email
    },
    (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          error: "Your login details could not be verified"
        });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, {
            error: "Your login details could not be verified"
          });
        }

        return done(null, user);
      });
    }
  );
});

const jwtOptions = {
  //Telling passport to check authorizazion header from JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  //Telling passport where to find the secret
  secretOrKey: config.secret
};

const jwtLogin = new JwtStragtegy(jwtOptions, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
