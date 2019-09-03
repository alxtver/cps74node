const {Router} = require('express')
const Pki = require('../models/pki')
const router = Router()

router.get('/', async (req, res) => {
  const pkis = await Pki.find()  
  res.render('pkis', {
    title: 'ПКИ',
    isPkis: true,
    pkis
  })
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const pki = await Pki.findById(req.params.id)
  res.render('pki-edit', {
    title: `Редактировать ${pki.type_pki}`,
    pki
  })
})

router.post('/del', async(req, res) => {
  try {
    await Pki.deleteOne({_id: req.body._id})    
    res.redirect('/pkis')
  } catch (e) {
    console.log(e)
  }  
})

router.get('/:id/del', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const pki = await Pki.deleteOne({_id: req.params.id})
  res.redirect('/pkis')
})

router.post('/edit', async (req, res) => {
  if (req.body.in_case) {
    req.body.in_case = 'true'
    await Pki.findByIdAndUpdate(req.body._id, req.body)
  } else {
    req.body.in_case = 'false'
    await Pki.findByIdAndUpdate(req.body._id, req.body)
  }
  
  console.log(req.body)
  res.redirect('/pkis')
})

router.get('/:id', async (req, res) => {
  const pki = await Pki.findById(req.params.id)
  res.render('pki', {
    layout: 'empty',
    type_pki: `ПКИ ${pki.type_pki}`,
    pki
  })
})

module.exports = router