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
  let ean
  let ruLetter = false
  
  //Проверка на русские символы в серийнике
  for (const letter of serial_number) {
    let x = letter.charCodeAt(0)
    if (x > 122) {
      ruLetter = true      
      break
    }
  }

  if (ruLetter) {
    flashErr = 'Смените раскладку клавиатуры'
    req.flash('insertError', flashErr)
    res.redirect('/add')
  } else {  
  if (req.body.ean_code) {
    ean = await EAN.findOne({ean_code: req.body.ean_code})
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
      console.log(`PKI ${pki.type_pki} ${pki.vendor} ${pki.model} ${pki.serial_number} added to DB`)
      res.redirect('/add')
    } catch (e) {
      console.log(e)
    }
  } else {
    flashErr = candidate.type_pki + ' с таким серийным номером существует в ' + candidate.part
    req.flash('insertError', flashErr)
    res.redirect('/add')
  }

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
    console.log(`APKZI ${apkzi.apkzi_name} ${apkzi.kont_name} ${apkzi.zav_number} ${apkzi.kontr_zav_number} added to DB`)
    res.redirect('/add/apkzi')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router