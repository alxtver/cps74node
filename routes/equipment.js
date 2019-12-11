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
  const eans = await EAN.find().limit(50).sort({created: -1})
  
  res.send(JSON.stringify({eans: eans}))
})


router.post('/add', auth, async (req, res) => {
  const ean_code = req.body.ean_code
  const type_pki = req.body.type_pki
  const vendor = req.body.vendor
  const model = req.body.model
  const country = req.body.country
  const sp_unit = req.body.sp_unit
  const sp_unit1 = req.body.sp_unit1

  const oldEan = await EAN.findOne({ean_code: ean_code})
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
    new_ean.save()

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
	console.log(req.body)
  const ean_code = req.body.ean_code
  const type_pki = req.body.type_pki
  const vendor = req.body.vendor
  const model = req.body.model
  const country = req.body.country
  const sp_unit = req.body.sp_unit
  const sp_unit1 = req.body.sp_unit1
  ean = await EAN.findOneAndUpdate({ean_code: ean_code}, req.body)
	res.redirect('/equipment')
})


router.get('/sp_unit', auth, async (req, res) => {
  console.log(req.query.id);
  const ean = await EAN.findById(req.query.id)
  if (ean.sp_unit && ean.sp_unit.length > 0) {
    res.send(ean)
  } else {
    res.sendStatus(200)
  }	
})


router.get("/search", auth, async (req, res) => {
  console.log(req.query.q);
  if (req.query.q == 'null') {
    const eans = await EAN.find().limit(50).sort({created: -1})
    res.send(JSON.stringify({eans: eans}))
  } else {
    const eans = await EAN.find({ean_code: req.query.q})  
    if (eans) {    
      res.send(JSON.stringify({eans: eans}))
    } else {
      res.sendStatus(200)
    }
  }  
})


module.exports = router