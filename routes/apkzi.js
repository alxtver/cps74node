const {Router} = require('express')
const Apkzi = require('../models/apkzi')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, async (req, res) => {
    Apkzi.find().distinct('part', function(error, part) {
        res.render('apkzi', {
            title: 'АПКЗИ',
            isApkzi: true,
            part: part
          })
    })
  })

router.post("/search", auth, async (req, res) => {
  apkzi = await Apkzi.find().sort([['created', -1]])
  res.send(JSON.stringify(apkzi))
  })

module.exports = router