const {Router} = require('express')
const Pki = require('../models/pc')
const router = Router()
const express = require("express");

const app = express();

router.get('/', async (req, res) => {
  
  res.render('pc', {
    title: 'Машины',
    isPC: true,    
  })
})

router.get('/add', (req, res) => {
    res.render('add_pc', {
      title: 'Добавить ПКИ',
      isAdd: true
    })
  })
module.exports = router