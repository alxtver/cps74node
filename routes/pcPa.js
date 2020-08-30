const {
  Router, query
} = require('express')
const PC = require('../models/pc')
const PKI = require('../models/pki')
const APKZI = require('../models/apkzi')
const Part = require('../models/part')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router()
const snReModifer = require('./foo/snReModifer')


router.get('/', auth, async (req, res) => {
  const countPC = await PC.countDocuments({part: req.session.part})
  let user = await User.findOne({username: req.session.user.username})
  let pages = Math.ceil(countPC/10)
  let pcCount = user.pcCount
  if (user.pcCount) {
    let count = user.pcCount
    if (count === '1' || count === '5' || count === '10' || count === '20') {
      pages = Math.ceil(countPC/parseInt(count))
    } else if (count === 'all') {
      pages = 1
    } else if (count === 'supplement') {
      const attach = await PC.find({part: req.session.part}).distinct('attachment')
      const attachNumbers = attach.map(function(a) {
        return a.replace(/[^\d]/gim,'')
      })
      const uniqueSet = new Set(attachNumbers)
      pages = uniqueSet.size
    }
  } else {
    pages = 1
    pcCount = 'all'
  }
  res.render('pcPa', {
    title: 'Машины',
    isPC: true,
    part: req.session.part,
    serial_number: req.query.serial_number,
    pages: pages,
    pcCount: pcCount
  })
})

router.post('/pageCount', auth, async (req, res) => {
  let user = await User.findOne({username: req.session.user.username})
  user.pcCount = req.body.pageCount
  await user.save()
  res.status(200).json({ message: 'ok' })
})


router.get('/add', auth, (req, res) => {
  res.render('add_pc', {
    title: 'Добавить ПЭВМ',
    isAdd: true,
    part: req.session.part
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
  let execution
  if (req.body.execution) {
    execution = req.body.execution
  } else {
    execution = ''
  }

  let attachment
  if (req.body.attachment) {
    attachment = req.body.attachment
  } else {
    attachment = ''
  }

  const pc = new PC({
    serial_number: req.body.serial_number,
    execution: execution,
    fdsi: req.body.fdsi,
    part: req.body.part,
    arm: req.body.arm,
    attachment: req.body.attachment
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
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
})


router.post("/search", auth, async function (req, res) {
  pcs = await PC.find({
    part: req.session.part
  }).sort({
    'created': 1
  })
  res.send(JSON.stringify(pcs))
})


router.post("/pagination", auth, async function (req, res) {
  let page = parseInt(req.body.page)
  let user = await User.findOne({username: req.session.user.username})
  let pcs
  if (user.pcCount) {
    let count = user.pcCount
    if (count === '1' || count === '5' || count === '10' || count === '20') {
      let intCount = parseInt(count)
      pcs = await PC.find({
        part: req.session.part
      }).sort({
        'created': 1
      }).skip(page * intCount - intCount).limit(intCount)
    }  else if (count === 'all') {
      pcs = await PC.find({part: req.session.part}).sort({'created': 1})
    } else if (count === 'supplement') {
      const attach = await PC.find({part: req.session.part}).distinct('attachment')
      const attachNumbers = attach.map(function(a) {
        return a.replace(/[^\d]/gim,'')
      })
      const uniqueSet = new Set(attachNumbers)
      const backToArray = [...uniqueSet]
      const query = {
        $and: [{
            $or: [{
              attachment: new RegExp(backToArray[page-1] + '.*', "i")
              }
            ]
          },
          {
            part: req.session.part
          }
        ]
      }
      pcs = await PC.find(query).sort({
        'created': 1
      })
    }
  } else {
    pcs = await PC.find({part: req.session.part}).sort({'created': 1})
  }
  res.send(JSON.stringify(pcs))
})


router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  const pc = await PC.findById(req.params.id).lean()

  res.render('pc-editPa', {
    title: `Редактирование ${pc.serial_number}`,
    pc: pc
  })
})


router.post("/part", async function (req, res) {
  const parts = await Part.find().sort({
    created: -1
  })
  let currentPartId
  for (const part of parts) {
    if (part.part == req.session.part) {
      currentPartId = part._id
      break
    }
  }
  if (!req.body) return res.sendStatus(400);
  res.send(JSON.stringify({
    parts: parts,
    currentPartId: currentPartId
  }))
})


router.post('/insert_serial', auth, async (req, res) => {
  //Жесть пипец!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const selected = req.body.part
  let pc = await PC.findById(req.body.id) //ищем комп который собираемся редактировать
  let pc_copy = await PC.findById(req.body.id) //и копию....
  let serial_number = req.body.serial_number
  const unit = req.body.unit
  let pki = await PKI.findOne({
    part: pc.part,
    serial_number: serial_number
  })

  if (!pki) {
    let snReMod = await snReModifer(serial_number, pc.part)
    serial_number = snReMod.SN
    pki = snReMod.pki
  }
  

  // // проверка на гребаные сидюки два запроса вместо одного
  // if (!pki) {
  //   pki = await PKI.findOne({
  //     part: pc.part,
  //     serial_number: serial_number.split(' ').reverse().join(' ')
  //   })
  //   if (pki) {
  //     serial_number = serial_number.split(' ').reverse().join(' ')
  //   }
  // }

  // // проверка на левый серийник Gigabyte
  // if (!pki) {
  //   let regex = /SN\w*/g
  //   if (serial_number.match(regex)) {
  //     pki = await PKI.findOne({
  //       part: pc.part,
  //       serial_number: serial_number.match(regex)[0]
  //     })
  //     if (pki) {
  //       serial_number = serial_number.match(regex)[0]
  //     }
  //   }
  // }

  // // проверка на черточки в мониках DELL
  // if (!pki && serial_number.length == 20) {
  //   let modifiedSN = ''
  //   for (let i = 0; i < serial_number.length; i++) {
  //     modifiedSN += serial_number[i]
  //     if (i == 1 || i == 7 || i == 12 || i == 15) {
  //       modifiedSN += '-'
  //     }
  //   }

  //   query = {
  //     $and: [{
  //         $or: [{
  //           serial_number: new RegExp(modifiedSN + '.*', "i")
  //         }]
  //       },
  //       {
  //         part: req.session.part
  //       }
  //     ]
  //   }
  //   pki = await PKI.findOne(query)
  //   if (pki) {
  //     serial_number = pki.serial_number
  //   }
  // }

  let oldPki // ПКИ который раньше был на этом месте  
  if (pc[unit][req.body.obj].serial_number) {
    oldPki = await PKI.findOne({
      part: pc.part,
      serial_number: pc[unit][req.body.obj].serial_number
    })
    if (oldPki) {
      if (oldPki.number_machine != pc.serial_number) {
        oldPki.number_machine = ''
        await oldPki.save()
      } else {
        // если ПКИ задублировались, то чтобы при удалении одного не отвязывался другой
        // применяем цикл
        let countPki = 0
        for (let index = 0; index < pc[unit].length; index++) {
          if (pc[unit][index].serial_number == oldPki.serial_number) {
            countPki += 1
          }
        }
        if (countPki <= 1) {
          oldPki.number_machine = ''
          await oldPki.save()
        }
      }
    }
  }

  let oldNumberMachine //номер машины, который раньше был у ПКИ
  if (pki) {
    if (pki.number_machine) {
      oldNumberMachine = pki.number_machine
      pki.number_machine = pc.serial_number
      await pki.save()
    }
  }

  // Если ПКИ был привязан удаляем ПКИ из старой машины
  if (oldNumberMachine) {
    if (oldNumberMachine != pc.serial_number) {
      let oldPC = await PC.findOne({serial_number: oldNumberMachine})
      if (oldPC) {
        for (let index = 0; index < oldPC[unit].length; index++) {
          if (oldPC[unit][index].serial_number == pki.serial_number) {
            oldPC[unit][index].serial_number = ''
            oldPC[unit][index].name = 'Н/Д'
          }
        }
        let newOldPC = await PC.findOne({serial_number: oldNumberMachine})
        newOldPC[unit] = oldPC[unit]
        await newOldPC.save()
      }
    }
  }

  // Проверяем был ли привязан ПКИ к машине и привязываем к новой машине
  if (pki) {
    if (pki.number_machine) {
      if (pki.number_machine == pc.serial_number) {
        pki.number_machine = ''
      } else {
        oldNumberMachine = pki.number_machine
      }
    }
    pki.number_machine = pc.serial_number
    await pki.save()
    // Добавляем ПКИ к новой машине
    pc[unit][req.body.obj].serial_number = serial_number //меняем серийник
    pc[unit][req.body.obj].name = pki.vendor + " " + pki.model //меняем имя
    pc[unit][req.body.obj].type = pki.type_pki //меняем тип
    pc_copy[unit] = pc[unit]
    await pc_copy.save()

  } else {
    pc[unit][req.body.obj].serial_number = serial_number
    pc[unit][req.body.obj].name = "Н/Д"
    pc_copy[unit] = pc[unit]
    await pc_copy.save()
  }



  res.send(JSON.stringify({
    pc: pc_copy,
    oldNumberMachine: oldNumberMachine
  }))


})


router.post('/insert_serial_apkzi', auth, async (req, res) => {
  //Жесть пипец!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  let pc = await PC.findById(req.body.id) //ищем комп который собираемся редактировать
  let pc_copy = await PC.findById(req.body.id) //и копию....  
  let serial_number = req.body.serial_number
  let apkzi = await APKZI.findOne({
    part: pc.part,
    kontr_zav_number: serial_number
  })
  let oldNumberMachine
  const unit = req.body.unit

  // Если серийник есть, то ищем ПКИ с таким серийником и отвязываем от машины
  let oldapkzi = await APKZI.findOne({
    part: pc.part,
    kontr_zav_number: pc[unit][req.body.obj].serial_number
  })
  if (oldapkzi) {
    oldapkzi.number_machine = ''
    await oldapkzi.save()
  }
  // Проверяем был ли привязан APKZI к машине и привязываем к новой машине
  if (apkzi) {
    if (apkzi.number_machine) {
      if (apkzi.number_machine == pc.serial_number) {
        apkzi.number_machine = ''
      } else {
        oldNumberMachine = apkzi.number_machine
      }
    }
    apkzi.number_machine = pc.serial_number
    apkzi.save()
    // Добавляем APKZI к новой машине
    pc[unit][req.body.obj].serial_number = serial_number //меняем серийник
    let kontr_name = apkzi.kont_name
    const arr_kontr_name = kontr_name.split(' ')
    const arr_end = arr_kontr_name.slice(-1).join('')
    const arr_start = arr_kontr_name.slice(0, -1)
    pc[unit][req.body.obj].name = arr_end //меняем тип
    pc[unit][req.body.obj].type = arr_start.join(' ') //меняем имя
    // pc[unit][req.body.obj].fdsi = apkzi.fdsi

    let index_apkzi
    for (let index = 0; index < pc.pc_unit.length; index++) {
      if (pc.pc_unit[index].apkzi) {
        index_apkzi = index
        break
      }
    }

    const apkzi_name = apkzi.apkzi_name
    const arr_apkzi_name = apkzi_name.split(' ')
    const arr_apkzi_end = arr_apkzi_name.slice(-1).join('')
    const arr_apkzi_start = arr_apkzi_name.slice(0, -1).join('')

    if (index_apkzi) {
      pc.pc_unit[index_apkzi].fdsi = 'ФДШИ. ' + apkzi.fdsi
      pc.pc_unit[index_apkzi].type = arr_apkzi_start
      pc.pc_unit[index_apkzi].name = arr_apkzi_end
      pc.pc_unit[index_apkzi].serial_number = apkzi.zav_number
    } else {
      pc[unit][req.body.obj].notes = arr_apkzi_start + ' ' + arr_apkzi_end + ' ' + apkzi.zav_number
    }


    pc_copy[unit] = pc[unit]
    pc_copy.pc_unit = pc.pc_unit
    await pc_copy.save()

  } else {
    pc[unit][req.body.obj].serial_number = serial_number
    pc[unit][req.body.obj].name = "Н/Д"
    let index_apkzi
    for (let index = 0; index < pc.pc_unit.length; index++) {
      if (pc.pc_unit[index].apkzi) {
        index_apkzi = index
        break
      }
    }
    if (index_apkzi) {
      pc.pc_unit[index_apkzi].name = "Н/Д"
      pc.pc_unit[index_apkzi].serial_number = ""
    }
    pc_copy[unit] = pc[unit]
    pc_copy.pc_unit = pc.pc_unit
    await pc_copy.save()
  }

  // Если ПКИ был привязан удаляем ПКИ из старой машины
  if (oldNumberMachine) {
    let oldPC = await PC.findOne({
      serial_number: oldNumberMachine
    })
    oldPC[unit][req.body.obj].serial_number = ''
    oldPC[unit][req.body.obj].name = ''
    let newOldPC = await PC.findOne({
      serial_number: oldNumberMachine
    })
    newOldPC[unit] = oldPC[unit]
    newOldPC.save()
  }
  res.send(JSON.stringify(pc_copy))
})


router.post('/copy', auth, async (req, res) => {
  const pc = await PC.findById(req.body.id)

  function plusOne(number) {
    let indexChar = 0
    for (let index = 0; index < number.length; index++) {
      if (!/\d/.test(number[index])) {
        indexChar = index
      }
    }
    let first_part = number.slice(0, indexChar + 1)
    let second_part = number.slice(indexChar + 1)
    let lenSecondPart = second_part.length
    return first_part + (parseInt(second_part) + 1).toString().padStart(lenSecondPart, "0")
  }

  let reqSerial = req.body.serial_number
  let range = reqSerial.split(';')
  if (range.length > 1) {
    let firstNumber = range[0].trim() //убираем пробелы, если есть
    let lastNumber = range[1].trim()
    let number = firstNumber
    while (number != plusOne(lastNumber)) {
      const pc = await PC.findById(req.body.id)
      checkPCNumber = await PC.findOne({
        serial_number: number
      })
      if (!checkPCNumber) {
        let newPC = new PC({
          serial_number: number,
          execution: pc.execution,
          fdsi: pc.fdsi,
          part: pc.part,
          arm: pc.arm,
          back_color: pc.back_color,
          attachment: pc.attachment,
          pc_unit: [],
          system_case_unit: []
        })

        for (unit of pc.pc_unit) {
          if (unit.serial_number == pc.serial_number) {
            unit.serial_number = number
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
            unit.serial_number = number
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

        } catch (error) {
          console.log(error)
        }
      }

      number = plusOne(number)
    }
    res.redirect('/pcPa')
    // res.render('pcPa', {
    //   title: 'Машины',
    //   isPC: true,
    //   part: pc.part
    // })
  } else {
    let newPC = new PC({
      serial_number: req.body.serial_number,
      execution: pc.execution,
      fdsi: pc.fdsi,
      part: pc.part,
      arm: pc.arm,
      back_color: pc.back_color,
      attachment: pc.attachment,
      pc_unit: [],
      system_case_unit: []
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
      res.redirect('/pcPa')
      // res.render('pcPa', {
      //   title: 'Машины',
      //   isPC: true,
      //   part: pc.part
      // })
    } catch (error) {
      console.log(error)
    }
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


router.post('/pc_update', auth, async (req, res) => {
  const pc = await PC.findById(req.body.id)
  const serialNumber = pc.serial_number  
  pc.part = req.body.part
  pc.fdsi = req.body.fdsi
  pc.serial_number = req.body.serial_number
  pc.arm = req.body.arm
  pc.execution = req.body.execution
  pc.attachment = req.body.attachment
  pc.back_color = req.body.color
  let newPCUnit = []
  let newSystemCaseUnit = []
  // добавление объектов в массив pc_unit
  const pc_unit = req.body.pc_unit
  let json_pc = JSON.parse(pc_unit)
  for (let i = 0; i < json_pc.length; i++) {
    newPCUnit.push(json_pc[i]);
  }
  // добавление объектов в массив system_case_unit
  const system_case_unit = req.body.system_case_unit
  let json_system = JSON.parse(system_case_unit)
  for (let i = 0; i < json_system.length; i++) {
    newSystemCaseUnit.push(json_system[i])
  }
  pc.pc_unit = newPCUnit
  pc.system_case_unit = newSystemCaseUnit
  await pc.save()
  // изменение привязки ПКИ при изменении серийника машины
  if (serialNumber != req.body.serial_number) {
    await PKI.updateMany({
      part: pc.part,
      number_machine: serialNumber
    }, {
      number_machine: req.body.serial_number
    })
  }
})


router.post('/delete', auth, async (req, res) => {
  const countPC = await PC.countDocuments({part: req.session.part}) - 1
  const pc = await PC.findById(req.body.id)
  const user = await User.findOne({username: req.session.user.username})
  const pcCountOnPage = user.pcCount
  let page = req.body.page
  if (!page) {
    page = 1
  } else {
    parseInt(page)
  }
  if (pcCountOnPage === '1' || pcCountOnPage === '5' || pcCountOnPage === '10' || pcCountOnPage === '20') {
    pages = Math.ceil(countPC/parseInt(pcCountOnPage))
  } else if (pcCountOnPage === 'all') {
    pages = 1
  } else if (pcCountOnPage === 'supplement') {
    const attach = await PC.find({part: req.session.part}).distinct('attachment')
    const attachNumbers = attach.map(function(a) {
      return a.replace(/[^\d]/gim,'')
    })
    const uniqueSet = new Set(attachNumbers)
    pages = uniqueSet.size
  }
  if (page > pages) {
    --page 
  }
  
  await PKI.updateMany({
    part: pc.part,
    number_machine: pc.serial_number
  }, {
    number_machine: ''
  })
  await APKZI.updateMany({
    part: pc.part,
    number_machine: pc.serial_number
  }, {
    number_machine: ''
  })
  await PC.deleteOne({
    _id: req.body.id
  })
  res.send(JSON.stringify({
    page: page,
    pages: pages
  }))
})


router.post('/test', auth, async (req, res) => {
  const pcs = await PC.find({
    part: req.session.part
  })
  let serials = []
  let results = []
  for (const pc of pcs) {
    var status = 'ok'
    if (pc.pc_unit.length > 0) {
      for (const unit of pc.pc_unit) {
        if (unit.name == '' && unit.type != 'Системный блок' || unit.name == 'Н/Д' || unit.serial_number == '') {
          status = 'not ok!'
        }
      }
    }
    if (pc.system_case_unit.length > 0) {
      for (const unit of pc.system_case_unit) {
        if (unit.type == '' || unit.name == '' || unit.name == 'Н/Д' || unit.serial_number == '') {
          status = 'not ok!'
        }
      }
    }
    serials.push(pc.serial_number)
    results.push(status)
  }  
  res.send(JSON.stringify({
    serials: serials,
    results: results
  }))
})

router.get('/getPage', auth, async (req, res) => {
  const user = await User.findOne({username: req.session.user.username})
  if (user.lastPage) {
    res.send(JSON.stringify(user.lastPage))
  } else {
    res.send('1')
  }
})


router.post('/setPage', auth, async (req, res) => {
  if (req.body.page) {
    let user = await User.findOne({username: req.session.user.username})
    user.lastPage = req.body.page
    await user.save()    
  }
  res.status(200).json({ message: 'ok' })
})


module.exports = router