const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.get('/', authAdmin, async (req, res) => {
    if (req.session.user.group == 'admins'){
        res.render('logs', {
            title: 'Логи',
            isLogin: true
        })
    } else {
        res.redirect('/')
    }
})


module.exports = router