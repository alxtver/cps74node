const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();
const SystemCase = require("../models/systemCase");

router.get("/", auth, async (req, res) => {
  res.render("systemCases", {
    title: "Системные блоки",
    isSystemCase: true,
  });
});

router.get('/add', auth, (req, res) => {
  res.render('addSystemCase', {
    title: 'Добавить системный блок',
    isAdd: true,
    part: req.session.part
  })
})

router.get("/getAll", auth, async (req, res) => {
  const systemCases = await SystemCase.find({
    part: req.session.part,
  });
  res.send(
    JSON.stringify({
      systemCases,
    })
  );
});

module.exports = router;
