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
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const http = require('http')




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
		pkis = await Pki.find({part: selected}).sort({type_pki: 1})

		// for (const pki of pkis) {
		// 	if (!pki.viborka) {
		// 		if(pki.ean_code) {
		// 			ean = await EAN.findOne({ean_code: pki.ean_code})
		// 			console.log(ean);
		// 		}
		// 	}			
		// }

	} else if (!req.body.q && selectedType != '...') {
		pkis = await Pki.find({
			part: selected,
			type_pki: selectedType
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q == '...' && selectedType == '...') {
		pkis = await Pki.find({part: selected}).sort({type_pki: 1})		
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
	await Pki.findByIdAndUpdate(id, req.body)
	res.redirect('/sp')
})


router.get('/sp_unit', auth, async (req, res) => {
	const pki = await Pki.findById(req.query.id)
	if (pki.sp_unit && pki.sp_unit.length > 0) {		
		res.send(pki)
	} else if (pki.ean_code) {
		ean = await EAN.findOne({ean_code: pki.ean_code})
		if (ean && ean.sp_unit.length > 0) {
			res.send(ean)
		} else {
			res.sendStatus(200)
		}
	} else {
		res.sendStatus(200)
	}
})


router.get('/viborka', auth, async (req, res) => {
	console.log(req.query);
	const pki = await Pki.findById(req.query.id)
	const ean = await EAN.findOne({ean_code: pki.ean_code})
	if (req.query.viborka == 'true') {
		res.send(ean.sp_unit)
	} else {
		res.send(ean.sp_unit1)
	}
})


router.get('/check_ean', auth, async (req, res) => {
	await Pki.findByIdAndUpdate(req.query.pki_id, {ean_code: req.query.ean})
	const ean = await EAN.findOne({ean_code: req.query.ean})
	if (ean) {
		if (req.query.viborka == 'true') {
			res.send(ean.sp_unit)
		} else {
			res.send(ean.sp_unit1)
		}
	} else {
		res.sendStatus(200)
	}	
})


router.get('/reportSPDoc', auth, async (req, res) => {
  const appDir = path.dirname(require.main.filename)
  const docDir = appDir + '/public/docx'
 
  const pkis = await Pki.find({part: req.session.part}).sort({type_pki: 1})
    
  var content = fs.readFileSync(path.resolve(docDir, 'inputSP.docx'), 'binary');

  var zip = new PizZip(content);

  var doc = new Docxtemplater();
  doc.loadZip(zip);

  //set the templateVariables
  doc.setData({
      data: pkis
  })

  try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render()
  }
  catch (error) {
      const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
      }
      console.log(JSON.stringify({error: e}))
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
      throw error
  }

  let buf = doc.getZip().generate({type: 'nodebuffer'});

  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync(path.resolve(docDir, 'outputSP.docx'), buf)
  const file = `${docDir}/outputSP.docx`
  const fileName = req.session.part + '.docx'
  console.log(`Passport #${req.session.part} was formed`)
  res.download(file, fileName)
})


router.get('/reportSPDoc1', auth, async (req, res) => {
	var officegen = require('officegen')

	var fs = require('fs')
	var path = require('path')
	
	var docx = officegen('docx')
	const appDir = path.dirname(require.main.filename)
	var outDir = appDir + '/public/docx'
	const file = `${outDir}/example_json.docx`
	const fileName = req.session.part + '.docx'

	
	
	docx.on('error', function(err) {
		console.log(err)
	})

	const pkis = await Pki.find({part: req.session.part})
	
	var table = [
		[
			{
				val: 'Нет.',
				opts: {
					cellColWidth: 1261,
					b: true,
					sz: '16',
					shd: {
						fill: '7F7F7F',
						themeFill: 'text1',
						themeFillTint: '80'
					},
					fontFamily: 'Avenir Book'
				}
			},
			{
				val: 'Title1',
				opts: {
					b: true,
					color: 'FFFFFF',
					align: 'right',
					shd: {
						fill: '92CDDC',
						themeFill: 'text1',
						themeFillTint: '80'
					}
				}
			},
			{
				val: 'Title2',
				opts: {
					align: 'center',
					cellColWidth: 420,
					b: true,
					sz: '48',
					shd: {
						fill: '00FF00',
						themeFill: 'text1',
						themeFillTint: '80'
					}
				}
			}
		],
		[1, 'All grown-ups were once children', ''],
		[2, 'there is no harm in putting off a piece of work until another day.', ''],
		[3,'But when it is a matter of baobabs, that always means a catastrophe.',''],
		[4, 'watch out for the baobabs!', 'END']
	]
	
	var tableStyle = {
		tableColWidth: 4261,
		tableSize: 24,
		tableColor: 'ada',
		tableAlign: 'left',
		tableFontFamily: 'Comic Sans MS'
	}
	
	var data = [
		[
			{
				align: 'right'
			},
			{
				type: 'text',
				val: 'Simple'
			},
			{
				type: 'text',
				val: ' with color',
				opt: {
					color: '000088'
				}
			},
			{
				type: 'text',
				val: '  and back color.',
				opt: {
					color: '00ffff',
					back: '000088'
				}
			},
			{
				type: 'linebreak'
			},
			{
				type: 'text',
				val: 'Bold + underline',
				opt: {
					bold: true,
					underline: true
				}
			}
		],
		{
			type: 'horizontalline'
		},
		[
			{
				backline: 'EDEDED'
			},
			{
				type: 'text',
				val: '  backline text1.',
				opt: {
					bold: true
				}
			},
			{
				type: 'text',
				val: '  backline text2.',
				opt: { color: '000088' }
			}
		],
		{
			type: 'text',
			val: 'Left this text.',
			lopt: {
				align: 'left'
			}
		},
		{
			type: 'text',
			val: 'Center this text.',
			lopt: {
				align: 'center'
			}
		},
		{
			type: 'text',
			val: 'Right this text.',
			lopt: {
				align: 'right'
			}
		},
		{
			type: 'text',
			val: 'Fonts face only.',
			opt: {
				font_face: 'Arial'
			}
		},
		{
			type: 'text',
			val: 'Fonts face and size.',
			opt: {
				font_face: 'Arial',
				font_size: 40
			}
		},
		{
			type: 'table',
			val: table,
			opt: tableStyle
		},
		[
			{},
			{
				type: 'image',
				
			},
			{
				type: 'image',
				
			}
		],
		{
			type: 'pagebreak'
		},

		{
			type: 'pagebreak'
		}
	]
	
	await docx.createByJson(data)
	
	var out = await fs.createWriteStream(path.join(outDir, 'example_json.docx'))
	
	out.on('error', function(err) {
		console.log(err)
	})

	out.on('close', function() {
		res.download(file, fileName)		
 })
	
	docx.generate(out)
	console.log(`Passport #${req.session.part} was formed`)
})

module.exports = router