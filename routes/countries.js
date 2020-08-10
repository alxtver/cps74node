const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const Countries = require('../models/country')
const fetch = require('node-fetch')


router.get('/', auth, async (req, res) => {
    const allCountrys = await Countries.find()
    let args_devel = {
      title: 'БД Страны',
      isEquipment: true,
      countries: allCountrys,
      part: req.session.part
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
    var country = await Countries.findById(req.params.id).lean()
    if (!country.code) {
      var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/country";
      var token = "db4eca9782534bc0deb45c22a18a74dbf4991f66";
      var query = country.country

      var options = {
          method: "POST",
          mode: "cors",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": "Token " + token
          },
          body: JSON.stringify({query: query})
      }
            
      await fetch(url, options)
      .then(response => response.text())
      .then(async function(result) {
        jdata = JSON.parse(result).suggestions[0]
        await Countries.findByIdAndUpdate(country._id, {
          code: jdata.data.code,
          alfa2: jdata.data.alfa2,
          alfa3: jdata.data.alfa3,
          fullName: jdata.data.name
        })
        country = await Countries.findById(req.params.id).lean()
      })
      .catch(error => console.log("error", error));
    }
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