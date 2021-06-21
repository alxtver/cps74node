const SystemCase = require("../models/systemCase");
const PC = require("../models/pc");

exports.insertSystemCase = async (req, res) => {
  const pcId = req.body.id;
  const serialNumber = req.body.serial_number;
  const index = req.body.obj;

  const systemCase = await SystemCase.findOne({
    part: req.session.part,
    serialNumber,
  });
  const pc = await PC.findById(pcId);

  // Если уже был серийный номер системного блока
  const oldSerialNumber =
    pc.pc_unit[index].serial_number !== serialNumber
      ? pc.pc_unit[index].serial_number
      : null;
  if (oldSerialNumber) {
    const oldSystemCase = await SystemCase.findOne({
      part: req.session.part,
      serialNumber: oldSerialNumber,
    });
    if (oldSystemCase) {
      oldSystemCase.numberMachine = "";
      await oldSystemCase.save();
    }
  }

  // Если не нашли системный блок
  if (!systemCase) {
    pc.pc_unit[index].name = "Н/Д";
    pc.pc_unit[index].serial_number = serialNumber;
    pc.markModified("pc_unit");
    pc.system_case_unit = [];
    await pc.save();
    res.status(400).json({ error: "System Case not found!", pc });
    return;
  }

  // Если системный блок уже был привязан к другой машине
  let oldNumberMachine = systemCase.numberMachine;
  const oldPc = await PC.findOne({
    part: req.session.part,
    serial_number: oldNumberMachine,
  });
  if (oldPc && oldPc.serial_number !== pc.serial_number) {
    oldPc.pc_unit[index].name = "Н/Д";
    oldPc.pc_unit[index].serial_number = "";
    oldPc.markModified("pc_unit");
    oldPc.system_case_unit = [];
    await oldPc.save();
  } else if (oldPc && oldPc.serial_number === pc.serial_number) {
    oldNumberMachine = null
  }

  // Если все норм...
  pc.pc_unit[index].name = "";
  pc.pc_unit[index].serial_number = serialNumber;
  pc.system_case_unit = systemCase.systemCaseUnits;
  systemCase.numberMachine = pc.serial_number;

  systemCase.save();

  pc.markModified("pc_unit");
  await pc.save();

  res.send(
    JSON.stringify({
      pc,
      oldNumberMachine: oldNumberMachine,
    })
  );
};
