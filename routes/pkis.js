const {Router} = require('express')
const Pki = require('../models/pki')
const router = Router()
const express = require("express");
  
const app = express();

router.get('/', async (req, res) => {
  const pkis = await Pki.find()
  res.render('pkis', {
    title: 'ПКИ',
    isPkis: true,
    pkis
  })
})

router.post('/', async (req, res) => {
  const query = { $or:[
          {type_pki: new RegExp(req.body.search+'.*', "i")},
          {vendor: new RegExp(req.body.search+'.*', "i")},
          {country: new RegExp(req.body.search+'.*', "i")},
          {model: new RegExp(req.body.search+'.*', "i")},
          {part: new RegExp(req.body.search+'.*', "i")},
          {serial_number: new RegExp(req.body.search+'.*', "i")},
          {number_machine: new RegExp(req.body.search+'.*', "i")}
  ]
  }

  const pkis = await Pki.find(query)  
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
  } else {
    req.body.in_case = 'false'
  }
  await Pki.findByIdAndUpdate(req.body._id, req.body)
  res.redirect('/pkis')
})

// router.get('/:id', async (req, res) => {
//   const pki = await Pki.findById(req.params.id)
//   res.render('pki', {
//     layout: 'empty',
//     type_pki: `ПКИ ${pki.type_pki}`,
//     pki
//   })
// })


const jsonParser = express.json();
router.post("/user", jsonParser, async function (req, res) {
  if (!req.body.q) {
    pkis = await Pki.find()  
  } else {
    const query = { $or:[
      {type_pki: new RegExp(req.body.q+'.*', "i")},
      {vendor: new RegExp(req.body.q+'.*', "i")},
      {country: new RegExp(req.body.q+'.*', "i")},
      {model: new RegExp(req.body.q+'.*', "i")},
      {part: new RegExp(req.body.q+'.*', "i")},
      {serial_number: new RegExp(req.body.q+'.*', "i")},
      {number_machine: new RegExp(req.body.q+'.*', "i")}
    ]}
    pkis = await Pki.find(query)  
  }
  // console.log(req.body);
  if(!req.body) return res.sendStatus(400);
 
  res.send(JSON.stringify(pkis)); // отправляем пришедший ответ обратно
});


module.exports = router