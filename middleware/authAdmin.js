module.exports = function (req, res, next) {
    if (req.session.user.group !== 'admins') {
      return res.redirect('/')
    }
    next()
  }
