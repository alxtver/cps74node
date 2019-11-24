const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const apkziRoutes = require('./routes/apkzi')
const addRoutes = require('./routes/add')
const pkiRoutes = require('./routes/pkis')
const pcRoutes = require('./routes/pc')
const authRoutes = require('./routes/auth')
const projectsRoutes = require('./routes/projects')
const favicon = require('express-favicon')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const partMiddleware = require('./middleware/part')

const app = express()

const config = require('./config.js')

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

mongoose.set('useCreateIndex', true)
const store = new MongoStore ({
  collection: 'sessions',
  uri: config.url
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(session({
  secret: config.secretkey,
  resave: false,
  saveUninitialized: false,
  store: store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
app.use(partMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/pkis', pkiRoutes)
app.use('/apkzi', apkziRoutes)
app.use('/pc', pcRoutes)
app.use('/projects', projectsRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT || 3000



async function start() {
  try {
    
    await mongoose.connect(config.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      autoReconnect: true
    })
    app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`)
  })    
  } catch (e) {
    console.log(e)
  }  
}

start()
