const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const PKI = require('../models/pki')
const PC = require('../models/pc')
const APKZI = require('../models/apkzi')
const User = require('../models/user')
const path = require('path')
const fs = require('fs')

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
    countPKIinYear: countPKIinYear,
    part: req.session.part
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

router.post("/insert_part_session", async function (req, res) {
  
  await User.findByIdAndUpdate(req.session.user._id, {lastPart: req.body.selectedItem})
  req.session.part = req.body.selectedItem
  res.sendStatus(200)
})

router.get('/script', authAdmin, async (req, res) => {
  //  скрипт для удаления PC по партии
  // PC.deleteMany({ part: 'АСО МСК' }, function (err) {
  //   if (err) {
  //     return handleError(err)
  //   } else {
  //     res.send('Скрипт отработал!')
  //   }    
  // })


  // скрипт импорта ПКИ из CSV файла
  // const appDir = path.dirname(require.main.filename)
  // const docDir = appDir + '/public/'
  // let fileContent = fs.readFileSync(docDir + '/base.csv', "utf8")
  // for (const pki of fileContent.split(';;')) {
  //   type = pki.split(';')[1]
  //   vendor = pki.split(';')[2]
  //   model = pki.split(';')[3]
  //   serial_number = pki.split(';')[4]
  //   part = 'ЛОТ 10,11(2020)'
  //   const pkiNew = new PKI({
  //     type_pki: type,
  //     vendor: vendor,
  //     model: model,
  //     serial_number: serial_number,
  //     part: part,
  //     country: 'Китай'
  //   })
  //   console.log(type + ' ' + vendor + ' ' + model + ' ' + serial_number);
  //   await pkiNew.save()
  // }

  res.send('Скрипт отработал!')
})

module.exports = router