const {Router} = require('express')
const Pki = require('../models/pki')
const Apkzi = require('../models/apkzi')
const Country = require('../models/country')
const Part = require('../models/part')
const EAN = require('../models/ean')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить ПКИ',
    isAdd: true,
    insertError: req.flash('insertError'),
    part: req.session.part
  })
})

router.post('/', auth, async (req, res) => {
  let serial_number = req.body.serial_number
  if (req.body.ean_code) {
    const ean = await EAN.findOne({ean_code: req.body.ean_code})
    if (!ean) {
      const new_ean = new EAN({
        ean_code: req.body.ean_code,
        type_pki: req.body.type_pki,
        vendor: req.body.vendor,
        model: req.body.model,
        country: req.body.country
      })
      new_ean.save()
    }
    if (req.body.ean_code == '4718390028172') {
      serial_number = serial_number.split(' ').reverse().join(' ')
    }
  }

  if (req.body.vendor == 'Gigabyte' || req.body.vendor == 'GIGABYTE') {
    let regex = /SN\w*/g
    if (serial_number.match(regex)) {
      serial_number = serial_number.match(regex)[0]
    }
    
  }

  const candidate = await Pki.findOne({
    serial_number: serial_number,
    part: req.body.part
  })

  if (!candidate) {
    const pki = new Pki({
      type_pki: req.body.type_pki.trim(),
      vendor: req.body.vendor.trim(),
      model: req.body.model.trim(),
      serial_number: serial_number,
      part: req.body.part.trim(),
      country: req.body.country.trim()
    })

    if (!(await Country.findOne({
        country: req.body.country.trim()
      }))) {
      const country = new Country({
        country: req.body.country.trim()
      })
      try {
        await country.save()
      } catch (error) {
        console.log(error)
      }
    }
  
    if (!(await Part.findOne({
      part: req.body.part.trim()
    }))) {
    const part = new Part({
      part: req.body.part.trim()
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
  } else {
    flashErr = candidate.type_pki + ' с таким серийным номером существует в ' + candidate.part
    req.flash('insertError', flashErr)
    res.redirect('/add')
  }

  
})


router.get('/apkzi', auth, (req, res) => {
  res.render('add_apkzi', {
    title: 'Добавить АПКЗИ',
    isApkzi: true,
    part: req.session.part
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