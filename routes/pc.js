const {Router} = require('express')
const PC = require('../models/pc')
const Part = require('../models/part')
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

  const part = new Part({
    part: req.body.part
  })

  try {
    await part.save()
  } catch (e) {
    console.log(e)
  }

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
  }

  // добавление объектов в массив system_case_unit
  const system_case_unit = req.body.system_case_unit
  json_system = JSON.parse(system_case_unit)
  for(let i = 0; i < json_system.length; i++) {    
    pc.system_case_unit.push(json_system[i])
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
    pcs = await PC.find({part: req.body.q})
  } else {  
    pcs = await PC.find({part: req.body.q})
  }
  if (!req.body) return res.sendStatus(400);
  // console.log(pcs)
  res.send(JSON.stringify(pcs)); // отправляем пришедший ответ обратно
});

router.post("/part", async function (req, res) {
  parts = await Part.find()
  
  if (!req.body) return res.sendStatus(400);

  res.send(JSON.stringify(parts)); // отправляем пришедший ответ обратно
})


router.post('/insert_serial', async (req, res) => {
  try {
  //  console.log(req.body)
    //Жесть пипец!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    let a = await PC.findById(req.body.id);                         //ищем комп который собираемся редактировать
    a.pc_unit[req.body.obj].serial_number = req.body.serial_number  //ищем серийный номер который хотим поменять и меняем его
                                                                    // a.save() - нихрена не работает, хотя должно
    let arr_pc_unit = a.pc_unit                                     // присваеваем гребаной переменной массив с компанентами                                                                    
    let b = await PC.findById(req.body.id)                          // открываем еще один экземпляр
    b.pc_unit = arr_pc_unit                                                 // присваеваем
    b.save();                                                       // и СУКА работает...

    res.sendStatus(200)

    if (!req.body) return res.sendStatus(400);
  } catch (error) {
    console.log(error)
  }  
})

module.exports = router