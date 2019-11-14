module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    //res.locals.part = req.part()
    res.locals.group = req.session.group === 'admins'
    next()
}