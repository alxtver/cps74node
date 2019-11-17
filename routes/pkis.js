const {Router} = require('express')
const Pki = require('../models/pki')
const PC = require('../models/pc')
const Part = require('../models/part')
const EAN = require('../models/ean')
const auth = require('../middleware/auth')
const router = Router()
const path = require('path')
const fs = require('fs')
const excel = require('excel4node')


router.get('/', auth, async (req, res) => {
  res.render('pkis', {
    title: 'ПКИ',
    isPkis: true,

  })
})

router.post('/', auth, async (req, res) => {
  res.render('pkis', {
    title: 'ПКИ',
    isPkis: true
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const pki = await Pki.findById(req.params.id)
  res.render('pki-edit', {
    title: `Редактировать ${pki.type_pki}`,
    pki
  })
})


router.post('/edit', auth, async (req, res) => {
  await Pki.findByIdAndUpdate(req.body._id, req.body)
  res.redirect('/pkis')
})

router.post('/edit_ajax', auth, async (req, res) => {
  try {

    await Pki.findByIdAndUpdate(req.body.id, req.body)
    res.sendStatus(200)

    if (!req.body) return res.sendStatus(400);
  } catch (error) {
    console.log(error)
  }
})

router.post("/search", auth, async (req, res) => {
  let selected = req.session.part  

  let pkis
  if (!req.body.q && !selected) {
    pkis = await Pki.find().sort([['created', -1]]).limit(100)
  } else if (req.body.q == 'null' && selected) {
    query = {part: selected}
    pkis = await Pki.find(query).sort([['created', -1]])
  } else if (!req.body.q && selected) {
    query = {part: selected}
    pkis = await Pki.find(query).sort([['created', -1]])   
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
          part: selected
        }
      ]
    }
    pkis = await Pki.find(query).sort([['created', -1]])
  }
  
  res.send(JSON.stringify(pkis)); // отправляем пришедший ответ обратно
})


router.post("/part", auth, async function (req, res) {
  parts = await Part.find()
  if (!req.body) return res.sendStatus(400)
  res.send(JSON.stringify(parts)) 
})

router.post("/part_session", async function (req, res) {  
  if (!req.session.part) return res.sendStatus(400)
  res.send(req.session.part) 
})


router.post("/del", auth, async (req, res) => {
  const part = req.body.part
  let pki = await Pki.findById(req.body.id)
  if (pki.number_machine) {
    let pc = await PC.findOne({
      part: pki.part,
      serial_number: pki.number_machine
    })
    if (pc) {
      let unit = 'pc_unit'
      for (let i in pc[unit]) {
        if (pki.serial_number == pc[unit][i].serial_number) {
          pc[unit][i].serial_number = ''
          pc[unit][i].name = ''
          break
        }
      }
      unit = 'system_case_unit'
      for (let i in pc[unit]) {
        if (pki.serial_number == pc[unit][i].serial_number) {
          pc[unit][i].serial_number = ''
          pc[unit][i].name = ''
          break
        }
      }
    }
    let pc_copy = await PC.findOne({
      part: pki.part,
      serial_number: pki.number_machine
    })
    pc_copy.pc_unit = pc.pc_unit
    pc_copy.system_case_unit = pc.system_case_unit
    pc_copy.save()
  }
  try {
    await Pki.deleteOne({
      _id: req.body.id
    })
    res.send(part)
  } catch (e) {
    console.log(e)
    res.send(part)
  }
})

router.post("/searchEAN", auth, async function (req, res) {
  const ean = await EAN.findOne({
    ean_code: req.body.valueEAN
  })
  if (!ean) return res.send('none')
  res.send(JSON.stringify(ean)) // отправляем пришедший ответ обратно
})

router.get("/excelImport", auth, async function (req, res) {
  let workbook = new excel.Workbook()
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
}})

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
}})

let styleheader = workbook.createStyle({
  font: {    
    bold: true,
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
}})



let styleHead = workbook.createStyle({
  font: {
    bold: true, 
    size: 18
  },  
})

pkis = await Pki.find({part: req.session.part}).sort({type_pki: 1})

ws.column(1).setWidth(3)
ws.column(2).setWidth(33)
ws.column(3).setWidth(17)
ws.column(4).setWidth(25)
ws.column(5).setWidth(28)
ws.column(6).setWidth(17)
ws.column(7).setWidth(17)

ws.row(1).setHeight(30)
ws.cell(1,2).string(req.session.part).style(styleHead)

ws.cell(2,2).string('Наименование').style(styleheader)
ws.cell(2,3).string('Производитель').style(styleheader)
ws.cell(2,4).string('Модель').style(styleheader)
ws.cell(2,5).string('Серийный номер').style(styleheader)
ws.cell(2,6).string('Страна').style(styleheader)
ws.cell(2,7).string('Номер ПЭВМ').style(styleheader)

ws.row(2).freeze()
let n = 3
let model = ''
let st = style
for (const pki of pkis) {
  if (pki.model == model) {
    st = style
  } else {
    st = style1
  }
  model = pki.model
  ws.cell(n,2).string(pki.type_pki).style(st)
  ws.cell(n,3).string(pki.vendor).style(st)
  ws.cell(n,4).string(pki.model).style(st)
  ws.cell(n,5).string(pki.serial_number).style(st)  
  ws.cell(n,6).string(pki.country).style(st)
  if (pki.number_machine){
    ws.cell(n,7).string(pki.number_machine).style(st)
  } else {
    ws.cell(n,7).string('').style(st)
  }
  //ws.cell(n,1).string(pki.number_machine).style(style)
  n += 1
}

const appDir = path.dirname(require.main.filename)
const docDir = appDir + '/public/docx'
pathToExcel = `${docDir}/excel.xlsx`

workbook.write(pathToExcel, function () {
  const fileName = req.session.part + '.xlsx'
  res.download(pathToExcel, fileName)
})
})

module.exports = router