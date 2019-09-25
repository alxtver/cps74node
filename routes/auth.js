const {Router} = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {      
    req.session.destroy(() =>{
        res.redirect('/auth/login#login')
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
                req.session.save(err =>{
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                res.redirect('/auth/login')
            }
        } else {
            res.redirect('/auth/login')
        }

    } catch (error) {
        console.log(error)
    }
    
    
})

router.post('/register', async (req, res) =>{
    try {
        const {username, password, repeat, group} = req.body
        const candidate = await User.findOne({username})

        if (candidate) {
            res.redirect('/auth/login')
        } else {
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