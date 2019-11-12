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
  let nowYear = Date.parse(dateNow.getFullYear())  
  countPCinYear = await PC.countDocuments({created: {$gt: nowYear}})
  countPKIinYear = await PKI.countDocuments({created: {$gt: nowYear}})

  
  
  res.render('index', {
    title: 'Главная страница',
    isHome: true,
    countPKI: countPKI,
    countPC: countPC,
    countPCinYear: countPCinYear,
    countPKIinYear: countPKIinYear
  })
})

router.post('/diagram', auth, async (req, res) => {  
  
  PC.find().distinct('part', async function (error, parts) {
    if (error) {
      res.sendStatus(400)
      }
    let arr = [['Проект', 'Процентное отношение']]
    for (const part of parts) {
      let count = await PC.countDocuments({part: part})
      arr.push([part, count])
    }
    res.send(arr)
  })
  
})


module.exports = router