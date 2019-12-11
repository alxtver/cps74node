const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const Pki = require('../models/pki')
const EAN = require('../models/ean')
const PC = require('../models/pc')
const APKZI = require('../models/apkzi')
const User = require('../models/user')
const path = require('path')
const fs = require('fs')


router.get('/', auth, async (req, res) => {
	let args_devel = {
		title: 'Спецпроверка',
		isSP: true,
		part: req.session.part
	}
	res.render('sp', args_devel)
})


router.post("/search", auth, async (req, res) => {
	let selected = req.session.part
	let selectedType = req.session.type

	let typesList = await Pki.find({
		part: selected
	}).distinct('type_pki')

	let pkis
	if ((!req.body.q && selectedType == '...') || (!req.body.q && !selectedType)) {
		pkis = await Pki.find({
			part: selected
		}).sort({
			type_pki: 1
		})
	} else if (!req.body.q && selectedType != '...') {
		pkis = await Pki.find({
			part: selected,
			type_pki: selectedType
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q == '...' && selectedType == '...') {
		pkis = await Pki.find({
			part: selected
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q == selectedType) {
		pkis = await Pki.find({
			part: selected,
			type_pki: selectedType
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q && req.body.q != 'null' && selectedType == '...') {
		query = {
			$and: [{
					$or: [{
							type_pki: new RegExp(req.body.q + '.*', "i")
						},
						{
							vendor: new RegExp(req.body.q + '.*', "i")
						},
						{
							country: new RegExp(req.body.q + '.*', "i")
						},
						{
							model: new RegExp(req.body.q + '.*', "i")
						},
						{
							part: new RegExp(req.body.q + '.*', "i")
						},
						{
							serial_number: new RegExp(req.body.q + '.*', "i")
						},
						{
							number_machine: new RegExp(req.body.q + '.*', "i")
						}
					]
				},
				{
					part: selected
				}
			]
		}
		pkis = await Pki.find(query).sort({
			type_pki: 1
		})
	} else if (req.body.q == 'null' && selectedType == '...') {
		pkis = await Pki.find({
			part: selected
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q == 'null' && selectedType) {
		pkis = await Pki.find({
			part: selected,
			type_pki: selectedType
		}).sort({
			type_pki: 1
		})
	} else {
		query = {
			$and: [{
					$or: [{
							type_pki: new RegExp(req.body.q + '.*', "i")
						},
						{
							vendor: new RegExp(req.body.q + '.*', "i")
						},
						{
							country: new RegExp(req.body.q + '.*', "i")
						},
						{
							model: new RegExp(req.body.q + '.*', "i")
						},
						{
							part: new RegExp(req.body.q + '.*', "i")
						},
						{
							serial_number: new RegExp(req.body.q + '.*', "i")
						},
						{
							number_machine: new RegExp(req.body.q + '.*', "i")
						}
					]
				},
				{
					part: selected,
					type_pki: selectedType
				}
			]
		}
		pkis = await Pki.find(query).sort({
			type_pki: 1
		})
	}
	res.send(JSON.stringify({
		pkis: pkis,
		types: typesList,
		selectedType: selectedType
	}))
})


router.post('/edit_ajax', auth, async (req, res) => {
	try {
		await Pki.findByIdAndUpdate(req.body.id, req.body)
	} catch (error) {
		console.log(error)
	}
	res.sendStatus(200)
})


router.post("/insert_type_session", async function (req, res) {
	await User.findByIdAndUpdate(req.session.user._id, {
		lastType: req.body.selectedItem
	})
	req.session.type = req.body.selectedItem
	res.sendStatus(200)
})


router.get('/:id/edit', auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/')
	}
	const pki = await Pki.findById(req.params.id)
	res.render('sp-pki-edit', {
		title: `Редактировать ${pki.type_pki}`,
		part: req.session.part,
		pki
	})
})


router.post('/edit', auth, async (req, res) => {
	const id = req.body.id	
	const ean_code = req.body.ean_code
	const szz1 = req.body.ssz1
	const sp_unit = req.body.sp_unit
	let pki = await Pki.findByIdAndUpdate(id, req.body)

	if (sp_unit && sp_unit.length > 0) {
		ean = await EAN.findOne({
			ean_code: ean_code
		})
		if (!ean) {
			const new_ean = new EAN({
				ean_code: ean_code,
				type_pki: pki.type_pki,
				vendor: pki.vendor,
				model: pki.model,
				country: pki.country,
				sp_unit: sp_unit
			})
			new_ean.save()
		} else {
			ean.sp_unit = sp_unit
			ean.save()
		}
	} else {
		pki.sp_unit = []
		pki.save()
	}

	res.redirect('/sp')
})


router.get('/sp_unit', auth, async (req, res) => {
	const pki = await Pki.findById(req.query.id)
	if (pki.sp_unit && pki.sp_unit.length > 0) {
		console.log("PKI!!!");
		res.send(pki)
	} else if (pki.ean_code) {
		ean = await EAN.findOne({
			ean_code: pki.ean_code
		})
		if (ean && ean.sp_unit.length > 0) {
			console.log("EAN!!!");
			res.send(ean)
		} else {
			console.log("200  1 !!!");
			res.sendStatus(200)
		}
	} else {
		console.log("200  2 !!!");
		res.sendStatus(200)
	}
})


router.get('/check_ean', auth, async (req, res) => {	
	const ean = await EAN.findOne({ean_code: req.query.ean})
	if (ean) {
		if (ean.sp_unit && ean.sp_unit.length > 0) {
			res.send(ean)
		} else {
			res.sendStatus(200)
		}
	} else {
		res.sendStatus(200)
	}	
})

module.exports = router