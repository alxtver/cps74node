const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const PC = require('../models/pc')
const path = require('path')



const appDir = path.dirname(require.main.filename)
const HummusRecipe = require('hummus-recipe');
const input = appDir + '/public/pdf/pdf_temp.pdf'
const output = appDir + '/public/pdf/output.pdf'
const pdfDoc = new HummusRecipe(input, output)

pdfDoc
    // edit 1st page
    .editPage(1)
    .text('Текст один', 0, 0)
    .text('Еще один текст', 0, 20)
    .text('И тут текста много', 100, 100)
    .endPage()
    // end and save
    .endPDF();

router.get('/', auth, (req, res) => {
  res.render('projects', {
    title: 'Проекты',
    isProjects: true,    
  })
})


router.get('/file', function (req, res) {
  res.download(__dirname + '/document.pdf', 'document.pdf')
})





router.get('/:id/passport', auth, async (req, res) => {
  const pc = await PC.findById(req.params.id)
  
 
  
  setTimeout(() => {
    res.download(__dirname + '/document.pdf', 'document.pdf')
  }, 30);
  

  
})


module.exports = router