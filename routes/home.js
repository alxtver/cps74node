const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const PKI = require("../models/pki");
const PC = require("../models/pc");
const SystemCase = require("../models/systemCase")
const User = require("../models/user");
const APKZI = require("../models/apkzi");
const Part = require("../models/part");

router.get("/", auth, async (req, res) => {
  res.redirect("/pcPa");
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
});

router.get("/diagram", auth, async (req, res) => {
  PC.find().distinct("part", async function (error, parts) {
    if (error) {
      res.sendStatus(400);
    }
    let arr = [["Проект", "Процентное отношение"]];
    for (const part of parts) {
      let docsInPart = await PC.find({
        part: part,
      });
      let count = 0;
      for (const doc of docsInPart) {
        let sn = doc.serial_number;
        if (!sn.includes("Z") && !sn.includes("z")) {
          count += 1;
        }
      }
      arr.push([part, count]);
    }
    res.send(JSON.stringify(arr));
  });
});

router.get("/monitoring", auth, async (req, res) => {
  let args_devel = {
    title: "Мониторинг",
    part: req.session.part,
    isEquipment: true,
    userName: req.session.user.username,
  };
  res.render("monitoring", args_devel);
});

router.post("/insert_part_session", async function (req, res) {
  await User.findByIdAndUpdate(req.session.user._id, {
    lastPart: req.body.selectedItem,
  });
  req.session.part = req.body.selectedItem;
  res.send(JSON.stringify("OK"));
});

router.get("/script", auth, async (req, res) => {
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

  //скрипт для изменения ФДШИ

  const pcs = await PC.find();
  for (const pc of pcs) {
    console.log("\x1b[35m%s\x1b[0m", "PC #" + pc.serial_number);
    pc.fdsi = 'ФДШИ.' + pc.fdsi
    await pc.save();
    console.log("\x1b[35m%s\x1b[0m", pc.serial_number + " - DONE!!!");
    console.log(
      "\x1b[31m%s\x1b[0m",
      "<><><><><><><><><><><><><><><><><><><><><>"
    );
  }

  const systemCases = await SystemCase.find();
  for (const systemCase of systemCases) {
    console.log("\x1b[35m%s\x1b[0m", "PC #" + systemCase.serialNumber);
    systemCase.fdsi = 'ФДШИ.' + systemCase.fdsi
    await systemCase.save();
    console.log("\x1b[35m%s\x1b[0m", systemCase.serialNumber + " - DONE!!!");
    console.log(
      "\x1b[31m%s\x1b[0m",
      "<><><><><><><><><><><><><><><><><><><><><>"
    );
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

  res.send("Скрипт отработал!");
});

module.exports = router;
