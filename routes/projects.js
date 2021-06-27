const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();
const ProjectController = require('../controllers/projects.controller')

router.get("/", auth, ProjectController.getMainPage);

router.get("/export", auth, ProjectController.exportToExcel);

router.get("/:id/passportDocx", auth, ProjectController.passport);

router.get("/:id/zipPCEDocx", auth, ProjectController.systemCaseZip);

router.get("/:id/zipDocx", auth, ProjectController.zipLabel);

module.exports = router;
