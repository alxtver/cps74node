const {Router} = require('express')
const Pki = require('../models/pki')
const router = Router()

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Добавить ПКИ',
    isAdd: true
  })
})

router.post('/', async (req, res) => {
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

  try {
    await pki.save()
    res.redirect('/pkis')
  } catch (e) {
    console.log(e)   
  }  
})

module.exports = router