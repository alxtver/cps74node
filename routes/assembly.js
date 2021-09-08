const {
  Router
} = require('express')
const PC = require('../models/pc')
const auth = require('../middleware/auth')
const User = require('../models/user')
const SystemCase = require('../models/systemCase')
const router = Router()


router.get('/', auth, async (req, res) => {
  res.render('assembly', {
    title: 'Сборка',
    isAssembly: true,
    part: req.session.part,
    userName: req.session.user.username
  })
})


router.post('/pc', auth, async (req, res) => {
  const pcs = await PC.find({
    part: req.session.part
  }).sort({
    'created': 1
  })
  res.send(JSON.stringify(pcs))
})

router.get('/serialNumbers', auth, async (req, res) => {
  const systemCases = await SystemCase.find({
    part: req.session.part
  }).distinct('serialNumber')
  res.send(JSON.stringify(systemCases))
})

router.get('/currentSystemCase', auth, async (req, res) => {
  const username = req.session.user.username
  const serialNumbers = await SystemCase.find({
    part: req.session.part
  }).distinct('serialNumber')
  const firstSN = serialNumbers[0]
  const lastSN = serialNumbers[serialNumbers.length - 1]
  const user = await User.findOne({
    username: username
  })
  let currentSystemCase
  if (user.lastAssemblyPC && serialNumbers.includes(user.lastAssemblyPC)) {
    currentSystemCase = await SystemCase.findOne({
      part: req.session.part,
      serialNumber: user.lastAssemblyPC
    }).sort({
      created: 1
    })
  } else {
    currentSystemCase = await SystemCase.findOne({
      part: req.session.part
    }).sort({
      created: 1
    })
  }
  res.send(JSON.stringify({
    currentSystemCase,
    firstSN,
    lastSN
  }))
})

router.get('/getSystemCase/:serialNumber', auth, async (req, res) => {
  await User.updateOne({
    username: req.session.user.username
  }, {
    lastAssemblyPC: req.params.serialNumber
  })
  const systemCase = await SystemCase.findOne({
    part: req.session.part,
    serialNumber: req.params.serialNumber
  })
  res.send(JSON.stringify(systemCase))
})

router.post('/getPCById', auth, async (req, res) => {
  const pc = await PC.findById(req.body.id)
  res.send(JSON.stringify(pc))
})


module.exports = router
