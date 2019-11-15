const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const PC = require('../models/pc')
const path = require('path')
const fs = require('fs')
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')


router.get('/', auth, (req, res) => {
  res.render('projects', {
    title: 'Проекты',
    isProjects: true,    
  })
})


router.get('/file', function (req, res) {
  res.download(__dirname + '/document.pdf', 'document.pdf')
})


router.get('/:id/passportDocx', auth, async (req, res) => {
  const appDir = path.dirname(require.main.filename)
  const docDir = appDir + '/public/docx'
 
  const pc = await PC.findById(req.params.id)
    
  var content = fs.readFileSync(path.resolve(docDir, 'input.docx'), 'binary');

  var zip = new PizZip(content);

  var doc = new Docxtemplater();
  doc.loadZip(zip);

  //set the templateVariables
  doc.setData({
      fdsi: pc.fdsi,
      serial_number: pc.serial_number,
      "pc_unit": pc.pc_unit,
      "system_case_unit": pc.system_case_unit
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

  let buf = doc.getZip()
              .generate({type: 'nodebuffer'});

  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync(path.resolve(docDir, 'output.docx'), buf)
  const file = `${docDir}/output.docx`
  const fileName = pc.serial_number + '.docx'
  res.download(file, fileName)
})





module.exports = router