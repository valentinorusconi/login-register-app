const jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  User = require("../models/User"),
  config = require("../config/main");

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10800 // sec
  });
}

//Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role
  };
}

//======================
//Login route
//======================
exports.login = (req, res, next) => {
  let userInfo = setUserInfo(req.user);
  res.status(200).json({
    token: "JWT" + generateToken(userInfo),
    user: userInfo
  });
};

//======================
//Register route
//======================

exports.register = (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  //Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: "You must enter an email address!" });
  }
  //Return eror if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: "You must enter your full name!" });
  }
  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: "You must enter a password!" });
  }
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    //If user is not unique, return error
    if (existingUser) {
      return res
        .status(522)
        .send({ error: "That email addess is already in use." });
    }
    let user = new User({
      email: email,
      password: password,
      profile: { firstName: firstName, lastName: lastName }
    });
    user.save((err, user) => {
      if (err) {
        return next(err);
      }

      //Respond with JWT if user was created
      let userInfo = setUserInfo(user);
      res.status.send(201).json({
        token: "JWT " + generateToken(userInfo),
        user: userInfo
      });
    });
  });
};

exports.roleAuthorization = role => {
  return (req, res, next) => {
    const user = req.user;
    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(422).json({
          error: "No user was found"
        });
      }
      //If user was is found, check role.
      if (foundUser.role == role) {
        return next();
      }
      res
        .status(401)
        .json({ error: "You are not authorized to view this content." });
    });
  };
};
