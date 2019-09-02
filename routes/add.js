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
  const pki = new Pki({
    type_pki: req.body.type_pki,
    vendor: req.body.vendor,
    model: req.body.model,
    serial_number: req.body.serial_number,
    img: req.body.img
  })

  try {
    await pki.save()
    res.redirect('/pki')
  } catch (e) {
    console.log(e)   
  }  
})

module.exports = router