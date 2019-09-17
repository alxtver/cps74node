const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const pkiRoutes = require('./routes/pkis')
const pcRoutes = require('./routes/pc')
const favicon = require('express-favicon');

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/pkis', pkiRoutes)
app.use('/card', cardRoutes)
app.use('/pc', pcRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = 'mongodb+srv://admin:ccz1rpm8t!@cluster0-rqbxt.mongodb.net/cps74'
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false  
    })
    app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`)
  })    
  } catch (e) {
    console.log(e)
  }  
}

start()


