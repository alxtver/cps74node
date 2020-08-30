const {Router} = require('express')
const Apkzi = require('../models/apkzi')
const auth = require('../middleware/auth')
const LOG = require('../models/logs')
const router = Router()


router.get('/', auth, async (req, res) => {  
  Apkzi.find().distinct('part', function (error, part) {
    res.render('apkzi', {
      title: 'АПКЗИ',
      isApkzi: true,
      part: req.session.part
    })
  })
})


router.post("/search", auth, async (req, res) => {  
  let apkzi
  if (req.body.part) {
    apkzi = await Apkzi.find({part: req.body.part}).sort([['created', -1] ])
    req.session.part = req.body.part
  } else {
    apkzi = await Apkzi.find({part: req.session.part}).sort([['created', -1] ])
  }
  res.send(JSON.stringify(apkzi))
})


router.post('/edit_ajax', auth, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400)
    await Apkzi.findByIdAndUpdate(req.body.id, req.body)
    res.status(200).json({ message: 'ok' })    
  } catch (error) {
    console.log(error)
  }
})


router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const apkzi = await Apkzi.findById(req.params.id).lean()
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
    const apkzi = Apkzi.findById(req.body.id)
    let note = `APKZI ${apkzi.apkzi_name} ${apkzi.kont_name} заводской номер - ${apkzi.zav_number}, номер контроллера - ${apkzi.kontr_zav_number} удален`
    console.log(note)
    let log = new LOG({
      event: 'delete APKZI',
      note: note,
      user: req.session.user.username,
      part: req.session.part
    })    
    await Apkzi.deleteOne({_id: req.body.id})
    log.save()
    res.send(JSON.stringify(part))
  } catch (e) {
    console.log(e)
    res.send(JSON.stringify(part))
  }  
})

module.exports = router