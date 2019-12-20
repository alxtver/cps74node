const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const Pki = require('../models/pki')
const EAN = require('../models/ean')
const PC = require('../models/pc')
const APKZI = require('../models/apkzi')
const User = require('../models/user')
const path = require('path')
const fs = require('fs')


router.get('/', auth, async (req, res) => {
  let args_devel = {
    title: 'Оборудование',
    isEquipment: true,
    part: req.session.part
  }
  res.render('equipment', args_devel)
})


router.get('/add', auth, (req, res) => {
  res.render('add_eq', {
    title: 'Добавить оборудование',
    part: req.session.part
  })
})


router.get('/load', auth, async (req, res) => {
  const eans = await EAN.find().limit(50).sort({
    created: -1
  })

  res.send(JSON.stringify({
    eans: eans
  }))
})


router.post('/add', auth, async (req, res) => {
  const ean_code = req.body.ean_code
  const type_pki = req.body.type_pki
  const vendor = req.body.vendor
  const model = req.body.model
  const country = req.body.country
  const sp_unit = req.body.sp_unit
  const sp_unit1 = req.body.sp_unit1

  const oldEan = await EAN.findOne({
    ean_code: ean_code
  })
  if (!oldEan) {
    const new_ean = new EAN({
      ean_code: ean_code,
      type_pki: type_pki,
      vendor: vendor,
      model: model,
      country: country,
      sp_unit: sp_unit,
      sp_unit1: sp_unit1
    })
    await new_ean.save()
  }
  let pkis = Pki.find({
    ean_code: ean_code
  })
  for (const pki of pkis) {
    if (!pki.sp_unit || pki.sp_unit.length < 1) {
      pki.sp_unit = sp_unit1
      pki.save()
    }
  }
  res.redirect('/equipment')
})


router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const ean = await EAN.findById(req.params.id)

  res.render('eq-edit', {
    title: `Редактировать ${ean.type_pki}`,
    part: req.session.part,
    ean
  })
})


router.post('/edit', auth, async (req, res) => {
  const ean_code = req.body.ean_code
  const type_pki = req.body.type_pki
  const vendor = req.body.vendor
  const model = req.body.model
  const country = req.body.country
  const sp_unit = req.body.sp_unit
  const sp_unit1 = req.body.sp_unit1

  //console.log(req.body.sp_unit1.length);
  if (req.body.sp_unit1) {
    await EAN.findOneAndUpdate({ean_code: ean_code}, req.body)
  } else {
    await EAN.findOneAndUpdate({ean_code: ean_code},
       {
         ean_code: ean_code,
         type_pki: type_pki,
         vendor: vendor,
         model: model,
         country: country,
         sp_unit: sp_unit,
         sp_unit1: ''
       })
  }
  
  //await EAN.findOneAndUpdate({ean_code: ean_code}, req.body)
  let ean = await EAN.findOne({ean_code: ean_code})
  let pkis = await Pki.find({part: req.session.part,ean_code: ean.ean_code})

  for (const pki of pkis) {
    let sp_units = []
    if (!pki.viborka) {
      for (let i = 0; i < ean.sp_unit1.length; i++) {
        let pki_unit
        for (const unit of pki.sp_unit) {
          if (unit.name == ean.sp_unit1[i].name) {
            pki_unit = unit
            break
          }
        }
        if (pki_unit) {
          sp_units.push(pki_unit)
        } else {
          sp_units.push({
            i: i,
            name: ean.sp_unit1[i].name,
            vendor: ean.sp_unit1[i].vendor,
            model: ean.sp_unit1[i].model,
            quantity: ean.sp_unit1[i].quantity,
            serial_number: ean.sp_unit1[i].serial_number,
            szz2: ean.sp_unit1[i].szz2
          })
        }
      }
    } else {
      for (let i = 0; i < ean.sp_unit.length; i++) {
        let pki_unit
        for (const unit of pki.sp_unit) {
          if (unit.name == ean.sp_unit[i].name) {
            pki_unit = unit
            break
          }
        }
        if (pki_unit) {
          sp_units.push(pki_unit)
        } else {
          sp_units.push({
            i: i,
            name: ean.sp_unit[i].name,
            vendor: ean.sp_unit[i].vendor,
            model: ean.sp_unit[i].model,
            quantity: ean.sp_unit[i].quantity,
            serial_number: ean.sp_unit[i].serial_number,
            szz2: ean.sp_unit[i].szz2
          })
        }
      }
    }
    pki.sp_unit = sp_units
    pki.save()
  }

  res.redirect('/equipment')
})


router.get('/sp_unit', auth, async (req, res) => {
  const ean = await EAN.findById(req.query.id)
  if (ean.sp_unit && ean.sp_unit.length > 0) {
    res.send(ean)
  } else {
    res.sendStatus(200)
  }
})


router.get("/search", auth, async (req, res) => {
  if (req.query.q == 'null') {
    const eans = await EAN.find().limit(50).sort({
      created: -1
    })
    res.send(JSON.stringify({
      eans: eans
    }))
  } else {
    const eans = await EAN.find({
      ean_code: req.query.q
    })
    if (eans) {
      res.send(JSON.stringify({
        eans: eans
      }))
    } else {
      res.sendStatus(200)
    }
  }
})


router.get('/autocomplete', auth, async (req, res) => {
  const types = await EAN.find().distinct('type_pki')
  const vendors = await EAN.find().distinct('vendor')
  const countrys = await EAN.find().distinct('country')
  res.send(JSON.stringify({
    types: types,
    vendors: vendors,
    countrys: countrys
  }))
})


module.exports = router