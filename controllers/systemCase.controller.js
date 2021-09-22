const SystemCase = require("../models/systemCase");
const PC = require("../models/pc");
const APKZI = require("../models/apkzi");
const PKI = require("../models/pki");
const Part = require("../models/part");
const plusOne = require("../routes/foo/app");
const mongoose = require("mongoose");
const snReModifer = require("../routes/foo/snReModifer");

/**
 * Основная страница системных блоков
 * @param req
 * @param res
 */
exports.getMainPage = (req, res) => {
  res.render("systemCases", {
    title: "Системные блоки",
    isSystemCase: true,
  });
};

/**
 * Страница добавлени системного блока
 * @param req
 * @param res
 */
exports.getAddPage = (req, res) => {
  res.render("addSystemCase", {
    title: "Добавить системный блок",
    isAdd: true,
    part: req.session.part,
  });
};

/**
 * Сохранение системного блока
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.addSystemCase = async (req, res) => {
  // если нет такого проекта то сохраняем
  try {
    const newPart = new Part({ part: req.body.part });
    await newPart.save();
  } catch (e) {}

  const systemCase = new SystemCase(req.body);

  try {
    await systemCase.save();
    res.status(200).json({ message: "ok" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "system case is not save!" });
  }
};

/**
 * Получить все системные блоки
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  const systemCases = await SystemCase.find({ part: req.session.part }).sort({
    created: 1,
  });
  res.send(JSON.stringify({ systemCases }));
};

/**
 * Поиск системного блока по серийному номеру
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.findSerialNumber = async (req, res) => {
  const systemCase = await SystemCase.findOne({
    serialNumber: req.body.serial,
  });
  res.send(!!systemCase);
};

/**
 * Удаление системного блока
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.removeSystemCase = async (req, res) => {
  try {
    await SystemCase.deleteOne({ _id: req.body.id });
    res.status(200).json({ message: "ok" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "system case is not delete!" });
  }
};

/**
 * Страница редактирования системного блока
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.getEditPage = async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const systemCase = await SystemCase.findById(req.params.id).lean();

  res.render("systemCaseEdit", {
    title: `Редактирование системного блока ${systemCase.serialNumber}`,
    systemCase,
  });
};

/**
 * Получить системный блок по ID
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getSystemCaseById = async (req, res) => {
  const systemCase = await SystemCase.findById(req.params.id).lean();
  res.status(200).json({ systemCase });
};

/**
 * Обновить системный блок
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateSystemCase = async (req, res) => {
  const systemCase = await SystemCase.findById(req.body.id);
  const serialNumber = req.body.data.serialNumber;
  if (serialNumber !== systemCase.serialNumber) {
    await PKI.updateMany(
      { part: req.session.part, number_machine: systemCase.serialNumber },
      { $set: { number_machine: serialNumber } }
    );
  }
  await SystemCase.findByIdAndUpdate(req.body.id, req.body.data);
  res.status(200).json({ message: "ok" });
};

/**
 * Редактировать серийный номер
 * @param req
 * @param res
 * @returns {Promise<boolean>}
 */
exports.editSerialNumber = async (req, res) => {
  const systemCase = await SystemCase.findById(req.body.id);
  let serialNumber = req.body.serialNumber;
  const index = req.body.obj;
  const part = req.session.part;

  // Проверка на дублирование ПКИ
  if (serialNumber !== "" && serialNumber !== systemCase.serialNumber) {
    for (const unit of systemCase.systemCaseUnits) {
      if (unit.serial_number === serialNumber) {
        res.send(JSON.stringify({ duplicatePki: true }));
        return false;
      }
    }
  }

  let pki = await PKI.findOne({
    part,
    serial_number: serialNumber,
  });

  if (!pki) {
    const snReMod = await snReModifer(serialNumber, systemCase.part);
    serialNumber = snReMod.SN;
    pki = snReMod.pki;
    if (!snReMod.pki) {
      systemCase.systemCaseUnits[req.body.obj].serial_number = serialNumber;
      systemCase.systemCaseUnits[req.body.obj].name = "Н/Д";
      systemCase.markModified("systemCaseUnits");
      await systemCase.save();
      // Если системный блок привязан к ПЭВМ
      if (systemCase.numberMachine) {
        const pc = await PC.findOne({
          part: req.session.part,
          serial_number: systemCase.numberMachine,
        });
        pc.system_case_unit = systemCase.systemCaseUnits;
        await pc.save();
      }
      res.send(
        JSON.stringify({
          systemCase,
        })
      );
      return false;
    }
  }

  // ПКИ который раньше был на этом месте
  const oldSerialNumber = systemCase.systemCaseUnits[index].serial_number;
  const oldPki = oldSerialNumber
    ? await PKI.findOne({ part, serial_number: oldSerialNumber })
    : undefined;
  if (oldPki) {
    if (oldPki.number_machine !== systemCase.serialNumber) {
      oldPki.number_machine = "";
      await oldPki.save();
    } else {
      // если ПКИ задублировались, то чтобы при удалении одного не отвязывался другой
      // применяем цикл
      let countPki = 0;
      for (const unit of systemCase.systemCaseUnits) {
        if (unit.serial_number === oldPki.serial_number) {
          countPki += 1;
        }
      }
      if (countPki <= 1) {
        oldPki.number_machine = "";
        await oldPki.save();
      }
    }
  }

  let oldNumberMachine; //номер машины, который раньше был у ПКИ
  if (pki.number_machine) {
    oldNumberMachine = pki.number_machine;
    pki.number_machine = systemCase.serial_number;
    await pki.save();
  }
  // Если ПКИ был привязан удаляем ПКИ из старой машины
  let oldSystemCase;
  if (oldNumberMachine) {
    if (oldNumberMachine !== systemCase.serialNumber) {
      oldSystemCase = await SystemCase.findOne({
        serialNumber: oldNumberMachine,
      });
      if (oldSystemCase) {
        for (const unit of oldSystemCase.systemCaseUnits) {
          if (unit.serial_number === pki.serial_number) {
            unit.serial_number = "";
            unit.name = "Н/Д";
          }
        }
        oldSystemCase.markModified("systemCaseUnits");
        await oldSystemCase.save();
        if (oldSystemCase.numberMachine) {
          const pc = await PC.findOne({
            part: req.session.part,
            serial_number: oldSystemCase.numberMachine,
          });
          pc.system_case_unit = oldSystemCase.systemCaseUnits;
          await pc.save();
        }
      }
    }
  }
  // Проверяем был ли привязан ПКИ к машине и привязываем к новой машине
  pki.number_machine = systemCase.serialNumber;
  await pki.save();
  // Добавляем ПКИ к новой машине
  systemCase.systemCaseUnits[req.body.obj].serial_number = serialNumber; //меняем серийник
  systemCase.systemCaseUnits[req.body.obj].name = pki.vendor + " " + pki.model; //меняем имя
  systemCase.systemCaseUnits[req.body.obj].type = pki.type_pki; //меняем тип
  systemCase.markModified("systemCaseUnits");
  await systemCase.save();

  // Если системный блок привязан к ПЭВМ
  if (systemCase.numberMachine) {
    const pc = await PC.findOne({
      part: req.session.part,
      serial_number: systemCase.numberMachine,
    });
    pc.system_case_unit = systemCase.systemCaseUnits;
    await pc.save();
  }

  res.send(
    JSON.stringify({
      systemCase,
      oldSystemCase,
    })
  );
};

/**
 * Копирование системного блока
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.copySystemCase = async (req, res) => {
  const oldSystemCase = await SystemCase.findById(req.body.id);
  const allSystemCaseSerialNumbers = await SystemCase.find().distinct(
    "serialNumber"
  );
  const reqSerial = req.body.serial_number;
  const lastNumber =
    reqSerial.split(";").length > 1
      ? reqSerial.split(";")[1].trim()
      : undefined;
  let number = reqSerial.split(";")[0].trim();
  const serialNumbers = [number];
  while (lastNumber && number !== lastNumber) {
    number = plusOne(number);
    serialNumbers.push(number);
  }

  const systemCasesForSave = [];
  for (const serialNumber of serialNumbers) {
    if (allSystemCaseSerialNumbers.includes(serialNumber)) {
      continue;
    }
    const newSystemCase = new SystemCase(oldSystemCase);
    newSystemCase._id = mongoose.Types.ObjectId();
    newSystemCase.isNew = true;
    newSystemCase.serialNumber = serialNumber;
    const units = [];
    for (const unit of newSystemCase.systemCaseUnits) {
      const copyUnit = { ...unit };
      if (copyUnit.serial_number === oldSystemCase.serialNumber) {
        copyUnit.serial_number = serialNumber;
      } else if (!/[Бб].?[Нн]/g.test(copyUnit.serial_number)) {
        copyUnit.name = "";
        copyUnit.serial_number = "";
      }
      units.push(copyUnit);
    }
    newSystemCase.systemCaseUnits = units;
    systemCasesForSave.push(newSystemCase);
  }
  await SystemCase.insertMany(systemCasesForSave);
  res.redirect("/systemCases");
};

/**
 * Редактирование серийного номера СЗИ
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.editSerialNumberSZI = async (req, res) => {
  const systemCase = await SystemCase.findById(req.body.id); //ищем комп который собираемся редактировать
  const controllerNumber = req.body.serialNumber;
  const index = req.body.index;
  const apkzi = await APKZI.findOne({
    part: req.session.part,
    kontr_zav_number: controllerNumber,
  });

  // Если уже был серийный номер контроллера СЗИ
  const oldSerialNumber = systemCase.systemCaseUnits[index].serial_number;
  if (oldSerialNumber) {
    const oldApkzi = await APKZI.findOne({
      part: req.session.part,
      kontr_zav_number: oldSerialNumber,
    });
    if (oldApkzi) {
      oldApkzi.number_machine = "";
      oldApkzi.save();
    }
  }

  // Если не нашли АПКЗИ
  if (!apkzi) {
    systemCase.systemCaseUnits[index].name = "Н/Д";
    systemCase.systemCaseUnits[index].serial_number = controllerNumber;
    systemCase.markModified("systemCaseUnits");
    await systemCase.save();
    res.status(400).json({ error: "APKZI not found!!!", systemCase });
    return;
  }

  // Если АПКЗИ был привязан к другому системному блоку
  const oldNumberMachine = apkzi.number_machine;
  const oldSystemCase = await SystemCase.findOne({
    part: req.session.part,
    serialNumber: oldNumberMachine,
  });
  if (oldSystemCase) {
    for (const unit of oldSystemCase.systemCaseUnits) {
      if (unit.szi) {
        unit.name = "Н/Д";
        unit.serial_number = "";
        break;
      }
    }
    oldSystemCase.markModified("systemCaseUnits");
    await oldSystemCase.save();
    if (oldSystemCase.numberMachine) {
      const pc = await PC.findOne({
        part: req.session.part,
        serial_number: oldSystemCase.numberMachine,
      });
      pc.system_case_unit = oldSystemCase.systemCaseUnits;
      await pc.save();
    }
  }

  // Если все норм...
  systemCase.systemCaseUnits[index].serial_number = controllerNumber;
  const controllerName = apkzi.kont_name;
  const controllerNameList = controllerName.split(" ");
  const arr_end = controllerNameList.slice(-1).join("");
  const arr_start = controllerNameList.slice(0, -1);
  systemCase.systemCaseUnits[index].name = arr_end; //меняем тип
  systemCase.systemCaseUnits[index].type = arr_start.join(" "); //меняем имя
  systemCase.systemCaseUnits[index].fdsi = "ФДШИ." + apkzi.fdsiKontr;
  apkzi.number_machine = systemCase.serialNumber;

  apkzi.save();

  systemCase.markModified("systemCaseUnits");
  await systemCase.save();

  // Если системный блок привязан к ПЭВМ
  if (systemCase.numberMachine) {
    const pc = await PC.findOne({
      part: req.session.part,
      serial_number: systemCase.numberMachine,
    });
    pc.system_case_unit = systemCase.systemCaseUnits;
    await pc.save();
  }
  res.status(200).json({ systemCase, oldSystemCase });
};

/**
 * Получить серийные номера системных блоков за проект
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getSerialsNumbers = async (req, res) => {
  const serialsNumbers = await SystemCase.find({
    part: req.session.part,
  }).distinct("serialNumber");
  res.status(200).json({ serialsNumbers });
};
