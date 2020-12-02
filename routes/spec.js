const {
  Router
} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const PC = require('../models/pc')


router.get('/', auth, (req, res) => {
  res.render('spec', {
    title: 'temp',
    isEquipment: true,
    part: req.session.part
  })
})

router.post('/getSerials', auth, async (req, res) => {
  const serials = await PC.find({
    part: req.session.part
  }).sort({
    'created': 1
  })
  res.send(JSON.stringify({
    serials: serials,
  }))
})

router.post('/getSpec', auth, async (req, res) => {

  let allPCinTheme
  await PC.countDocuments({
    part: req.session.part
  }, function (err, count) {
    allPCinTheme = count
  });
  const from = req.body.fromValue.split(';')
  const to = req.body.toValue.split(';')
  const indexfromValue = Number(from[0])
  const indextoValue = Number(to[0])
  const countPC = indextoValue - indexfromValue + 1
  if (countPC < 1) {
    res.send(JSON.stringify({
      message: 'wrong range!!!',
    }))
  } else {
    const pcs = await PC.find({
      part: req.session.part
    }).sort({
      'created': 1
    }).skip(indexfromValue).limit(countPC)
    let spec = {}
    if (req.body.checkBox) {
      for (const pc of pcs) {
        if (pc.pc_unit) {
          for (const unit of pc.pc_unit) {
            const type = unit.type
            const name = (unit.name == 'Н/Д') ? '' : unit.name
            const pki = type + ' ' + name
            if (spec[pki]) {
              spec[pki] += 1
            } else {
              spec[pki] = 1
            }
          }
        }
        if (pc.system_case_unit) {
          for (const unit of pc.system_case_unit) {
            const type = unit.type
            const name = (unit.name == 'Н/Д') ? '' : unit.name
            const pki = type + ' ' + name
            if (spec[pki]) {
              spec[pki] += 1
            } else {
              spec[pki] = 1
            }
          }
        }
      }
    } else {
      for (const pc of pcs) {
        if (pc.pc_unit) {
          for (const unit of pc.pc_unit) {
            const type = unit.type
            const name = (unit.name == 'Н/Д') ? '' : unit.name
            const pki = type + ' ' + name
            if (spec[pki]) {
              spec[pki] += 1
            } else {
              spec[pki] = 1
            }
          }
        } else {
          if (spec['Системный блок']) {
            spec[pki] += 1
          } else {
            spec['Системный блок'] = 1
          }
        }
      }
    }

    res.send(JSON.stringify({
      message: 'ok',
      spec: spec,
      countPC: countPC,
      checkBox: req.body.checkBox
    }))
  }
})

module.exports = router