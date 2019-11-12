const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const PKI = require('../models/pki')
const PC = require('../models/pc')
const APKZI = require('../models/apkzi')

router.get('/', auth, async (req, res) => {
  countPKI = await PKI.countDocuments()
  countPC = await PC.countDocuments()
  let dateNow = new Date()  
  let newYear = Date.parse(dateNow.getFullYear())  
  countPCinYear = await PC.find({created: {$gt: newYear}}).count()


  
  
  res.render('index', {
    title: 'Главная страница',
    isHome: true,
    countPKI: countPKI,
    countPC: countPC,
    countPCinYear: countPCinYear
  })
})


module.exports = router