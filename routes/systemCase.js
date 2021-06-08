const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();
const SystemCase = require("../models/systemCase");
const Part = require("../models/part");
const plusOne = require("./foo/app");
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
  res.render("systemCases", {
    title: "Системные блоки",
    isSystemCase: true,
  });
});

router.get("/add", auth, (req, res) => {
  res.render("addSystemCase", {
    title: "Добавить системный блок",
    isAdd: true,
    part: req.session.part,
  });
});

router.post("/add", auth, async (req, res) => {
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
});

router.get("/getAll", auth, async (req, res) => {
  const systemCases = await SystemCase.find({
    part: req.session.part,
  }).sort({
    created: 1,
  });
  res.send(
    JSON.stringify({
      systemCases,
    })
  );
});

/**
 * Есть ли серийный номер
 */
router.post("/findSerial", auth, async (req, res) => {
  const systemCase = await SystemCase.findOne({
    serialNumber: req.body.serial,
  });
  if (systemCase) {
    res.send(true);
  } else {
    res.send(false);
  }
});

/**
 * Удалить системный блок
 */
router.delete("/delete", auth, async (req, res) => {
  try {
    await SystemCase.deleteOne({ _id: req.body.id });
    res.status(200).json({ message: "ok" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "system case is not delete!" });
  }
});

/**
 * Редактировать системный блок
 */
router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const systemCase = await SystemCase.findById(req.params.id).lean();

  res.render("systemCaseEdit", {
    title: `Редактирование системного блока ${systemCase.serialNumber}`,
    systemCase,
  });
});

/**
 * Получить системный блок
 */
router.get("/getSystemCase/:id/", auth, async (req, res) => {
  const systemCase = await SystemCase.findById(req.params.id).lean();
  res.status(200).json({ systemCase });
});

/**
 * Обновить системный блок
 */
router.put("/update", auth, async (req, res) => {
  await SystemCase.findByIdAndUpdate(req.body.id, req.body.data);
  res.status(200).json({ message: "ok" });
});

/**
 * Копирование системных блоков
 */
router.post("/copy", auth, async (req, res) => {
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
});

module.exports = router;
