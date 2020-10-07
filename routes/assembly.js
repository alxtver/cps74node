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
        title: 'Машины',
        isAssembly: true,
        part: req.session.part,
    })
})

router.post('/serialNumbers', auth, async (req, res) => {
    const serialNumbers = await PC.find({
        part: req.session.part
    }).distinct('serial_number')
    res.send(JSON.stringify(serialNumbers))
})

router.post('/firstPC', auth, async (req, res) => {
    const firstPC = await PC.findOne({
        part: req.session.part
    }).sort({
        created: 1
    })
    res.send(JSON.stringify(firstPC))
})

router.post('/getPC', auth, async (req, res) => {
    const pc = await PC.findOne({
        part: req.session.part,
        serial_number: req.body.serialNumberPC
    })
    res.send(JSON.stringify(pc))
})


module.exports = router