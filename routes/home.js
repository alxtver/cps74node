const {
  Router
} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const PKI = require('../models/pki')
const PC = require('../models/pc')
const User = require('../models/user')
const APKZI = require('../models/apkzi')
const Part = require('../models/part')


router.get('/', auth, async (req, res) => {
  res.redirect('/pcPa')
  // let countPKI = await PKI.countDocuments()
  // let countPC = 0
  // let docsPC = await PC.find()
  // for (const doc of docsPC) {
  //   let sn = doc.serial_number
  //   if (!sn.includes('Z') && !sn.includes('z')) {
  //     countPC += 1
  //   }
  // }

  // let dateNow = new Date()
  // let nowYear = Date.parse(dateNow.getFullYear())

  // let countPCinYear = 0
  // let docsPCinYear = await PC.find({
  //   created: {
  //     $gt: nowYear
  //   }
  // })
  // for (const doc of docsPCinYear) {
  //   let sn = doc.serial_number
  //   if (!sn.includes('Z') && !sn.includes('z')) {
  //     countPCinYear += 1
  //   }
  // }

  // let countPKIinYear = await PKI.countDocuments({
  //   created: {
  //     $gt: nowYear
  //   }
  // })
  // let args_devel = {
  //   title: 'Главная страница',
  //   isHome: true,
  //   countPKI: countPKI,
  //   countPC: countPC,
  //   countPCinYear: countPCinYear,
  //   countPKIinYear: countPKIinYear,
  //   part: req.session.part
  // }
  // res.render('index', args_devel)
})


router.get('/diagram', auth, async (req, res) => {
  PC.find().distinct('part', async function (error, parts) {
    if (error) {
      res.sendStatus(400)
    }
    let arr = [
      ['Проект', 'Процентное отношение']
    ]
    for (const part of parts) {
      let docsInPart = await PC.find({
        part: part
      })
      let count = 0
      for (const doc of docsInPart) {
        let sn = doc.serial_number
        if (!sn.includes('Z') && !sn.includes('z')) {
          count += 1
        }
      }
      arr.push([part, count])
    }
    res.send(JSON.stringify(arr))
  })
})

router.get('/monitoring', auth, async (req, res) => {
  let args_devel = {
    title: 'Мониторинг',
    part: req.session.part,
    userName: req.session.user.username
  }
  res.render('monitoring', args_devel)
})


router.post("/insert_part_session", async function (req, res) {
  await User.findByIdAndUpdate(req.session.user._id, {
    lastPart: req.body.selectedItem
  })
  req.session.part = req.body.selectedItem
  res.send(JSON.stringify('OK'))
})


router.get('/script', authAdmin, async (req, res) => {
  //  скрипт для удаления PC по партии
  // PC.deleteMany({ part: 'АСО МСК' }, function (err) {
  //   if (err) {
  //     return handleError(err)
  //   } else {
  //     res.send('Скрипт отработал!')
  //   }
  // })

  // скрипт для добавления штрихкода
  // const pki = await PKI.updateMany({type_pki: 'Монитор'}, { ean_code: '4713147229000' })
  // console.log(pki.n)
  // console.log(pki.nModified)

  // скрипт для добавления поля выборка
  // const pki = await PKI.updateMany({}, { viborka: false })
  // console.log(pki.n)
  // console.log(pki.nModified)


  //скрипт для изменения пки у пс

  let pcs = await PC.find({
    part: 'АСО МСК 2020'
  })
  for (const pc of pcs) {
    console.log('\x1b[35m%s\x1b[0m', 'PC #' + pc.serial_number)
    if (pc.pc_unit) {
      if (pc.pc_unit[2].type == 'Клавиатура') {
        console.log('\x1b[33m%s\x1b[0m', 'Клавиатура => Мышь')
        pc.pc_unit[2].type = 'Мышь'
      }
      // for (const unit of pc.pc_unit) {
      //   if (unit.type == 'Сетевой фильтр') {
      //     console.log('\x1b[33m%s\x1b[0m', 'Сетевой фильтр => PILOT S 3m')
      //     unit.name = 'PILOT S 3m'
      //   }
      //   if (unit.type == 'ИБП' || unit.type == 'Источник бесперебойного питания') {
      //     console.log('\x1b[33m%s\x1b[0m', 'ИБП => с кабелями: USB\u002FRJ45, RJ12')
      //     unit.notes = 'кабелями: USB\u002FRJ45, RJ12'
      //   }
      //   if (unit.type == 'Гарнитура') {
      //     console.log('\x1b[33m%s\x1b[0m', 'Гарнитура => ОКЛИК HS-M150');
      //     unit.name = 'ОКЛИК HS-M150'
      //   }
      // if (unit.type == 'Коврик для мыши') {
      //   console.log('\x1b[33m%s\x1b[0m', 'Коврик для мыши => DEFENDER ERGO OPTI-LASER')
      //   unit.name = 'DEFENDER ERGO OPTI-LASER'
      // }
      // if (unit.type == 'Монитор') {
      //   console.log('\x1b[33m%s\x1b[0m', 'Монитор => DEFENDER ERGO OPTI-LASER')
      //   unit.notes = 'с кабелями: питания, VGA'
      // }
      // if (unit.type == 'Сканер') {
      //   console.log('\x1b[33m%s\x1b[0m', 'Сканер => с кабелем USB')
      //   unit.notes = 'с кабелем USB'
      // }
      // }
      pc_copy = await PC.findById(pc.id)
      pc_copy.pc_unit = pc.pc_unit
      await pc_copy.save()
      console.log('\x1b[35m%s\x1b[0m', pc.serial_number + ' - DONE!!!')
      console.log('\x1b[31m%s\x1b[0m', '<><><><><><><><><><><><><><><><><><><><><>');
    }
  }

  // копирование создание мышей на основе клавиатур
  const pkis = await PKI.find({
    type_pki: 'Клавиатура',
    part: 'АСО МСК 2020'
  })
  for (const pki of pkis) {
    const checkPki = await PKI.find({
      type_pki: 'Мышь',
      part: 'АСО МСК 2020',
      serial_number: pki.serial_number
    })
    if (checkPki.length === 0) {
      console.log('Клавиатура ' + pki.serial_number + ' => Мышь')
      const pkiNew = new PKI({
        type_pki: 'Мышь',
        vendor: pki.vendor,
        model: pki.model,
        serial_number: pki.serial_number,
        part: pki.part,
        country: pki.country,
        ean_code: pki.ean_code,
        sp_unit: pki.sp_unit1,
        number_machine: pki.number_machine || ''
      })
      await pkiNew.save()
    }
  }


  // скрипт импорта ПКИ из CSV файла
  // const appDir = path.dirname(require.main.filename)
  // const docDir = appDir + '/public/'
  // let fileContent = fs.readFileSync(docDir + '/base.csv', "utf8")
  // for (const pki of fileContent.split(';;')) {
  //   type = pki.split(';')[1]
  //   vendor = pki.split(';')[2]
  //   model = pki.split(';')[3]
  //   serial_number = pki.split(';')[4]
  //   part = 'ЛОТ 10,11(2020)'
  //   const pkiNew = new PKI({
  //     type_pki: type,
  //     vendor: vendor,
  //     model: model,
  //     serial_number: serial_number,
  //     part: part,
  //     country: 'Китай'
  //   })
  //   console.log(type + ' ' + vendor + ' ' + model + ' ' + serial_number);
  //   await pkiNew.save()
  // }


  // скрипт разделения лот 10,11 (2020) на два лота
  // let pcs = await PC.find({part: 'ЛОТ 10,11(2020)'})
  // const new_part10 = new Part({part: 'ЛОТ 10(2020)'})
  // const new_part11 = new Part({part: 'ЛОТ 11(2020)'})
  // new_part10.save()
  // new_part11.save()
  // console.log(pcs.length);
  // for (const pc of pcs) {
  //   if (pc.serial_number.includes('-049-')) {
  //     console.log(pc.serial_number)
  //     console.log('изменен на ЛОТ 10(2020)')
  //     pc.part = 'ЛОТ 10(2020)'
  //     await pc.save()
  //   } else {
  //     console.log(pc.serial_number)
  //     console.log('изменен на ЛОТ 11(2020)')
  //     pc.part = 'ЛОТ 11(2020)'
  //     await pc.save()
  //   }
  // }
  // let pkis = await PKI.find({part: 'ЛОТ 10,11(2020)'})
  // for (const pki of pkis) {
  //   if (!pki.number_machine) {
  //     pki.part = 'ЛОТ 10(2020)'
  //     await pki.save()
  //     console.log(pki.type_pki + ' ' + pki.vendor + ' ' + pki.model + ' изменен на ЛОТ 10(2020)')      
  //   } else if (pki.serial_number.includes('-049-')){
  //     pki.part = 'ЛОТ 10(2020)'
  //     await pki.save()
  //     console.log(pki.type_pki + ' ' + pki.vendor + ' ' + pki.model + ' изменен на ЛОТ 10(2020)')
  //   } else if (pki.number_machine.includes('-049-')){
  //     pki.part = 'ЛОТ 10(2020)'
  //     await pki.save()
  //     console.log(pki.type_pki + ' ' + pki.vendor + ' ' + pki.model + ' изменен на ЛОТ 10(2020)')
  //   } else if (pki.serial_number.includes('-050-')){
  //     pki.part = 'ЛОТ 11(2020)'
  //     await pki.save()
  //     console.log(pki.type_pki + ' ' + pki.vendor + ' ' + pki.model + ' изменен на ЛОТ 10(2020)')
  //   } else {
  //     pki.part = 'ЛОТ 11(2020)'
  //     await pki.save()
  //     console.log(pki.type_pki + ' ' + pki.vendor + ' ' + pki.model + ' изменен на ЛОТ 10(2020)')
  //   }
  // }
  // let apkzis = await APKZI.find({part: 'ЛОТ 10,11(2020)'})
  // for (const apkzi of apkzis) {
  //   if (apkzi.number_machine.includes('-049-')) {
  //     console.log(apkzi.number_machine)
  //     console.log('изменен на ЛОТ 10(2020)')
  //     apkzi.part = 'ЛОТ 10(2020)'
  //     await apkzi.save()
  //   } else {
  //     console.log('АПКЗИ с машины с номером ' + apkzi.number_machine + ' изменен на ЛОТ 11(2020)')
  //     apkzi.part = 'ЛОТ 11(2020)'
  //     await apkzi.save()
  //   }
  // }
  // Part.deleteOne({part: 'ЛОТ 10,11(2020)'}, function (err) {});
  // let pcs = await PC.find()
  // for (const pc of pcs) {
  //   if (pc.back_color == 'Желтый') {
  //     pc.back_color = '#e7e821'
  //   } else if (pc.back_color == 'Зеленый') {
  //     pc.back_color = '#26e821'
  //   } else if (pc.back_color == 'Синий') {
  //     pc.back_color = '#2168e8'
  //   } else if (pc.back_color == 'Красный') {
  //     pc.back_color = '#e8213a'
  //   }
  //   await pc.save()
  //   console.log(pc.serial_number + ' готов!')
  // }

  res.send('Скрипт отработал!')
})

module.exports = router