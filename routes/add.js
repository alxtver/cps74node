const {
  Router
} = require('express')
const Pki = require('../models/pki')
const Apkzi = require('../models/apkzi')
const Country = require('../models/country')
const Part = require('../models/part')
const EAN = require('../models/ean')
const LOG = require('../models/logs')
const auth = require('../middleware/auth')
const router = Router()
const snModifer = require('./foo/snModifer')

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
  let vendor = req.body.vendor
  let ean
  let eanCode = req.body.ean_code
  let typePki = req.body.type_pki

  if (req.body.ean_code) {
    ean = await EAN.findOne({
      ean_code: req.body.ean_code
    })
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
  }
  // модифицирование серийников в зависимости от условий
  let snMod = snModifer(serial_number, vendor, eanCode, typePki)
  serial_number = snMod.SN
  let flashErr = snMod.flash

  const candidate = await Pki.findOne({
    serial_number: serial_number,
    part: req.body.part
  })

  let pki
  if (!candidate) {
    if (ean && ean.sp_unit1) {
      pki = new Pki({
        type_pki: req.body.type_pki.trim(),
        vendor: req.body.vendor.trim(),
        model: req.body.model.trim(),
        serial_number: serial_number,
        part: req.body.part.trim(),
        country: req.body.country.trim(),
        ean_code: req.body.ean_code.trim(),
        sp_unit: ean.sp_unit1
      })

    } else {
      pki = new Pki({
        type_pki: req.body.type_pki.trim(),
        vendor: req.body.vendor.trim(),
        model: req.body.model.trim(),
        serial_number: serial_number,
        part: req.body.part.trim(),
        country: req.body.country.trim(),
        ean_code: req.body.ean_code.trim()
      })
    }

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
      const note = `PKI type - ${pki.type_pki}, vendor - ${pki.vendor}, model - ${pki.model}, SN - ${pki.serial_number}, added to DB`
      console.log(note)

      let log = new LOG({
        event: 'add pki',
        note: note,
        user: req.session.user.username,
        part: req.session.part
      })
      log.save()
      req.flash('insertError', flashErr)
      res.send(JSON.stringify({
        status: 'ok',
        flashErr: flashErr
      }))
    } catch (e) {
      console.log(e)
    }
  } else {
    flashErr = candidate.type_pki + ' с таким серийным номером существует в ' + candidate.part
    req.flash('insertError', flashErr)
    res.send(JSON.stringify({
      status: 'snExists',
      flashErr: flashErr
    }))
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
  console.log(req.body);
  const findApkzi = await Apkzi.find({
    part: req.body.part,
    kontr_zav_number: req.body.kontr_zav_number
  })
  if (findApkzi.length != 0) {
    res.status(200).json({
      message: 'ok'
    })
  } else {
    const apkzi = new Apkzi({
      fdsi: req.body.fdsi,
      apkzi_name: req.body.apkzi_name,
      kont_name: req.body.kont_name,
      fdsiKontr: req.body.fdsiKontr,
      zav_number: req.body.zav_number,
      kontr_zav_number: req.body.kontr_zav_number,
      part: req.body.part
    })
    try {
      await apkzi.save()
      let note = `APKZI ${apkzi.apkzi_name} ${apkzi.kont_name} заводской номер - ${apkzi.zav_number}, номер контроллера - ${apkzi.kontr_zav_number} added to DB`
      console.log(note)
      let log = new LOG({
        event: 'add APKZI',
        note: note,
        user: req.session.user.username,
        part: req.session.part
      })
      log.save()
      // res.redirect('/add/apkzi')
      res.status(200).json({
        message: 'ok'
      })
    } catch (e) {
      console.log(e)
    }
  }
})

module.exports = router