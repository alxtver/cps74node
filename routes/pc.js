const {Router} = require('express')
const PC = require('../models/pc')
const PKI = require('../models/pki')
const Part = require('../models/part')
const auth = require('../middleware/auth')
const router = Router()
const express = require("express");

const app = express();

router.get('/', auth, async (req, res) => {
  res.render('pc', {
    title: 'Машины',
    isPC: true,
  })
})

router.get('/add', auth, (req, res) => {
  res.render('add_pc', {
    title: 'Добавить ПЭВМ',
    isAdd: true
  })
})

router.post('/add', auth, async (req, res) => {

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
  for (let i = 0; i < json_pc.length; i++) {
    pc.pc_unit.push(json_pc[i]);
  }

  // добавление объектов в массив system_case_unit
  const system_case_unit = req.body.system_case_unit
  json_system = JSON.parse(system_case_unit)
  for (let i = 0; i < json_system.length; i++) {
    pc.system_case_unit.push(json_system[i])
  }

  try {
    await pc.save();
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
})

router.post("/search", auth, async function (req, res) {

  if (!req.body.q) {
    pcs = await PC.find({
      part: req.body.q
    })
  } else {
    pcs = await PC.find({
      part: req.body.q
    })
  }
  if (!req.body) return res.sendStatus(400);
  res.send(JSON.stringify(pcs)); // отправляем пришедший ответ обратно
});

router.post("/part", auth, async function (req, res) {
  parts = await Part.find()

  if (!req.body) return res.sendStatus(400);

  res.send(JSON.stringify(parts)); // отправляем пришедший ответ обратно
})


router.post('/insert_serial', auth, async (req, res) => {

  try {

    //Жесть пипец!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let pc = await PC.findById(req.body.id) //ищем комп который собираемся редактировать
    let pki = await PKI.findOne({
      part: pc.part,
      serial_number: req.body.serial_number
    })
    if (pki) {
      pki.number_machine = pc.serial_number
      if (req.body.unit == 'pc_unit') {
        pc.pc_unit[req.body.obj].serial_number = req.body.serial_number //ищем серийный номер который хотим поменять и меняем его
        pc.pc_unit[req.body.obj].name = pki.vendor + " " + pki.model
        pc.pc_unit[req.body.obj].type = pki.type_pki
        // a.pc_unit[req.body.obj].name = pki.name

      } else {
        pc.system_case_unit[req.body.obj].serial_number = req.body.serial_number //ищем серийный номер который хотим поменять и меняем его
        pc.system_case_unit[req.body.obj].name = pki.vendor + " " + pki.model
        pc.system_case_unit[req.body.obj].type = pki.type_pki
      }
      // a.save() - нихрена не работает, хотя должно
      let arr_pc_unit = pc.pc_unit
      let arr_system_case_unit = pc.system_case_unit // присваеваем гребаной переменной массив с компанентами
      let pc_copy = await PC.findById(req.body.id) // открываем еще один экземпляр
      pc_copy.pc_unit = arr_pc_unit
      pc_copy.system_case_unit = arr_system_case_unit // присваеваем

      await pc_copy.save() // и СУКА работает...
      await pki.save()
      res.send(JSON.stringify(pc_copy))
    } else {
      res.sendStatus(400)
    }

  } catch (error) {
    console.log(error)
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const pc = await PC.findById(req.params.id)
  
  res.render('pc-edit', {
    title: `Редактирование ${pc.serial_number}`,
    pc
  })

})

module.exports = router