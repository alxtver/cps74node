const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();
const SystemCaseController = require('../controllers/systemCase.controller')

router.get("/", auth, SystemCaseController.getMainPage);

router.get("/add", auth, SystemCaseController.getAddPage);

router.post("/add", auth, SystemCaseController.addSystemCase);

router.get("/getAll", auth, SystemCaseController.getAll);

router.post("/findSerial", auth, SystemCaseController.findSerialNumber);

router.delete("/delete", auth, SystemCaseController.removeSystemCase);

router.get("/:id/edit", auth, SystemCaseController.getEditPage);

router.get("/getSystemCase/:id/", auth, SystemCaseController.getSystemCaseById);

router.put("/update", auth, SystemCaseController.updateSystemCase);

router.put("/editSerialNumber", auth, SystemCaseController.editSerialNumber);

router.post("/copy", auth, SystemCaseController.copySystemCase);

router.post('/insertSystemCaseSZI', auth, SystemCaseController.editSerialNumberSZI);

module.exports = router;
