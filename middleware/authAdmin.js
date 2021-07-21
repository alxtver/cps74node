module.exports = function (req, res, next) {
    if (req.session.user.username !== 'Kalinin') {
      return res.redirect('/')
    }
    next()
  }
