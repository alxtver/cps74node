const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const PKI = require('../models/pki')
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
  const pkis = await PKI.find({serial_number: val.trim()})
  const pcs = await PC.find({serial_number: val.trim()})
  console.log(pcs);
  res.send(JSON.stringify({
    pkis: pkis,
    pcs: pcs
  }))
})


module.exports = router