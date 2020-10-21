const {
  Router
} = require('express')
const PC = require('../models/pc')
const PKI = require('../models/pki')
const APKZI = require('../models/apkzi')
const Part = require('../models/part')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router()
const snReModifer = require('./foo/snReModifer')

router.get('/', auth, async (req, res) => {
  res.render('assembly', {
    title: 'Сборка',
    isAssembly: true,
    part: req.session.part,
    userName: req.session.user.username
  })
})


router.post('/pc', auth, async (req, res) => {
  const pcs = await PC.find({part: req.session.part}).sort({'created': 1})
  res.send(JSON.stringify(pcs))
})

router.post('/serialNumbers', auth, async (req, res) => {
  const pcs = await PC.find({part: req.session.part}).distinct('serial_number')
  res.send(JSON.stringify(pcs))
})

router.post('/firstPC', auth, async (req, res) => {
  const username = req.session.user.username
  const serialNumbers = await PC.find({
    part: req.session.part
  }).distinct('serial_number')
  const firstSN = serialNumbers[0]
  const lastSN = serialNumbers[serialNumbers.length - 1]
  const user = await User.findOne({
    username: username
  })
  let firstPC
  if (user.lastAssemblyPC && serialNumbers.includes(user.lastAssemblyPC)) {
    firstPC = await PC.findOne({
      part: req.session.part,
      serial_number: user.lastAssemblyPC
    }).sort({
      created: 1
    })
  } else {
    firstPC = await PC.findOne({
      part: req.session.part
    }).sort({
      created: 1
    })
  }
  res.send(JSON.stringify({
    firstPC: firstPC,
    firstSN: firstSN,
    lastSN: lastSN
  }))
})

router.post('/getPC', auth, async (req, res) => {
  const pc = await PC.findOne({
    part: req.session.part,
    serial_number: req.body.serialNumberPC
  })
  res.send(JSON.stringify(pc))
})

router.post('/getPCById', auth, async (req, res) => {
  const pc = await PC.findById(req.body.id)
  res.send(JSON.stringify(pc))
})

router.post('/setLastPC', auth, async (req, res) => {
  await User.updateOne({
    username: req.session.user.username
  }, {
    lastAssemblyPC: req.body.serialNumber
  })
  res.status(200).json({
    message: 'ok'
  })
})


module.exports = router