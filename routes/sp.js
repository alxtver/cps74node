const {
	Router
} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Pki = require('../models/pki')
const EAN = require('../models/ean')
const PC = require('../models/pc')
const User = require('../models/user')
const path = require('path')
const fs = require('fs')
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
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
	if ((!req.body.q && selectedType === '...') || (!req.body.q && !selectedType)) {
		pkis = await Pki.find({
			part: selected
		}).sort({
			type_pki: 1
		})

	} else if (!req.body.q && selectedType !== '...') {
		pkis = await Pki.find({
			part: selected,
			type_pki: selectedType
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q === '...' && selectedType === '...') {
		pkis = await Pki.find({
			part: selected
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q === selectedType) {
		pkis = await Pki.find({
			part: selected,
			type_pki: selectedType
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q && req.body.q !== 'null' && selectedType === '...') {
		const query = {
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
	} else if (req.body.q === 'null' && selectedType === '...') {
		pkis = await Pki.find({
			part: selected
		}).sort({
			type_pki: 1
		})
	} else if (req.body.q === 'null' && selectedType) {
		pkis = await Pki.find({
			part: selected,
			type_pki: selectedType
		}).sort({
			type_pki: 1
		})
	} else {
		const query = {
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
	res.status(200).json({
		message: 'ok'
	})
})


router.post("/insert_type_session", async function (req, res) {
	await User.findByIdAndUpdate(req.session.user._id, {
		lastType: req.body.selectedItem
	})
	req.session.type = req.body.selectedItem
	res.status(200).json({
		message: 'ok'
	})
})


router.get('/:id/edit', auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/')
	}
	const pki = await Pki.findById(req.params.id).lean()
	res.render('sp-pki-edit', {
		title: `Редактировать ${pki.type_pki}`,
		part: req.session.part,
		pki: pki,
		encodedPki: encodeURIComponent(JSON.stringify(pki))
	})
})


router.post('/edit', auth, async (req, res) => {
	const id = req.body.id
	await Pki.findByIdAndUpdate(id, req.body)
	let pki = await Pki.findById(id)
	if (req.body.ean_code !== '' && pki.sp_unit.length === 0) {
		let ean = await EAN.find({
			ean_code: req.body.ean_code
		})
		pki.sp_unit = ean.sp_unit
		await pki.save()
	}
	res.status(200).json({
		message: 'ok'
	})
})


router.post('/sp_unit', auth, async (req, res) => {
	const pki = await Pki.findById(req.body.id).lean()
	if (pki.sp_unit && pki.sp_unit.length > 0) {
		res.send(pki)
	} else if (pki.ean_code) {
		const ean = await EAN.findOne({
			ean_code: pki.ean_code
		})
		if (ean && ean.sp_unit.length > 0) {
			res.send(ean)
		} else {
			res.status(200).json({
				message: 'ok'
			})
		}
	} else {
		res.status(200).json({
			message: 'ok'
		})
	}
})


router.post('/viborka', auth, async (req, res) => {
	const pki = await Pki.findById(req.body.id)
	const ean = await EAN.findOne({
		ean_code: pki.ean_code
	})
	if (req.body.viborka === 'true') {
		res.send(ean.sp_unit)
	} else {
		res.send(ean.sp_unit1)
	}
})


router.post('/check_ean', auth, async (req, res) => {
	console.log(req.body);
	await Pki.findByIdAndUpdate(req.body.pki_id, {
		ean_code: req.body.ean
	})
	const ean = await EAN.findOne({
		ean_code: req.body.ean
	})
	console.log(ean);
	if (ean) {
		if (req.body.viborka === 'true') {
			res.send(ean.sp_unit)
		} else {
			res.send(ean.sp_unit1)
		}
	} else {
		res.status(200).json({
			message: 'ok'
		})
	}
})

router.get("/excelExport", auth, async function (req, res) {
	let workbook = new excel.Workbook({
		defaultFont: {
			size: 12,
			name: 'Times New Roman'
		}
	})
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

	const pkis = await Pki.find({
		part: req.session.part
	}).sort({
		type_pki: 1
	})

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
		if (pki.type_pki === type) {
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
			if (pki.type_pki === 'Процессор') {
				ws.cell(n, 10).string('').style(st)
			} else {
				ws.cell(n, 10).string('1').style(st)
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
			if (!/[Бб].?[Нн]/g.test(unit.serial_number)) {
				if (unit.type === 'Коврик для мыши') {} else {
					unitsWOSn.push({
						type: unit.type,
						name: unit.name,
						quantity: unit.quantity,
						serial_number: unit.serial_number
					})
				}
			} else if (
				unit.serial_number === pc.serial_number &&
				unit.type !== 'Системный блок' &&
				unit.type !== 'Корпус' &&
				unit.type !== 'Коврик для мыши'
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
			if (!/[Бб].?[Нн]/g.test(unit.serial_number)) {

				unitsWOSn.push({
					type: unit.type,
					name: unit.name,
					quantity: unit.quantity,
					serial_number: unit.serial_number
				})
			} else if (
				unit.serial_number === pc.serial_number &&
				unit.type !== 'Системный блок' &&
				unit.type !== 'Корпус'
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
		if (un.type === type) {
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
	const pathToExcel = `${docDir}/excel.xlsx`

	workbook.write(pathToExcel, function () {
		console.log('PKI report xlsx generated')
		const fileName = 'Акт ' + req.session.part + '.xlsx'
		res.download(pathToExcel, fileName)
	})
})

router.get("/excelExport1", auth, async function (req, res) {
	let workbook = new excel.Workbook({
		defaultFont: {
			size: 12,
			name: 'Times New Roman'
		}
	})
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
	let pkis = await Pki.find({
		part: req.session.part
	}).sort({
		type_pki: 1
	})
	const pcs = await PC.find({
		part: req.session.part
	}).sort({
		'created': 1
	})

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
		n += 1
		for (const unit of pc.pc_unit) {
			let pki = ''
			if (!/[Бб].?[Нн]/g.test(unit.serial_number)) {
				if (unit.apkzi !== "apkzi" && unit.type !== 'Системный блок' && unit.serial_number !== pc.serial_number) {
					for (const pk of pkis) {
						if (pk.serial_number === unit.serial_number) {
							pki = pk
							break
						}
					}
				}
			}

			if (pki) {
				ws.cell(n, 2).string(unit.type).style(styleB)
				ws.cell(n, 3).string(pki.vendor).style(style)
				ws.cell(n, 4).string(pki.model).style(style)
				ws.cell(n, 5).string(unit.quantity).style(style)
				ws.cell(n, 6).string(unit.serial_number).style(style)
				n += 1

			} else if (!unit.apkzi && unit.type !== 'Системный блок' && unit.type !== 'Коврик для мыши') {
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
			if (!/[Бб].?[Нн]/g.test(unit.serial_number)) {
				if (unit.serial_number !== pc.serial_number || unit.type === 'Корпус') {
					for (const pk of pkis) {
						if (pk.serial_number === unit.serial_number) {
							pki = pk
							break
						}
					}
				}
			}
			if (pki) {
				ws.cell(n, 2).string(unit.type).style(styleB)
				ws.cell(n, 3).string(pki.vendor).style(style)
				ws.cell(n, 4).string(pki.model).style(style)
				ws.cell(n, 5).string(unit.quantity).style(style)
				ws.cell(n, 6).string(unit.serial_number).style(style)
				n += 1
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
	const pathToExcel = `${docDir}/excel.xlsx`

	workbook.write(pathToExcel, function () {
		console.log('PKI report xlsx generated')
		const fileName = 'Заключение ' + req.session.part + '.xlsx'
		res.download(pathToExcel, fileName)
	})
})

module.exports = router
