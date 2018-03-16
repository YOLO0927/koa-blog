module.exports = function (app) {
  app.use(require('./index.js'))
  app.use(require('./signin.js'))
  app.use(require('./signup.js'))
}
