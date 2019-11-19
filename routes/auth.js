const {Router} = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('../models/user')
const auth = require('../middleware/auth')


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})


router.get('/register', auth, async (req, res) => {
    if (req.session.user.group == 'admins'){
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
    req.session.destroy(() =>{
        res.redirect('/auth/login')
    })
})


router.post('/login', async (req, res) =>{
    
    try {
        const {username, password} = req.body        
        const candidate = await User.findOne({username})
        
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate                
                req.session.isAuthenticated = true
                req.session.group = candidate.group
                req.session.save(err =>{
                    if (err) {
                        throw err
                    }
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


router.post('/register', async (req, res) =>{
    
    try {
        const {username, password, passagain, group} = req.body       
        const candidate = await User.findOne({username})

        if (candidate) {
            req.flash('registerError', 'Пользователь с таким ником уже существует')
            res.redirect('/auth/register')
        } else if (password != passagain) {
            req.flash('registerError', 'Пароли не совпадают')
            res.redirect('/auth/register')
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                username, group, password: hashPassword
            })
            await user.save()
            res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = router