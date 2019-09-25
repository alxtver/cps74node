const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('projects', {
    title: 'Проекты',
    isProjects: true
  })
})


module.exports = router