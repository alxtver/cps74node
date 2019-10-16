const {Router} = require('express')
const Apkzi = require('../models/apkzi')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, async (req, res) => {
  Apkzi.find().distinct('part', function (error, part) {
    res.render('apkzi', {
      title: 'АПКЗИ',
      isApkzi: true,
      part: part
    })
  })
})


router.post("/search", auth, async (req, res) => {
  apkzi = await Apkzi.find({part: req.body.part}).sort([['created', -1] ])
  let query = {
    $or: [{
        zav_number: new RegExp(req.body.q + '.*', "i")
      },
      {
        kontr_zav_number: new RegExp(req.body.q + '.*', "i")
      }
    ]
  }
  res.send(JSON.stringify(apkzi))
})


router.post('/edit_ajax', auth, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400)
    await Apkzi.findByIdAndUpdate(req.body.id, req.body)
    res.sendStatus(200)    
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const apkzi = await Apkzi.findById(req.params.id)
  res.render('apkzi-edit', {
    title: `Редактировать ${apkzi.zav_number}`,
    apkzi
  })
})

router.post('/edit', auth, async (req, res) => {
  const apkzi = await Apkzi.findByIdAndUpdate(req.body.id, req.body)
  await Apkzi.find().distinct('part', function (error, part) {
    res.render('apkzi', {
      title: 'АПКЗИ',
      isApkzi: true,
      part: part,
      apkzi_part: apkzi.part
    })
  })
})

router.post('/del', auth, async (req, res) => {
  const part = req.body.part
  try {    
    await Apkzi.deleteOne({_id: req.body.id})
    res.send(part)
  } catch (e) {
    console.log(e)
    res.send(part)
  }  
})

// router.post('/del', auth, async (req, res) => {
//   try {
//     const apkzi = await Apkzi.findById(req.body.id)
//     await Apkzi.deleteOne({_id: req.body.id})
//     if (apkzi) {
//       await Apkzi.find().distinct('part', function (error, part) {
//         res.render('apkzi', {
//           title: 'АПКЗИ',
//           isApkzi: true,
//           part: part,
//           apkzi_part: apkzi.part
//         })
//       })
//     } else {
//       res.redirect('/apkzi')
//     }
    
//   } catch (error) {
//     console.log(error)
//   }
  
// })

module.exports = router