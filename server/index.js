const express = require("express"),
  app = express(),
  logger = require("morgan"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  config = require("./config/main"),
  router = require("./router");


//Database connection
mongoose.connect(config.database);

//Server start
const server = app.listen(config.port);
console.log("magic happens on port " + config.port);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev")); //Log requests to API using morgan

//Enable CORS from client-side
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,GET,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Cotrol-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

router(app);
