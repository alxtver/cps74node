const {Router} = require('express')
const Pki = require('../models/pki')
const PC = require('../models/pc')
const Part = require('../models/part')
const EAN = require('../models/ean')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, async (req, res) => {  
  res.render('pkis', {
    title: 'ПКИ',
    isPkis: true,
    
  })
})

router.post('/', auth, async (req, res) => {
  res.render('pkis', {
    title: 'ПКИ',
    isPkis: true
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const pki = await Pki.findById(req.params.id)
  res.render('pki-edit', {
    title: `Редактировать ${pki.type_pki}`,
    pki
  })
})

// router.post('/del', auth, async (req, res) => {
//   try {
//     await Pki.deleteOne({
//       _id: req.body._id
//     })
//     res.redirect('/pkis')
//   } catch (e) {
//     console.log(e)
//   }
// })

// router.get('/:id/del', auth, async (req, res) => {
//   if (!req.query.allow) {
//     return res.redirect('/')
//   }
//   const pki = await Pki.deleteOne({
//     _id: req.params.id
//   })
//   res.redirect('/pkis')
// })

router.post('/edit', auth, async (req, res) => {
  await Pki.findByIdAndUpdate(req.body._id, req.body)
  res.redirect('/pkis')
})

router.post('/edit_ajax', auth, async (req, res) => {
  try {
    
    await Pki.findByIdAndUpdate(req.body.id, req.body)
    res.sendStatus(200)

    if (!req.body) return res.sendStatus(400);
  } catch (error) {
    console.log(error)
  }  
})

router.post("/search", auth, async (req, res) =>  {
  let selected = ''
  if (req.body.selected != '...') {
    selected = req.body.selected
  }
  if (!req.body.q && !req.body.selected) {
    pkis = await Pki.find().sort([['created', -1]]).limit(100)
  } else if (req.body.q == 'null') {
    pkis = await Pki.find({'part': selected}).sort([['created', -1]])
  }else if(selected == ''){
    let query = {
      $or: [{
        type_pki: new RegExp(req.body.q + '.*', "i")
      },
      {
        vendor: new RegExp(req.body.q + '.*', "i")
      },
      {
        country: new RegExp(req.body.q + '.*', "i")
      },
      {
        model: new RegExp(req.body.q + '.*', "i")
      },
      {
        part: new RegExp(req.body.q + '.*', "i")
      },
      {
        serial_number: new RegExp(req.body.q + '.*', "i")
      },
      {
        number_machine: new RegExp(req.body.q + '.*', "i")
      }
    ]}
  pkis = await Pki.find(query).sort([['created', -1]])
    
  } else {
    query = {
      $and:[
        {$or: [{
          type_pki: new RegExp(req.body.q + '.*', "i")
        },
        {
          vendor: new RegExp(req.body.q + '.*', "i")
        },
        {
          country: new RegExp(req.body.q + '.*', "i")
        },
        {
          model: new RegExp(req.body.q + '.*', "i")
        },
        {
          part: new RegExp(req.body.q + '.*', "i")
        },
        {
          serial_number: new RegExp(req.body.q + '.*', "i")
        },
        {
          number_machine: new RegExp(req.body.q + '.*', "i")
        }
      ]},
        {part: selected}
      ]
      
    }
    pkis = await Pki.find(query).sort([['created', -1]])
  } 

  res.send(JSON.stringify(pkis)); // отправляем пришедший ответ обратно
})


router.post("/part", auth, async function (req, res) {
  parts = await Part.find()  
  if (!req.body) return res.sendStatus(400)
  res.send(JSON.stringify(parts)) // отправляем пришедший ответ обратно
})


router.post("/del", auth, async (req, res) => {  
  const part = req.body.part
  let pki = await Pki.findById(req.body.id)
  if (pki.number_machine) {
    let pc = await PC.findOne({part: pki.part, serial_number: pki.number_machine})
    if (pc) {
      let unit = 'pc_unit'
    for (let i in pc[unit]) {
      if (pki.serial_number == pc[unit][i].serial_number){
        pc[unit][i].serial_number = ''
        pc[unit][i].name = ''
        break
      }
    }
    unit = 'system_case_unit'
    for (let i in pc[unit]) {      
      if (pki.serial_number == pc[unit][i].serial_number){
        pc[unit][i].serial_number = ''
        pc[unit][i].name = ''
        break
      }
    }    
    }
    let pc_copy = await PC.findOne({part: pki.part, serial_number: pki.number_machine})
    pc_copy.pc_unit = pc.pc_unit
    pc_copy.system_case_unit = pc.system_case_unit
    pc_copy.save()
  }
  try {    
    await Pki.deleteOne({_id: req.body.id})
    res.send(part)
  } catch (e) {
    console.log(e)
    res.send(part)
  }  
})

router.post("/searchEAN", auth, async function (req, res) {
  const ean = await EAN.findOne({ean_code: req.body.valueEAN})
  if (!ean) return res.sendStatus(400)
  res.send(JSON.stringify(ean)) // отправляем пришедший ответ обратно
})


module.exports = router