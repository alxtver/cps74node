const PC = require("../models/pc");
const SystemCase = require("../models/systemCase");
const path = require("path");
const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const excel = require("excel4node");

/**
 * Основная страница проекта
 * @param req
 * @param res
 */
exports.getMainPage = (req, res) => {
  res.render("projects", {
    title: "Проекты",
    isProjects: true,
    part: req.session.part,
  });
};

/**
 * Экспорт в эксель
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.exportToExcel = async (req, res) => {
  const part = req.session.part;
  const workbook = new excel.Workbook();
  // Add Worksheets to the workbook
  const ws = workbook.addWorksheet("Sheet 1");
  // Create a reusable style
  const style = workbook.createStyle({
    font: {
      size: 12,
    },
    border: {
      left: {
        style: "thin",
        color: "black",
      },
      right: {
        style: "thin",
        color: "black",
      },
      top: {
        style: "thin",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });
  const styleBold = workbook.createStyle({
    font: {
      size: 12,
      bold: true,
    },
    border: {
      left: {
        style: "thin",
        color: "black",
      },
      right: {
        style: "thin",
        color: "black",
      },
      top: {
        style: "thin",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });
  const styleBoldLeft = workbook.createStyle({
    font: {
      size: 12,
      bold: true,
    },
    border: {
      left: {
        style: "thick",
        color: "black",
      },
      right: {
        style: "thin",
        color: "black",
      },
      top: {
        style: "thin",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });
  const styleBoldRight = workbook.createStyle({
    font: {
      size: 12,
      bold: true,
    },
    border: {
      left: {
        style: "thin",
        color: "black",
      },
      right: {
        style: "thick",
        color: "black",
      },
      top: {
        style: "thin",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });
  const styleBot = workbook.createStyle({
    font: {
      size: 12,
    },
    border: {
      left: {
        style: "thin",
        color: "black",
      },
      right: {
        style: "thin",
        color: "black",
      },
      top: {
        style: "thick",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });

  const styleBotLeft = workbook.createStyle({
    font: {
      size: 12,
    },
    border: {
      left: {
        style: "thick",
        color: "black",
      },
      right: {
        style: "thin",
        color: "black",
      },
      top: {
        style: "thick",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });

  const styleBotRight = workbook.createStyle({
    font: {
      size: 12,
    },
    border: {
      left: {
        style: "thin",
        color: "black",
      },
      right: {
        style: "thick",
        color: "black",
      },
      top: {
        style: "thick",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });

  const styleBot1 = workbook.createStyle({
    font: {
      size: 12,
    },
    border: {
      top: {
        style: "thick",
        color: "black",
      },
    },
  });

  const styleLeft = workbook.createStyle({
    font: {
      size: 12,
    },
    border: {
      left: {
        style: "thick",
        color: "black",
      },
      right: {
        style: "thin",
        color: "black",
      },
      top: {
        style: "thin",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });

  const styleRight = workbook.createStyle({
    font: {
      size: 12,
    },
    border: {
      left: {
        style: "thin",
        color: "black",
      },
      right: {
        style: "thick",
        color: "black",
      },
      top: {
        style: "thin",
        color: "black",
      },
      bottom: {
        style: "thin",
        color: "black",
      },
    },
  });
  const styleHead = workbook.createStyle({
    font: {
      bold: true,
      size: 18,
    },
  });
  const allPC = await PC.find({
    part: part,
  }).sort({
    created: 1,
  });

  ws.row(1).setHeight(30);
  ws.cell(1, 2).string(part).style(styleHead);

  let n = 3;
  let col2width = 21;
  let col3width = 23;
  let col4width = 16;
  let col5width = 12;
  let col6width = 17;
  let col7width = 13;

  for (const pc of allPC) {
    let backColor = pc.back_color;
    let styleBoldColor = workbook.createStyle({
      font: {
        size: 14,
        bold: true,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: backColor,
        fgColor: backColor,
      },
      border: {
        left: {
          style: "thin",
          color: "black",
        },
        right: {
          style: "thin",
          color: "black",
        },
        top: {
          style: "thick",
          color: "black",
        },
        bottom: {
          style: "thin",
          color: "black",
        },
      },
    });
    let styleWhite = workbook.createStyle({
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: backColor,
        fgColor: backColor,
      },
    });
    let stColor = styleBoldColor;
    let firstCellColor = styleWhite;

    ws.cell(n, 1).string("").style(firstCellColor);
    ws.cell(n, 2).string(pc.fdsi).style(styleBotLeft);
    ws.cell(n, 3).string(pc.serial_number).style(stColor);
    ws.cell(n, 4).string(pc.arm).style(styleBot);
    ws.cell(n, 5).string(pc.execution).style(styleBot);
    ws.cell(n, 6).string("").style(styleBot);
    ws.cell(n, 7).string(pc.attachment).style(styleBotRight);
    if (col7width < pc.attachment.length) {
      col7width = pc.attachment.length + 1;
    }
    n += 1;
    if (pc.pc_unit.length > 0) {
      ws.cell(n, 1).string("").style(firstCellColor);
      ws.cell(n, 2).string("Обозначение изделия").style(styleBoldLeft);
      ws.cell(n, 3).string("Наименование изделия").style(styleBold);
      ws.cell(n, 4).string("Характеристика").style(styleBold);
      ws.cell(n, 5).string("Количество").style(styleBold);
      ws.cell(n, 6).string("Заводской номер").style(styleBold);
      ws.cell(n, 7).string("Примечание").style(styleBoldRight);
      n += 1;
      for (const unit of pc.pc_unit) {
        ws.cell(n, 1).string("").style(firstCellColor);
        ws.cell(n, 2).string(unit.fdsi).style(styleLeft);
        if (col2width < unit.fdsi.length) {
          col2width = unit.fdsi.length;
        }
        ws.cell(n, 3).string(unit.type).style(style);
        if (col3width < unit.type.length) {
          col3width = unit.type.length;
        }
        ws.cell(n, 4).string(unit.name).style(style);
        if (col4width < unit.name.length) {
          col4width = unit.name.length;
        }
        ws.cell(n, 5).string(unit.quantity).style(style);
        if (col5width < unit.quantity.length) {
          col5width = unit.quantity.length;
        }
        ws.cell(n, 6).string(unit.serial_number).style(style);
        if (col6width < unit.serial_number.length) {
          col6width = unit.serial_number.length;
        }
        ws.cell(n, 7).string(unit.notes).style(styleRight);
        if (unit.notes && unit.notes.length && col7width < unit.notes.length) {
          col7width = unit.notes.length;
        }
        n += 1;
      }
    }
    if (pc.system_case_unit.length > 0) {
      ws.cell(n, 1).string("").style(firstCellColor);
      ws.cell(n, 2).string("Обозначение изделия").style(styleBoldLeft);
      ws.cell(n, 3).string("Наименование изделия").style(styleBold);
      ws.cell(n, 4).string("Характеристика").style(styleBold);
      ws.cell(n, 5).string("Количество").style(styleBold);
      ws.cell(n, 6).string("Заводской номер").style(styleBold);
      ws.cell(n, 7).string("Примечание").style(styleBoldRight);
      n += 1;
      for (const unit of pc.system_case_unit) {
        ws.cell(n, 1).string("").style(firstCellColor);
        ws.cell(n, 2).string(unit.fdsi).style(styleLeft);
        if (col2width < unit.fdsi.length) {
          col2width = unit.fdsi.length;
        }
        ws.cell(n, 3).string(unit.type).style(style);
        if (col3width < unit.type.length) {
          col3width = unit.type.length;
        }
        ws.cell(n, 4).string(unit.name).style(style);
        if (col4width < unit.name.length) {
          col4width = unit.name.length;
        }
        ws.cell(n, 5).string(unit.quantity).style(style);
        if (col5width < unit.quantity.length) {
          col5width = unit.quantity.length;
        }
        ws.cell(n, 6).string(unit.serial_number).style(style);
        if (col6width < unit.serial_number.length) {
          col6width = unit.serial_number.length;
        }
        ws.cell(n, 7).string(unit.notes).style(styleRight);
        if (col7width < unit.notes.length) {
          col7width = unit.notes.length;
        }
        n += 1;
        ws.cell(n, 2).string("").style(styleBot1);
        ws.cell(n, 3).string("").style(styleBot1);
        ws.cell(n, 4).string("").style(styleBot1);
        ws.cell(n, 5).string("").style(styleBot1);
        ws.cell(n, 6).string("").style(styleBot1);
        ws.cell(n, 7).string("").style(styleBot1);
      }
    }
    n += 1;
  }
  ws.column(1).setWidth(3);
  ws.column(2).setWidth(col2width);
  ws.column(3).setWidth(col3width);
  ws.column(4).setWidth(col4width);
  ws.column(5).setWidth(col5width);
  ws.column(6).setWidth(col6width);
  ws.column(7).setWidth(col7width);

  const appDir = path.dirname(require.main.filename);
  const docDir = appDir + "/public/docx";
  let pathToExcel = `${docDir}/excel.xlsx`;

  workbook.write(pathToExcel, function () {
    const fileName = req.session.part + ".xlsx";
    console.log("PC report xlsx generated");
    res.download(pathToExcel, fileName);
  });
};

/**
 * Паспорт ПЭВМ
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.passport = async (req, res) => {
  const company = req.query.company;
  const appDir = path.dirname(require.main.filename);
  const docDir = `${appDir}/public/docx/${company}`;
  const pc = await PC.findById(req.params.id);
  const data = {
    fdsi: pc.fdsi,
    serial_number: pc.serial_number,
    pc_unit: pc.pc_unit,
    system_case_unit: pc.system_case_unit,
  };
  const buf = exportToDocx(company, data, "passport.docx");
  fs.writeFileSync(path.resolve(docDir, "output.docx"), buf);
  const file = `${docDir}/output.docx`;
  const fileName = pc.serial_number + ".docx";
  console.log(`Passport #${pc.serial_number} was formed`);
  res.download(file, fileName);
};

/**
 * Зип этикетка системного блока
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.systemCaseZip = async (req, res) => {
  const company = req.query.company;
  const appDir = path.dirname(require.main.filename);
  const docDir = `${appDir}/public/docx/${company}`;

  const pc = await PC.findById(req.params.id);
  const systemCase = await SystemCase.findOne({
    part: req.session.part,
    numberMachine: pc.serial_number,
  });

  const data = {
    fdsi: systemCase.fdsi,
    serial_number: systemCase.serialNumber,
    system_case_unit: pc.system_case_unit,
  };

  const buf = exportToDocx(company, data, "systemCaseZip.docx");

  fs.writeFileSync(path.resolve(docDir, "output.docx"), buf);
  const file = `${docDir}/output.docx`;
  const fileName = pc.serial_number + "-E.docx";
  console.log(`Zip label #${pc.serial_number} was formed`);
  res.download(file, fileName);
};

/**
 * Зип этикетка
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.zipLabel = async (req, res) => {
  const company = req.query.company;
  const appDir = path.dirname(require.main.filename);
  const docDir = `${appDir}/public/docx/${company}`;
  const pc = await PC.findById(req.params.id);

  const data = {
    fdsi: pc.fdsi,
    serial_number: pc.serial_number,
    pc_unit: pc.pc_unit,
    system_case_unit: pc.system_case_unit,
  };
  const buf = exportToDocx(company, data, "zipLabel.docx");

  fs.writeFileSync(path.resolve(docDir, "output.docx"), buf);
  const file = `${docDir}/output.docx`;
  const fileName = pc.serial_number + ".docx";
  console.log(`Zip label #${pc.serial_number} was formed`);
  res.download(file, fileName);
};

/**
 * Получить компанию
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getCompany = async (req, res) => {
  res.send(JSON.stringify({ companyName: req.user.company }));
};

/**
 * Сохранить компанию
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.setCompany = async (req, res) => {
  const user = req.user;
  user.company = req.body.companyName;
  await user.save();
  res.status(200).json({ message: "Company is changed" });
};

/**
 * Создание документа docx
 * @param company
 * @param data
 * @param templateName
 * @returns {*}
 */
function exportToDocx(company, data, templateName) {
  const appDir = path.dirname(require.main.filename);
  const docDir = `${appDir}/public/docx/${company}`;

  const content = fs.readFileSync(path.resolve(docDir, templateName), "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater();
  doc.loadZip(zip);
  doc.setData(data);
  try {
    doc.render();
  } catch (error) {
    const e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties,
    };
    console.log(
      JSON.stringify({
        error: e,
      })
    );
    throw error;
  }
  return doc.getZip().generate({
    type: "nodebuffer",
  });
}
