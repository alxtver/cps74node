const {
  Router
} = require('express')
const PC = require('../models/pc')
const PKI = require('../models/pki')
const APKZI = require('../models/apkzi')
const Part = require('../models/part')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, async (req, res) => {  
  res.render('pc', {
    title: 'Машины',
    isPC: true,
    part: req.query.part,
    serial_number: req.query.serial_number
  })
})


router.get('/add', auth, (req, res) => {
  res.render('add_pc', {
    title: 'Добавить ПЭВМ',
    isAdd: true
  })
})

router.post('/add', auth, async (req, res) => {
  // если нет такого проекта, то сохраняем
  const part = await Part.findOne({
    part: req.body.part
  })
  if (!part) {
    const part_add = new Part({
      part: req.body.part
    })
    try {
      await part_add.save()
    } catch (error) {
      console.log(error)
    }
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
})


router.post("/part", auth, async function (req, res) {
  parts = await Part.find()
  if (!req.body) return res.sendStatus(400);
  res.send(JSON.stringify(parts)); // отправляем пришедший ответ обратно
})


router.post('/insert_serial', auth, async (req, res) => {
  //Жесть пипец!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  let pc = await PC.findById(req.body.id) //ищем комп который собираемся редактировать
  let pc_copy = await PC.findById(req.body.id) //и копию....
  let pki = await PKI.findOne({part: pc.part, serial_number: req.body.serial_number})
  let oldNumberMachine
  const unit = req.body.unit

  //Если серийник есть, то ищем ПКИ с таким серийником и отвязываем от машины
  let oldPKI = await PKI.findOne({part: pc.part, serial_number: pc[unit][req.body.obj].serial_number})
  if (oldPKI){
    oldPKI.number_machine = ''
    await oldPKI.save()
  }
  // Проверяем был ли привязан ПКИ к машине и привязываем к новой машине
  if (pki) {
    if (pki.number_machine){      
      if (pki.number_machine == pc.serial_number){
        pki.number_machine = ''
      } else {
        oldNumberMachine = pki.number_machine
      }
    }
    pki.number_machine = pc.serial_number
    pki.save()
    // Добавляем ПКИ к новой машине
    pc[unit][req.body.obj].serial_number = req.body.serial_number //меняем серийник
    pc[unit][req.body.obj].name = pki.vendor + " " + pki.model    //меняем имя
    pc[unit][req.body.obj].type = pki.type_pki                    //меняем тип
    pc_copy[unit] = pc[unit]
    await pc_copy.save()
    
  } else {
    pc[unit][req.body.obj].serial_number = req.body.serial_number
    pc[unit][req.body.obj].name = "Н/Д"
    pc_copy[unit] = pc[unit]
    await pc_copy.save()
  }

  // Если ПКИ был привязан удаляем ПКИ из старой машины
  if (oldNumberMachine) {
    let oldPC = await PC.findOne({serial_number: oldNumberMachine})
    for (let index = 0; index < oldPC[unit].length; index++) {
      if (oldPC[unit][index].serial_number == pki.serial_number) {
        oldPC[unit][index].serial_number = ''
        oldPC[unit][index].name = ''
      }
    }
    let newOldPC = await PC.findOne({serial_number: oldNumberMachine})
    newOldPC[unit] = oldPC[unit]
    newOldPC.save()
  }
  
  res.send(JSON.stringify(pc_copy))
})

router.post('/insert_serial_apkzi', auth, async (req, res) => {
  //Жесть пипец!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
  let pc = await PC.findById(req.body.id) //ищем комп который собираемся редактировать
  let pc_copy = await PC.findById(req.body.id) //и копию....
  
  let apkzi = await APKZI.findOne({part: pc.part, kontr_zav_number: req.body.serial_number})
  let oldNumberMachine
  const unit = req.body.unit
  // console.log(apkzi)

  // Если серийник есть, то ищем ПКИ с таким серийником и отвязываем от машины
  let oldapkzi = await APKZI.findOne({part: pc.part, kontr_zav_number: pc[unit][req.body.obj].serial_number})
  if (oldapkzi){
    oldapkzi.number_machine = ''
    await oldapkzi.save()
  }
  // Проверяем был ли привязан APKZI к машине и привязываем к новой машине
  if (apkzi) {
    if (apkzi.number_machine){      
      if (apkzi.number_machine == pc.serial_number){
        apkzi.number_machine = ''
      } else {
        oldNumberMachine = apkzi.number_machine
      }
    }
    apkzi.number_machine = pc.serial_number
    apkzi.save()
    // Добавляем APKZI к новой машине
    pc[unit][req.body.obj].serial_number = req.body.serial_number //меняем серийник
    let kontr_name = apkzi.kont_name
    const arr_kontr_name = kontr_name.split(' ')
    const arr_end = arr_kontr_name.slice(-1)
    const arr_start = arr_kontr_name.slice(0, -1) 
    pc[unit][req.body.obj].name = arr_end //меняем тип
    pc[unit][req.body.obj].type = arr_start.join(' ')  //меняем имя
    // pc[unit][req.body.obj].fdsi = apkzi.fdsi
    
    // console.log(pc.pc_unit[7]);
    let index_apkzi
    for (let index = 0; index < pc.pc_unit.length; index++) {
      if (pc.pc_unit[index].apkzi) {
        index_apkzi = index
        break
      }    
    }
    
    const apkzi_name = apkzi.apkzi_name
    const arr_apkzi_name = apkzi_name.split(' ')
    const arr_apkzi_end = arr_apkzi_name.slice(-1)
    const arr_apkzi_start = arr_apkzi_name.slice(0, -1) 
    
    pc.pc_unit[index_apkzi].fdsi = 'ФДШИ. ' + apkzi.fdsi
    pc.pc_unit[index_apkzi].type = arr_apkzi_start 
    pc.pc_unit[index_apkzi].name = arr_apkzi_end 
    pc.pc_unit[index_apkzi].serial_number = apkzi.zav_number
                     
    pc_copy[unit] = pc[unit]
    pc_copy.pc_unit = pc.pc_unit
    await pc_copy.save()
    
  } else {
    pc[unit][req.body.obj].serial_number = req.body.serial_number
    pc[unit][req.body.obj].name = "Н/Д"
    let index_apkzi
    for (let index = 0; index < pc.pc_unit.length; index++) {
      if (pc.pc_unit[index].apkzi) {
        index_apkzi = index
        break
      }    
    }

    pc.pc_unit[index_apkzi].name = "Н/Д"
    pc.pc_unit[index_apkzi].serial_number = ""

    pc_copy[unit] = pc[unit]
    pc_copy.pc_unit = pc.pc_unit
    await pc_copy.save()
  }

  // // Если ПКИ был привязан удаляем ПКИ из старой машины
  // if (oldNumberMachine) {
  //   let oldPC = await PC.findOne({serial_number: oldNumberMachine})  
  //   oldPC[unit][req.body.obj].serial_number = ''
  //   oldPC[unit][req.body.obj].name = ''
  //   let newOldPC = await PC.findOne({serial_number: oldNumberMachine})
  //   newOldPC[unit] = oldPC[unit]
  //   newOldPC.save()
  // }
  res.send(JSON.stringify(pc_copy))
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const pc = await PC.findById(req.params.id)

  res.render('pc-edit', {
    title: `Редактирование ${pc.serial_number}`,
    pc: pc
  })
})


router.post('/copy', auth, async (req, res) => {
  const pc = await PC.findById(req.body.id)
  let newPC = new PC({
    serial_number: req.body.serial_number,
    execution: pc.execution,
    fdsi: pc.fdsi,
    part: pc.part,
    arm: pc.arm,
    pc_unit: []
  })

  for (unit of pc.pc_unit) {
    if (unit.serial_number == pc.serial_number) {
      unit.serial_number = req.body.serial_number
      newPC.pc_unit.push(unit)
    } else if (unit.serial_number == 'б/н' || unit.serial_number == 'Б/Н' || unit.serial_number == 'Б/н') {
      newPC.pc_unit.push(unit)
    } else {
      unit.name = ''
      unit.serial_number = ''
      newPC.pc_unit.push(unit)
    }
  }

  for (unit of pc.system_case_unit) {
    if (unit.serial_number == pc.serial_number) {
      unit.serial_number = req.body.serial_number
      newPC.system_case_unit.push(unit)
    } else if (unit.serial_number == 'б/н' || unit.serial_number == 'Б/Н' || unit.serial_number == 'Б/н') {
      newPC.system_case_unit.push(unit)
    } else {
      unit.name = ''
      unit.serial_number = ''
      newPC.system_case_unit.push(unit)
    }
  }
  try {
    await newPC.save()
    res.render('pc', {
      title: 'Машины',
      isPC: true,
      part: pc.part
    })
  } catch (error) {
    console.log(error)
  }
})


router.post('/find_serial', auth, async (req, res) => {
  const pc = await PC.findOne({
    serial_number: req.body.serial
  })
  if (pc) {
    res.send(true)
  } else {
    res.send(false)
  }
})

router.post('/pc_edit', auth, async (req, res) => {
  const pc = await PC.findById(req.body.id)
  if (pc) {
    res.send(JSON.stringify(pc))
  } else {
    res.send(false)
  }
})

router.post('/check_serial', auth, async (req, res) => {  
  const pki = await PKI.findOne({serial_number: req.body.serial_number})
  if (pki) {
    if (pki.number_machine) {
      res.send(pki.number_machine)
    } else {
      res.send('ok')
    }
  } else {
    res.send('ok')
  }
  
})

router.post('/pc_update', auth, async (req, res) => {  
  const pc = await PC.findById(req.body.id)
  
  newPCUnit = []
  newSystemCaseUnit = []
  // добавление объектов в массив pc_unit
  const pc_unit = req.body.pc_unit
  json_pc = JSON.parse(pc_unit)
  for (let i = 0; i < json_pc.length; i++) {
    newPCUnit.push(json_pc[i]);
  }

  // добавление объектов в массив system_case_unit
  const system_case_unit = req.body.system_case_unit
  json_system = JSON.parse(system_case_unit)
  for (let i = 0; i < json_system.length; i++) {
    newSystemCaseUnit.push(json_system[i])
  }
  pc.pc_unit = newPCUnit
  pc.system_case_unit = newSystemCaseUnit
  await pc.save()
  
})


module.exports = router