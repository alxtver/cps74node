const {
  Router
} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const PC = require('../models/pc')
const path = require('path')
const fs = require('fs')
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const excel = require('excel4node')


router.get('/', auth, (req, res) => {
  res.render('projects', {
    title: 'Проекты',
    isProjects: true,
    part: req.session.part
  })
})


router.get('/import', auth, async (req, res) => {
  const part = req.session.part
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
    }
  })
  let styleBold = workbook.createStyle({
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
  let styleBoldLeft = workbook.createStyle({
    font: {
      size: 12,
      bold: true
    },
    border: {
      left: {
        style: 'thick',
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
  let styleBoldRight = workbook.createStyle({
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
        style: 'thick',
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
  let styleBot = workbook.createStyle({
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

  let styleBotLeft = workbook.createStyle({
    font: {
      size: 12
    },
    border: {
      left: {
        style: 'thick',
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

  let styleBotRight = workbook.createStyle({
    font: {
      size: 12
    },
    border: {
      left: {
        style: 'thin',
        color: 'black',
      },
      right: {
        style: 'thick',
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

  let styleBot1 = workbook.createStyle({
    font: {
      size: 12
    },
    border: {
      top: {
        style: 'thick',
        color: 'black',
      },
    }
  })

  let styleLeft = workbook.createStyle({
    font: {
      size: 12
    },
    border: {
      left: {
        style: 'thick',
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

  let styleRight = workbook.createStyle({
    font: {
      size: 12
    },
    border: {
      left: {
        style: 'thin',
        color: 'black',
      },
      right: {
        style: 'thick',
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
  const allPC = await PC.find({
    part: part
  }).sort({
    'created': 1
  })

  ws.row(1).setHeight(30)
  ws.cell(1, 2).string(part).style(styleHead)

  let n = 3
  let col2width = 21
  let col3width = 23
  let col4width = 16
  let col5width = 12
  let col6width = 17
  let col7width = 13

  for (const pc of allPC) {
    let backColor = pc.back_color
    let styleBoldColor = workbook.createStyle({
      font: {
        size: 14,
        bold: true
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: backColor,
        fgColor: backColor,
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
    let styleWhite = workbook.createStyle({
      fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: backColor,
        fgColor: backColor,
      }
    })
    let stColor = styleBoldColor
    let firstCellColor = styleWhite

    ws.cell(n, 1).string("").style(firstCellColor)
    ws.cell(n, 2).string("ФДШИ." + pc.fdsi).style(styleBotLeft)
    ws.cell(n, 3).string(pc.serial_number).style(stColor)
    ws.cell(n, 4).string(pc.arm).style(styleBot)
    ws.cell(n, 5).string(pc.execution).style(styleBot)
    ws.cell(n, 6).string('').style(styleBot)
    ws.cell(n, 7).string(pc.attachment).style(styleBotRight)
    if (col7width < pc.attachment.length) {
      col7width = pc.attachment.length + 1
    }
    n += 1
    if (pc.pc_unit.length > 0) {
      ws.cell(n, 1).string("").style(firstCellColor)
      ws.cell(n, 2).string('Обозначение изделия').style(styleBoldLeft)
      ws.cell(n, 3).string('Наименование изделия').style(styleBold)
      ws.cell(n, 4).string('Характеристика').style(styleBold)
      ws.cell(n, 5).string('Количество').style(styleBold)
      ws.cell(n, 6).string('Заводской номер').style(styleBold)
      ws.cell(n, 7).string('Примечание').style(styleBoldRight)
      n += 1
      for (const unit of pc.pc_unit) {
        ws.cell(n, 1).string("").style(firstCellColor)
        ws.cell(n, 2).string(unit.fdsi).style(styleLeft)
        if (col2width < unit.fdsi.length) {
          col2width = unit.fdsi.length
        }
        ws.cell(n, 3).string(unit.type).style(style)
        if (col3width < unit.type.length) {
          col3width = unit.type.length
        }
        ws.cell(n, 4).string(unit.name).style(style)
        if (col4width < unit.name.length) {
          col4width = unit.name.length
        }
        ws.cell(n, 5).string(unit.quantity).style(style)
        if (col5width < unit.quantity.length) {
          col5width = unit.quantity.length
        }
        ws.cell(n, 6).string(unit.serial_number).style(style)
        if (col6width < unit.serial_number.length) {
          col6width = unit.serial_number.length
        }
        ws.cell(n, 7).string(unit.notes).style(styleRight)
        if (col7width < unit.notes.length) {
          col7width = unit.notes.length
        }
        n += 1
      }
    }
    if (pc.system_case_unit.length > 0) {
      ws.cell(n, 1).string("").style(firstCellColor)
      ws.cell(n, 2).string('Обозначение изделия').style(styleBoldLeft)
      ws.cell(n, 3).string('Наименование изделия').style(styleBold)
      ws.cell(n, 4).string('Характеристика').style(styleBold)
      ws.cell(n, 5).string('Количество').style(styleBold)
      ws.cell(n, 6).string('Заводской номер').style(styleBold)
      ws.cell(n, 7).string('Примечание').style(styleBoldRight)
      n += 1
      for (const unit of pc.system_case_unit) {
        ws.cell(n, 1).string("").style(firstCellColor)
        ws.cell(n, 2).string(unit.fdsi).style(styleLeft)
        if (col2width < unit.fdsi.length) {
          col2width = unit.fdsi.length
        }
        ws.cell(n, 3).string(unit.type).style(style)
        if (col3width < unit.type.length) {
          col3width = unit.type.length
        }
        ws.cell(n, 4).string(unit.name).style(style)
        if (col4width < unit.name.length) {
          col4width = unit.name.length
        }
        ws.cell(n, 5).string(unit.quantity).style(style)
        if (col5width < unit.quantity.length) {
          col5width = unit.quantity.length
        }
        ws.cell(n, 6).string(unit.serial_number).style(style)
        if (col6width < unit.serial_number.length) {
          col6width = unit.serial_number.length
        }
        ws.cell(n, 7).string(unit.notes).style(styleRight)
        if (col7width < unit.notes.length) {
          col7width = unit.notes.length
        }
        n += 1
        ws.cell(n, 2).string('').style(styleBot1)
        ws.cell(n, 3).string('').style(styleBot1)
        ws.cell(n, 4).string('').style(styleBot1)
        ws.cell(n, 5).string('').style(styleBot1)
        ws.cell(n, 6).string('').style(styleBot1)
        ws.cell(n, 7).string('').style(styleBot1)
      }
    }
    n += 1
  }
  ws.column(1).setWidth(3)
  ws.column(2).setWidth(col2width)
  ws.column(3).setWidth(col3width)
  ws.column(4).setWidth(col4width)
  ws.column(5).setWidth(col5width)
  ws.column(6).setWidth(col6width)
  ws.column(7).setWidth(col7width)

  const appDir = path.dirname(require.main.filename)
  const docDir = appDir + '/public/docx'
  pathToExcel = `${docDir}/excel.xlsx`

  workbook.write(pathToExcel, function () {
    const fileName = req.session.part + '.xlsx'
    console.log('PC report xlsx generated')
    res.download(pathToExcel, fileName)
  })
})


router.get('/:id/passportDocx', auth, async (req, res) => {
  const appDir = path.dirname(require.main.filename)
  const docDir = appDir + '/public/docx'
  const pc = await PC.findById(req.params.id)
  const content = fs.readFileSync(path.resolve(docDir, 'inputOldPass.docx'), 'binary')
  const zip = new PizZip(content)
  let doc = new Docxtemplater()
  doc.loadZip(zip)
  //set the templateVariables
  doc.setData({
    fdsi: pc.fdsi,
    serial_number: pc.serial_number,
    pc_unit: pc.pc_unit,
    system_case_unit: pc.system_case_unit
  })
  try {
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
    throw error
  }
  let buf = doc.getZip().generate({
    type: 'nodebuffer'
  });
  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync(path.resolve(docDir, 'output.docx'), buf)
  const file = `${docDir}/output.docx`
  const fileName = pc.serial_number + '.docx'
  console.log(`Passport #${pc.serial_number} was formed`)
  res.download(file, fileName)
})


router.get('/:id/zipPCEDocx', auth, async (req, res) => {
  const appDir = path.dirname(require.main.filename)
  const docDir = appDir + '/public/docx'

  const pc = await PC.findById(req.params.id)

  var content = fs.readFileSync(path.resolve(docDir, 'inpitcbZip.docx'), 'binary');

  var zip = new PizZip(content);

  var doc = new Docxtemplater();
  doc.loadZip(zip);

  //set the templateVariables
  doc.setData({
    fdsi: pc.fdsi,
    serial_number: pc.serial_number,
    pc_unit: pc.pc_unit,
    system_case_unit: pc.system_case_unit
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
  fs.writeFileSync(path.resolve(docDir, 'output.docx'), buf)
  const file = `${docDir}/output.docx`
  const fileName = pc.serial_number + '-E.docx'
  console.log(`Zip label #${pc.serial_number} was formed`)
  res.download(file, fileName)
})


router.get('/:id/zipDocx', auth, async (req, res) => {
  const appDir = path.dirname(require.main.filename)
  const docDir = appDir + '/public/docx'

  const pc = await PC.findById(req.params.id)

  var content = fs.readFileSync(path.resolve(docDir, 'inputZIP.docx'), 'binary');

  var zip = new PizZip(content);

  var doc = new Docxtemplater();
  doc.loadZip(zip);

  //set the templateVariables
  doc.setData({
    fdsi: pc.fdsi,
    serial_number: pc.serial_number,
    pc_unit: pc.pc_unit,
    system_case_unit: pc.system_case_unit
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
  })
  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync(path.resolve(docDir, 'output.docx'), buf)
  const file = `${docDir}/output.docx`
  const fileName = pc.serial_number + '.docx'
  console.log(`Zip label #${pc.serial_number} was formed`)
  res.download(file, fileName)
})

module.exports = router