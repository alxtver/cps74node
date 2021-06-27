module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    let group = req.session.group
    if (group === 'admins') {
      res.locals.admin = 'admins'
    }
    if (group === 'sp') {
      res.locals.sp = 'sp'
    }
    //res.locals.group = req.session.group === 'admins'
    next()
}
