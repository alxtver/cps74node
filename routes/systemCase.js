const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();
const SystemCase = require("../models/systemCase");
const Part = require("../models/part");

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
    res.status(200).json({message: "ok",});
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "system case is not save!" });
  }
});

router.get("/getAll", auth, async (req, res) => {
  const systemCases = await SystemCase.find({
    part: req.session.part,
  }).sort({
    'created': 1
  });
  res.send(
    JSON.stringify({
      systemCases,
    })
  );
});

module.exports = router;
