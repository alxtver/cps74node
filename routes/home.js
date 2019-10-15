const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
  res.render('index', {
    title: 'Главная страница',
    isHome: true
  })
})


module.exports = router