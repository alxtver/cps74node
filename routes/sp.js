const {
	Router
} = require('express')
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
const excel = require('excel4node')




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
	await Pki.findByIdAndUpdate(id, req.body)
	res.redirect('/sp')
})


router.get('/sp_unit', auth, async (req, res) => {
	const pki = await Pki.findById(req.query.id)
	if (pki.sp_unit && pki.sp_unit.length > 0) {
		res.send(pki)
	} else if (pki.ean_code) {
		ean = await EAN.findOne({
			ean_code: pki.ean_code
		})
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
	
	const pki = await Pki.findById(req.query.id)
	const ean = await EAN.findOne({
		ean_code: pki.ean_code
	})
	if (req.query.viborka == 'true') {
		res.send(ean.sp_unit)
	} else {
		res.send(ean.sp_unit1)
	}
})


router.get('/check_ean', auth, async (req, res) => {
	await Pki.findByIdAndUpdate(req.query.pki_id, {
		ean_code: req.query.ean
	})
	const ean = await EAN.findOne({
		ean_code: req.query.ean
	})
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


router.get('/reportSPDoc1', auth, async (req, res) => {
	const appDir = path.dirname(require.main.filename)
	const docDir = appDir + '/public/docx'

	const pkis = await Pki.find({
		part: req.session.part
	}).sort({
		type_pki: 1
	})

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
	} catch (error) {
		const e = {
			message: error.message,
			name: error.name,
			stack: error.stack,
			properties: error.properties,
		}
		console.log(JSON.stringify({
			error: e
		}))
		// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
		throw error
	}

	let buf = doc.getZip().generate({
		type: 'nodebuffer'
	});

	// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
	fs.writeFileSync(path.resolve(docDir, 'outputSP.docx'), buf)
	const file = `${docDir}/outputSP.docx`
	const fileName = req.session.part + '.docx'
	console.log(`Passport #${req.session.part} was formed`)
	res.download(file, fileName)
})


router.get('/reportSPDoc', auth, async (req, res) => {
	var officegen = require('officegen')

	var fs = require('fs')
	var path = require('path')

	var docx = officegen('docx')
	const appDir = path.dirname(require.main.filename)
	var outDir = appDir + '/public/docx'
	const file = `${outDir}/example_json.docx`
	const fileName = req.session.part + '.docx'



	docx.on('error', function (err) {
		console.log(err)
	})

	let opts = {
		cellColWidth: 1261,
		b: true,
		sz: '16',
		rowSpan: 2
	}

	let opts3 = {
		cellColWidth: 1,
		b: true,
		sz: '16',
	}

	let opts1 = {
		cellColWidth: 300,
		b: true,
		sz: '0',
		rowSpan: 2
	}

	let optsSpan = {
		cellColWidth: 1261,
		b: true,
		sz: '16',
		gridSpan: 2
	}

	const pkis = await Pki.find({
		part: req.session.part
	}).sort({
		type_pki: 1
	})
	
	let dataSP = []
	dataSP.push([{
				val: '№ п/п',
				opts: opts1
			},
			{
				val: 'Наименование',
				opts: opts1
			},
			{
				val: 'Фирма',
				opts: opts1
			},
			{
				val: 'Модель',
				opts: opts1
			},
			{
				val: 'Кол во',
				opts: opts1
			},
			{
				val: 'Серийный (инв.) номер',
				opts: opts1
			},
			{
				val: 'Страна',
				opts: optsSpan
			},
			{
				val: '',
				opts: opts
			},
		],
		[

			{},
			{},
			{}
		]
	)
	
	var table = [
		[{
				val: 'No.',
				opts: {
					cellColWidth: 4261,
					b: true,
					sz: '48',
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
					color: 'A00000',
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
					cellColWidth: 42,
					b: true,
					sz: '48',
					shd: {
						fill: '92CDDC',
						themeFill: 'text1',
						themeFillTint: '80'
					}
				}
			}
		],
		[1, {
			val: 'I have two spans.',
			opts: {
				gridSpan: 2
			}
		}],
		[{
			val: 'I have three spans.',
			opts: {
				gridSpan: 3
			}
		}],
		[{
			val: 'I have two spans.',
			opts: {
				gridSpan: 2
			}
		}, '3'],
		[4, 'watch out for the baobabs!', 'END']
	]

	var tableStyle = {
		tableColWidth: 4261,
		tableSize: 24,
		tableAlign: 'left',
		tableFontFamily: 'Times New Roman',
		borders: true
	}

	var data = [{
			type: 'text',
			val: req.session.part,
			opt: {
				font_face: 'Arial',
				font_size: 16
			},
			lopt: {
				align: 'center'
			}
		},
		{
			type: 'horizontalline'
		},
		{
			type: 'table',
			val: dataSP,
			opt: tableStyle
		}
	]

	await docx.createByJson(data)

	var out = await fs.createWriteStream(path.join(outDir, 'example_json.docx'))

	out.on('error', function (err) {
		console.log(err)
	})

	out.on('close', function () {
		res.download(file, fileName)
	})

	docx.generate(out)
	console.log(`Passport #${req.session.part} was formed`)
})


router.get("/excelExport", auth, async function (req, res) {
	const sortSelect = req.query.sortSelect
	let workbook = new excel.Workbook({
		defaultFont: {
			size: 12,
			name: 'Times New Roman'			
		}})
	// Add Worksheets to the workbook
	let ws = workbook.addWorksheet('Sheet 1')
	// Create a reusable style
	let style = workbook.createStyle({
		font: {
			size: 12
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thin',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let style1 = workbook.createStyle({
		font: {
			size: 12
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thick',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let styleB = workbook.createStyle({
		font: {
			size: 12,
			bold: true
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thin',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let style1B = workbook.createStyle({
		font: {
			size: 12,
			bold: true
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thick',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let styleheader = workbook.createStyle({
		font: {
			bold: true,
		},
		alignment: {
			wrapText: true,
			horizontal: 'center',
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thin',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let styleHead = workbook.createStyle({
		font: {
			bold: true,
			size: 18
		},
	})

	let pkis = await Pki.find({part: req.session.part}).sort({type_pki: 1})
	// if (!req.session.type || req.session.type == '...') {
	// 	pkis = await Pki.find({
	// 		part: req.session.part
	// 	}).sort({
	// 		type_pki: 1
	// 	})
	// } else {
	// 	pkis = await Pki.find({
	// 		part: req.session.part,
	// 		type_pki: req.session.type
	// 	}).sort({
	// 		type_pki: 1
	// 	})
	// }
	
	
	ws.column(1).setWidth(3)
	ws.column(2).setWidth(5)
	ws.column(3).setWidth(30)
	ws.column(4).setWidth(25)
	ws.column(5).setWidth(28)
	ws.column(6).setWidth(5)
	ws.column(7).setWidth(28)
	ws.column(8).setWidth(10)
	ws.column(9).setWidth(10)
	ws.column(10).setWidth(5)

	ws.row(1).setHeight(30)
	ws.cell(1, 2).string(req.session.part).style(styleHead)

	ws.cell(2, 2, 3, 2, true).string('№ п/п').style(styleheader)
	ws.cell(2, 3, 3, 3, true).string('Наименование').style(styleheader)
	ws.cell(2, 4, 3, 4, true).string('Фирма').style(styleheader)
	ws.cell(2, 5, 3, 5, true).string('Модель').style(styleheader)
	ws.cell(2, 6, 3, 6, true).string('Кол во').style(styleheader)
	ws.cell(2, 7, 3, 7, true).string('Серийный (инв.) номер').style(styleheader)
	ws.cell(2, 8, 3, 8, true).string('Страна').style(styleheader)
	ws.cell(2, 9, 2, 10, true).string('СЗЗ').style(styleheader)
	ws.cell(3, 9).string('Тип1').style(styleheader)
	ws.cell(3, 10).string('Тип2').style(styleheader)

	ws.row(2).freeze()
	ws.row(3).freeze()

	let n = 4
	let number = 1
	let type = ''
	let st = style
	let stB = styleB
	for (const pki of pkis) {
		if (pki.type_pki == type) {
			st = style
			stB = styleB
		} else {
			st = style1
			stB = style1B
		}
		ws.cell(n, 2).number(number).style(stB)
		ws.cell(n, 3).string(pki.type_pki).style(stB)
		ws.cell(n, 4).string(pki.vendor).style(st)
		ws.cell(n, 5).string(pki.model).style(st)
		ws.cell(n, 6).string('1').style(st)
		ws.cell(n, 7).string(pki.serial_number).style(st)
		ws.cell(n, 8).string(pki.country).style(st)
		if (pki.szz1) {
			ws.cell(n, 9).string(pki.szz1).style(st)
			ws.cell(n, 10).string('').style(st)
		} else {
			ws.cell(n, 9).string('').style(st)
			if (pki.type_pki == 'Процессор') {
				ws.cell(n, 10).string('').style(st)
			} else {
				ws.cell(n, 10).string('1').style(st)
			}
		}

		if (pki.sp_unit && pki.sp_unit.length > 0) {
			for (const unit of pki.sp_unit) {
				n += 1
				ws.cell(n, 2).string('').style(style)
				ws.cell(n, 3).string(unit.name).style(style)
				ws.cell(n, 4).string(unit.vendor).style(style)
				ws.cell(n, 5).string(unit.model).style(style)
				ws.cell(n, 6).string(unit.quantity).style(style)
				ws.cell(n, 7).string(unit.serial_number).style(style)
				ws.cell(n, 8).string('').style(style)
				ws.cell(n, 9).string('').style(style)
				ws.cell(n, 10).string(unit.szz2).style(style)
			}
		}

		type = pki.type_pki
		n += 1
		number += 1
	}

	const pcs = await PC.find({
		part: req.session.part
	})
	let unitsWOSn = []
	let unitsWPcSn = []
	for (const pc of pcs) {
		for (const unit of pc.pc_unit) {
			if (unit.serial_number == 'б/н' ||
				unit.serial_number == 'Б/н' ||
				unit.serial_number == 'б/Н' ||
				unit.serial_number == 'Б/Н'
				) {
					if (unit.type == 'Коврик для мыши') {						
					} else {
						unitsWOSn.push({
							type: unit.type,
							name: unit.name,
							quantity: unit.quantity,
							serial_number: unit.serial_number
						})
					}				
			} else if (
				unit.serial_number == pc.serial_number &&
				unit.type != 'Системный блок' &&
				unit.type != 'Корпус' &&
				unit.type != 'Коврик для мыши'
				) {
					unitsWPcSn.push({
						type: unit.type,
						name: unit.name,
						quantity: unit.quantity,
						serial_number: unit.serial_number
					})
			}
		}
		for (const unit of pc.system_case_unit) {
			if (unit.serial_number == 'б/н' ||
				unit.serial_number == 'Б/н' ||
				unit.serial_number == 'б/Н' ||
				unit.serial_number == 'Б/Н'
				) {
					
				unitsWOSn.push({
					type: unit.type,
					name: unit.name,
					quantity: unit.quantity,
					serial_number: unit.serial_number
				})
			} else if (
				unit.serial_number == pc.serial_number &&
				unit.type != 'Системный блок' &&
				unit.type != 'Корпус'
				) {
				unitsWPcSn.push({
					type: unit.type,
					name: unit.name,
					quantity: unit.quantity,
					serial_number: unit.serial_number
				})
			}
		}
	}

	let sumUnitsWOSn = []
	let arr = []

	for (const un of unitsWOSn) {
		if (sumUnitsWOSn[un.type + ' ' + un.name]) {
			sumUnitsWOSn[un.type + ' ' + un.name].quantity = parseInt(sumUnitsWOSn[un.type + ' ' + un.name].quantity) + parseInt(un.quantity)
		} else {
			arr.push(un.type + ' ' + un.name)
			sumUnitsWOSn[un.type + ' ' + un.name] = {
				type: un.type,
				name: un.name,
				quantity: un.quantity,
				serial_number: un.serial_number
			}
		}
	}

// выгрузка в отчет комплектухи c номерами машин
for (const un of unitsWPcSn) {
	if (un.type == type) {
		st = style
		stB = styleB
	} else {
		st = style1
		stB = style1B
	}
	let name = un.name.split(' ')
	let vendor = name.splice(0, 1).join(' ')
	let model = name.join(' ')
	ws.cell(n, 2).number(number).style(stB)
	ws.cell(n, 3).string(un.type).style(stB)
	ws.cell(n, 4).string(vendor).style(st)
	ws.cell(n, 5).string(model).style(st)
	ws.cell(n, 6).string(un.quantity).style(st)
	ws.cell(n, 7).string(un.serial_number).style(st)
	ws.cell(n, 8).string('').style(st)
	ws.cell(n, 9).string('').style(st)
	ws.cell(n, 10).string(un.quantity).style(st)
	n += 1
	number += 1
	type = un.type
}

// выгрузка в отчет комплектухи без номеров
	for (let i = 0; i < arr.length; i++) {
		let name = sumUnitsWOSn[arr[i]].name.split(' ')
		let vendor = name.splice(0, 1).join(' ')
		let model = name.join(' ')
		ws.cell(n, 2).number(number).style(style1B)
		ws.cell(n, 3).string(sumUnitsWOSn[arr[i]].type).style(style1B)
		ws.cell(n, 4).string(vendor).style(style1)
		ws.cell(n, 5).string(model).style(style1)
		ws.cell(n, 6).string(sumUnitsWOSn[arr[i]].quantity.toString()).style(style1)
		ws.cell(n, 7).string(sumUnitsWOSn[arr[i]].serial_number).style(style1)
		ws.cell(n, 8).string('').style(style1)
		ws.cell(n, 9).string('').style(style1)
		ws.cell(n, 10).string(sumUnitsWOSn[arr[i]].quantity.toString()).style(style1)
		n += 1
		number += 1
	}

	const appDir = path.dirname(require.main.filename)
	const docDir = appDir + '/public/docx'
	pathToExcel = `${docDir}/excel.xlsx`

	workbook.write(pathToExcel, function () {
		console.log('PKI report xlsx generated')
		const fileName = 'Акт ' + req.session.part + '.xlsx'
		res.download(pathToExcel, fileName)
	})
})


router.get("/excelExport1", auth, async function (req, res) {
	const sortSelect = req.query.sortSelect
	let workbook = new excel.Workbook({
		defaultFont: {
			size: 12,
			name: 'Times New Roman'			
		}})
	// Add Worksheets to the workbook
	let ws = workbook.addWorksheet('Sheet 1')
	// Create a reusable style
	let style = workbook.createStyle({
		font: {
			size: 12
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thin',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let style1 = workbook.createStyle({
		font: {
			size: 12
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thick',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let styleB = workbook.createStyle({
		font: {
			size: 12,
			bold: true
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thin',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let style1B = workbook.createStyle({
		font: {
			size: 12,
			bold: true
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thick',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let styleheader = workbook.createStyle({
		font: {
			bold: true,
		},
		alignment: {
			wrapText: true,
			horizontal: 'center',
		},
		border: {
			left: {
				style: 'thin',
				color: 'black',
			},
			right: {
				style: 'thin',
				color: 'black',
			},
			top: {
				style: 'thin',
				color: 'black',
			},
			bottom: {
				style: 'thin',
				color: 'black',
			},
		}
	})

	let styleHead = workbook.createStyle({
		font: {
			bold: true,
			size: 18
		},
	})
	let pkis = await Pki.find({part: req.session.part}).sort({type_pki: 1})
	const pcs = await PC.find({part: req.session.part}).sort({'created': 1})


	// ws.column(1).setWidth(3)
	// ws.column(2).setWidth(30)
	// ws.column(3).setWidth(20)
	// ws.column(4).setWidth(25)
	// ws.column(5).setWidth(5)
	// ws.column(6).setWidth(25)

	ws.column(1).setWidth(3)
	ws.column(2).setWidth(18.5)
	ws.column(3).setWidth(16.6)
	ws.column(4).setWidth(16.5)
	ws.column(5).setWidth(4.6)
	ws.column(6).setWidth(24.5)


	ws.row(1).setHeight(30)
	ws.cell(1, 2).string(req.session.part).style(styleHead)

	ws.cell(2, 2).string('Наименование').style(styleheader)
	ws.cell(2, 3).string('Фирма').style(styleheader)
	ws.cell(2, 4).string('Модель').style(styleheader)
	ws.cell(2, 5).string('Кол во').style(styleheader)
	ws.cell(2, 6).string('Серийный (инв.) номер').style(styleheader)

	ws.row(2).freeze()
	
	
	let n = 3

	for (const pc of pcs) {
		ws.cell(n, 2, n, 6, true).string(pc.serial_number).style(styleheader)
		n+=1
		for (const unit of pc.pc_unit) {
			let pki = ''
				
			if (
				unit.serial_number != 'б/н' &&
				unit.serial_number != 'Б/н' &&
				unit.serial_number != 'б/Н' &&
				unit.serial_number != 'б/н'
				) {
					if (unit.apkzi != "apkzi" && unit.type != 'Системный блок' && unit.serial_number != pc.serial_number) {
						for (const pk of pkis) {
							if (pk.serial_number == unit.serial_number) {
								pki = pk
								break
							}
						}
					//	pki = await Pki.findOne({part: req.session.part, serial_number: unit.serial_number})
					}	
			}
			
			if (pki) {
				ws.cell(n, 2).string(unit.type).style(styleB)
				ws.cell(n, 3).string(pki.vendor).style(style)
				ws.cell(n, 4).string(pki.model).style(style)
				ws.cell(n, 5).string(unit.quantity).style(style)
				ws.cell(n, 6).string(unit.serial_number).style(style)
				n += 1
				if (pki.sp_unit && pki.sp_unit.length > 0) {
					for (const u of pki.sp_unit) {
						ws.cell(n, 2).string(u.name).style(style)
						ws.cell(n, 3).string(u.vendor).style(style)
						ws.cell(n, 4).string(u.model).style(style)
						ws.cell(n, 5).string(u.quantity).style(style)
						ws.cell(n, 6).string(u.serial_number).style(style)
						n += 1
					}
				}
			} else if (!unit.apkzi && unit.type != 'Системный блок' && unit.type != 'Коврик для мыши') {
				let name = unit.name.split(' ')
				let vendor = name.splice(0, 1).join(' ')
				let model = name.join(' ')
				ws.cell(n, 2).string(unit.type).style(styleB)
				ws.cell(n, 3).string(vendor).style(style)
				ws.cell(n, 4).string(model).style(style)
				ws.cell(n, 5).string(unit.quantity).style(style)
				ws.cell(n, 6).string(unit.serial_number).style(style)
				n += 1
			}	
		}
		for (const unit of pc.system_case_unit) {
			let pki = ''
			
			if (
				unit.serial_number != 'б/н' &&
				unit.serial_number != 'Б/н' &&
				unit.serial_number != 'б/Н' &&
				unit.serial_number != 'б/н'
				) { if (unit.serial_number != pc.serial_number || unit.type == 'Корпус') {
					for (const pk of pkis) {
						if (pk.serial_number == unit.serial_number) {
							pki = pk
							break
						}
					}
					//pki = await Pki.findOne({part: req.session.part, serial_number: unit.serial_number})
				}
					
			}
			if (pki) {
				ws.cell(n, 2).string(unit.type).style(styleB)
				ws.cell(n, 3).string(pki.vendor).style(style)
				ws.cell(n, 4).string(pki.model).style(style)
				ws.cell(n, 5).string(unit.quantity).style(style)
				ws.cell(n, 6).string(unit.serial_number).style(style)
				n += 1
				if (pki.sp_unit && pki.sp_unit.length > 0) {
					for (const u of pki.sp_unit) {
						ws.cell(n, 2).string(u.name).style(style)
						ws.cell(n, 3).string(u.vendor).style(style)
						ws.cell(n, 4).string(u.model).style(style)
						ws.cell(n, 5).string(u.quantity).style(style)
						ws.cell(n, 6).string(u.serial_number).style(style)
						n += 1
					}
				}
			} else if (!unit.szi) {
				let name = unit.name.split(' ')
				let vendor = name.splice(0, 1).join(' ')
				let model = name.join(' ')
				ws.cell(n, 2).string(unit.type).style(styleB)
				ws.cell(n, 3).string(vendor).style(style)
				ws.cell(n, 4).string(model).style(style)
				ws.cell(n, 5).string(unit.quantity).style(style)
				ws.cell(n, 6).string(unit.serial_number).style(style)
				n += 1				
			}			
		}		
	}


	const appDir = path.dirname(require.main.filename)
	const docDir = appDir + '/public/docx'
	pathToExcel = `${docDir}/excel.xlsx`

	workbook.write(pathToExcel, function () {
		console.log('PKI report xlsx generated')
		const fileName = 'Заключение ' + req.session.part + '.xlsx'
		res.download(pathToExcel, fileName)
	})
})

module.exports = router