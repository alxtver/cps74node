const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const Countries = require('../models/country')


router.get('/', auth, async (req, res) => {
    const allCountrys = await Countries.find()
    let args_devel = {
      title: 'БД Страны',
      isEquipment: true,
      countries: allCountrys
    }
    res.render('countries', args_devel)
  })


router.get('/load', auth, async (req, res) => {
    const allCountrys = await Countries.find()
    res.send(JSON.stringify({countries: allCountrys}))
    })

router.post("/del", auth, async (req, res) => {
    try {
      await Countries.deleteOne({
        _id: req.body.id
      })
      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
     }
    })


router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const country = await Countries.findById(req.params.id).lean()
    console.log(country.country)
    res.render('country-edit', {
        title: country.country,
        country
        })
    })


router.post('/edit', auth, async (req, res) => {  
    await Countries.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/countries')
    })


module.exports = router