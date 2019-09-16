const {Router} = require('express')
const PC = require('../models/pc')
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

router.post('/add', async (req, res) => {
  //arr = req.body.data
  // for (let index = 0; index < arr.length; index++) {
  //   console.log(req.body.data[index])
    
  // }
  const pc_unit = req.body.pc_unit
  console.log(req.body)
  console.log(JSON.parse(pc_unit))
  
  

  const pc = new PC({
    serial_number: req.body.serial_number,
    execution: req.body.execution,
    fdsi: req.body.fdsi,
    part: req.body.part,
    arm: req.body.arm,
    // pc_unit: req.body.pc_unit
  })
  pc.pc_unit.push(pc_unit)

  try {
    await pc.save()
    res.redirect('/pc')
  } catch (e) {
    console.log(e)
  }


})


module.exports = router