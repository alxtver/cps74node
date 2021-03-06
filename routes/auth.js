const {
  Router
} = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const LOG = require('../models/logs')
const authAdmin = require('../middleware/authAdmin')


router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
})


router.get('/register', authAdmin, async (req, res) => {
  if (req.session.user.group == 'admins') {
    res.render('auth/register', {
      title: 'Регистрация',
      isLogin: true,
      registerError: req.flash('registerError')
    })
  } else {
    res.redirect('/auth/login')
  }
})


router.get('/logout', async (req, res) => {
  if (req.session.user.username == 'Kalinin') {
    console.log(`User ${req.session.user.username}👑 is logout`)
  } else {
    console.log(`User ${req.session.user.username} is logout`)
  }
  let note = `User ${req.session.user.username} is logout`
  let log = new LOG({
    event: 'User logout',
    note: note,
    user: req.session.user.username,
    part: req.session.part
  })
  log.save()
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
})


router.post('/login', async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body
    const candidate = await User.findOne({
      username
    })
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.group = candidate.group
        if (req.session.user.username == 'Kalinin') {
          console.log(`User ${req.session.user.username}👑 is logged`)
        } else {
          console.log(`User ${req.session.user.username} is logged`)
        }
        req.session.save(async err => {
          if (err) {
            throw err
          }
          let note = `User ${req.session.user.username} is logged`
          let log = new LOG({
            event: 'User login',
            note: note,
            user: req.session.user.username
          })
          log.save()
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Неверный пароль')
        res.redirect('/auth/login')
      }
    } else {
      req.flash('loginError', 'Такого пользователя не существует.')
      res.redirect('/auth/login')
    }
  } catch (error) {
    console.log(error)
  }
})


router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      passagain,
      group
    } = req.body
    const candidate = await User.findOne({
      username
    })

    if (candidate) {
      req.flash('registerError', 'Пользователь с таким ником уже существует')
      res.redirect('/auth/register')
    } else if (password != passagain) {
      req.flash('registerError', 'Пароли не совпадают')
      res.redirect('/auth/register')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        username,
        group,
        password: hashPassword
      })
      await user.save()
      let note = `User ${username} is register`
      let log = new LOG({
        event: 'User register',
        note: note,
        user: req.session.user.username
      })
      log.save()
      res.redirect('/auth/login')
    }

  } catch (e) {
    console.log(e)
  }
})

module.exports = router