function componentOneRoutes() {
  const ctrl = require('./user.controller')

  return (open, closed) => {
    open.route('/login').post(ctrl.login)
    open.route('/signUp').post(ctrl.signUp)
  }
}

module.exports = componentOneRoutes()
