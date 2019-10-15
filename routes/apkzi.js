const {Router} = require('express')
const Apkzi = require('../models/apkzi')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, async (req, res) => {
    
    Apkzi.find().distinct('part', function(error, part) {
        console.log(part)
        res.render('apkzi', {
            title: 'АПКЗИ',
            isApkzi: true,
            part: part
          })
    });
    
    
    
  })

module.exports = router