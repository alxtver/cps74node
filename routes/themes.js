const { Router } = require("express");
const auth = require("../middleware/auth");
const ThemesController = require("../controllers/themes.controller");
const router = Router();

router.get("/", auth, ThemesController.getMainPage);
router.get("/getAll", auth, ThemesController.getAllThemes);
router.post("/createPart", auth, ThemesController.createPart);

module.exports = router;
