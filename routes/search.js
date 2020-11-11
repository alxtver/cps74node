const {
  Router,
  query
} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const PKI = require('../models/pki')
const APKZI = require('../models/apkzi')
const PC = require('../models/pc')
const User = require('../models/user')


router.get('/', auth, async (req, res) => {
  let args_devel = {
    title: 'Поиск',
    isSearch: true,
  }
  res.render('searchPKI', args_devel)
})


router.post('/searchPKI', auth, async (req, res) => {
  const val = req.body.val
  const pcs = await PC.find({
    serial_number: val.trim()
  })
  if (pcs.length > 0) {
    res.send(JSON.stringify({
      pcs: pcs,
      pkis: false,
      apkzis: false
    }))
    return false
  }
  const apkzis = await APKZI.find({
    $or: [{
        kontr_zav_number: val.trim()
      },
      {
        zav_number: val.trim()
      }
    ]
  })
  if (apkzis.length == 1 && apkzis[0].number_machine) {
    const pcs = await PC.find({
      serial_number: apkzis[0].number_machine
    })
    res.send(JSON.stringify({
      pcs: pcs,
      pkis: false,
      apkzis: apkzis
    }))
    return false
  } else if (apkzis.length > 1) {
    res.send(JSON.stringify({
      apkzis: apkzis,
      pcs: false,
      pkis: false,
    }))
    return false
  }
  const pkis = await PKI.find({
    serial_number: val.trim()
  })
  if (pkis.length == 1 && pkis[0].number_machine) {
    const pcs = await PC.find({
      serial_number: pkis[0].number_machine
    })
    res.send(JSON.stringify({
      pkis: pkis,
      pcs: pcs,
      apkzis: false
    }))
    return false
  } else if (pkis.length > 1) {
    res.send(JSON.stringify({
      pkis: pkis,
      pcs: false,
      apkzis: false
    }))
    return false
  }
  res.send(JSON.stringify({
    message: 'not found'
  }))
})


module.exports = router