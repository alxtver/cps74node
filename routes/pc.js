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
      title: 'Добавить ПЭВМ',
      isAdd: true
    })
  })

router.post('/add', async (req, res) => {

  const pc = new PC({
    serial_number: req.body.serial_number,
    execution: req.body.execution,
    fdsi: req.body.fdsi,
    part: req.body.part,
    arm: req.body.arm,

  })

  // добавление объектов в массив pc_unit
  const pc_unit = req.body.pc_unit
  json_pc = JSON.parse(pc_unit)
  for(let i = 0; i < json_pc.length; i++) {    
    pc.pc_unit.push(json_pc[i]);
    //console.log(obj);
  }

  // добавление объектов в массив system_case_unit
  const system_case_unit = req.body.system_case_unit
  json_system = JSON.parse(system_case_unit)
  for(let i = 0; i < json_system.length; i++) {    
    pc.system_case_unit.push(json_system[i]);
    //console.log(obj);
  }

  try {
    await pc.save();
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
})

router.post("/search", async function (req, res) {
  if (!req.body.q) {
    pcs = await PC.find()
  } else {
    const query = {
      $or: [{
          type_pki: new RegExp(req.body.q + '.*', "i")
        },
        {
          vendor: new RegExp(req.body.q + '.*', "i")
        },
        {
          country: new RegExp(req.body.q + '.*', "i")
        },
        {
          model: new RegExp(req.body.q + '.*', "i")
        },
        {
          part: new RegExp(req.body.q + '.*', "i")
        },
        {
          serial_number: new RegExp(req.body.q + '.*', "i")
        },
        {
          number_machine: new RegExp(req.body.q + '.*', "i")
        }
      ]
    }
    pcs = await PC.find(query)
  }
  if (!req.body) return res.sendStatus(400);

  res.send(JSON.stringify(pcs)); // отправляем пришедший ответ обратно
});

module.exports = router