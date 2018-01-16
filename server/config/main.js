module.exports = {
  //secret key for JWT singing and encryption
  "secret" : "super secret passphrase",
  "database" : "mongodb://admin:admin@ds159187.mlab.com:59187/login-register-app",
  'port' : process.env.PORT || 5000
}
