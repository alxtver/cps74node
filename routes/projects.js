const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('projects', {
    title: 'Проекты',
    isProjects: true,    
  })
})


module.exports = router