const {Router} = require('express')
const Pki = require('../models/pki')
const Apkzi = require('../models/apkzi')
const Country = require('../models/country')
const Part = require('../models/part')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить ПКИ',
    isAdd: true
  })
})

router.post('/', auth, async (req, res) => {
  if (req.body.in_case == 'true') {
    var in_case = req.body.in_case
  } else {
    var in_case = 'false'
  }
  const pki = new Pki({
    type_pki: req.body.type_pki,
    vendor: req.body.vendor,
    model: req.body.model,
    serial_number: req.body.serial_number,
    part: req.body.part,
    country: req.body.country,
    in_case: in_case
  })

  if (!(await Country.findOne({
      country: req.body.country
    }))) {
    const country = new Country({
      country: req.body.country
    })
    try {
      await country.save()
    } catch (error) {
      console.log(error)
    }
  }

  if (!(await Part.findOne({
    part: req.body.part
  }))) {
  const part = new Part({
    part: req.body.part
  })
  try {
    await part.save()
  } catch (error) {
    console.log(error)
  }
  }

  try {
    await pki.save()
    res.redirect('/add')
  } catch (e) {
    console.log(e)
  }
})


router.get('/apkzi', auth, (req, res) => {
  res.render('add_apkzi', {
    title: 'Добавить АПКЗИ',
    isApkzi: true
  })
})


router.post('/apkzi', auth, async (req, res) => {
  const apkzi = new Apkzi({
    fdsi: req.body.fdsi,
    apkzi_name: req.body.apkzi_name,
    kont_name: req.body.kont_name,
    zav_number: req.body.zav_number,
    kontr_zav_number: req.body.kontr_zav_number,
    part: req.body.part
  })

  try {
    await apkzi.save()
    res.redirect('/add/apkzi')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router