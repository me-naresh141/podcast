let User = require('../modals/user')
module.exports = {
  isUserloged: (req, res, next) => {
    if (req.session && req.session.userId) {
      next()
    } else {
      res.redirect('/users/login')
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId
    if (userId) {
      User.findById(userId, 'name profileImage', (err, user) => {
        if (err) return next(err)
        req.user = user
        res.locals.user = user
        next()
      })
    } else {
      req.user = null
      res.locals.user = null
      next()
    }
  },
}
