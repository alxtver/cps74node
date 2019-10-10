const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const PC = require('../models/pc')


var fonts = {
  Roboto: {
    normal: './public/fonts/Roboto-Regular.ttf',
    bold: './public/fonts/Roboto-Medium.ttf',
    italics: './public/fonts/Roboto-Italic.ttf',
    bolditalics: './public/fonts/Roboto-MediumItalic.ttf'
  }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

router.get('/', auth, (req, res) => {
  res.render('projects', {
    title: 'Проекты',
    isProjects: true,    
  })
})

router.post('/passport', auth, async (req, res) => {
  const pc = await PC.findById(req.body.id)
  var PdfPrinter = require('pdfmake');
  var printer = new PdfPrinter(fonts);
  var fs = require('fs');

  var docDefinition = {
    content: [
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [ '*', 'auto', 10, '*', 'auto' ],
  
          body: [
            [ 'First', 'Second', 'Third', 'The last one', 'Эта последняя' ],
            [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' , 'Эта последняя' ],
            [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4', ''  ]
          ]
        }
      }
    ]
  };

  var options = {
    // ...
  }

  var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.pipe(fs.createWriteStream(__dirname + '/document.pdf'));
  
  pdfDoc.end()


  var file = __dirname + '/document.pdf';
  // res.writeHead(200, {'Content-Type': 'application/pdf'})
  await res.sendFile(file)
  
  })


module.exports = router