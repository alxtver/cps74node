/**
 * Действия после загрузки дома
 */
document.addEventListener("DOMContentLoaded", function () {
  loadSystemCaseData()
  const copyInput = document.getElementById('inputCopy')
  copyInput.addEventListener('keyup', (e) => {
    findSerialNumber('/systemCases/findSerial', e.target.value, copyInput)
  })
})

/**
 * Загрузка системных блоков
 */
async function loadSystemCaseData() {
  const response = await getData("/systemCases/getAll");
  const systemCases = response.systemCases;
  systemCaseList(systemCases, () => {
    painting()
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });
}

function systemCaseList(systemCases, callback) {
  const container = document.getElementById("systemCases");
  container.innerHTML = "";
  for (const systemCase of systemCases) {
    createSystemCaseTable(systemCase, container)
  }
  callback();
}

function createSystemCaseTable(systemCase, container) {
  const table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover";
  table.id = systemCase._id;
  let row = table.insertRow();
  const columnNames = [
    "Обозначение изделия",
    "Наименование изделия",
    "Характеристика",
    "Количество",
    "Заводской номер",
    "Примечания",
  ];

  // шапка
  insCell("", row, "ФДШИ." + systemCase.fdsi, "up", "", false);
  let cell = document.createElement("td");
  cell.innerHTML = systemCase.serialNumber;
  cell.id = systemCase.serialNumber;
  cell.style.cssText =
    "font-size: 1.5rem;background-color:" + systemCase.back_color;
  row.appendChild(cell);
  insCell("", row, systemCase.arm, "up", "", false);
  insCell("", row, systemCase.execution, "up", "", false);
  insCell("", row, "", "up", "", false);
  cell = document.createElement("td");
  cell.innerHTML = systemCase.attachment;
  cell.style.cssText =
    "font-size: 1.1rem;border-radius: 0px 10px 0px 0px;background-color:" +
    systemCase.back_color;
  row.appendChild(cell);
  row = table.insertRow();
  for (const name of columnNames) {
    insCell("", row, name, "table-dark", "", false);
  }
  for (const unit of systemCase.systemCaseUnits) {
    const row = table.insertRow();
    insCell("", row, unit.fdsi, "", "", false, { id: systemCase._id });
    insCell("", row, unit.type, "", "", false, { id: systemCase._id });
    insCell("", row, unit.name, "name", "", false, { id: systemCase._id });
    insCell("", row, unit.quantity, "", "", false, { id: systemCase._id });
    const serialNumberCell = row.insertCell();
    serialNumberCell.innerHTML = unit.serial_number;
    serialNumberCell.dataset.id = systemCase._id;
    serialNumberCell.dataset.obj = unit.i;
    serialNumberCell.dataset.unit = "system_case_unit";
    serialNumberCell.contentEditable = "true";
    if (unit.szi) {
      serialNumberCell.dataset.apkzi = "szi";
    }
    serialNumberCell.dataset.data = systemCase._id + ";" + unit.i + ";" + "system_case_unit";
    serialNumberCell.className = "serial_number";
    serialNumberCell.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const id = e.target.dataset.id;
        const obj = e.target.dataset.obj;
        const unit = e.target.dataset.unit;
        const serial_number = e.target.innerText;
        const data_hidd = e.target.dataset.data;
        const data_apkzi = e.target.dataset.apkzi;
        document.getElementById("hidd_id").value = data_hidd;
        if (data_apkzi) {
          edit_serial_number_apkzi(id, obj, unit, serial_number);
        } else {
          editSerialNumber(id, obj, unit, serial_number);
        }
      }
    });
    insCell("", row, unit.notes, "", "", false, { id: systemCase._id });
  }

  const div = document.createElement("div");
  div.id = systemCase._id;
  div.className = "pcCard mb-3 table-responsive";
  div.style.cssText =
    "-webkit-box-shadow: 0 30px 60px 0" +
    systemCase.back_color +
    ";box-shadow: 0 30px 60px 0" +
    systemCase.back_color;
  container.appendChild(div);
  div.innerHTML = "";
  div.appendChild(table);

  buttons(div, systemCase, `/systemCases/${systemCase._id}/edit?allow=true`)
}


function editSerialNumber(id, obj, unit, serialNumber) {
  serialNumber = translate(serialNumber).ruToEnSN
  const data = {
    id: id,
    obj: obj,
    unit: unit,
    serialNumber: serialNumber
  }
  putData('/systemCases/editSerialNumber', data).then((data) => {
    const serialNumber = data.systemCase?.serialNumber || null
    flashAlert(data, serialNumber)
    if (!data.duplicatePki) {
      const oldSystemCase = (data.oldSystemCase !== serialNumber) ? data.oldSystemCase : null
      updateCells(data.systemCase, oldSystemCase)
      const id = data.systemCase._id
      socket.emit('updateAssemblyPC', {
        serialNumber,
        id
      })
    }
  })
}

function updateCells(systemCase, oldSystemCase, voice = true) {
  if (oldSystemCase) {
    refreshOneTable(oldSystemCase)
  }
  refreshOneTable(systemCase)

  //переход на одну ячейку вниз
  let currentId = document.getElementById('hidd_id').value
  let nextId = currentId.split(";")
  nextId[1] = Number(nextId[1]) + 1 + ''
  if (!document.querySelector('.popup-checkbox').checked) {
    let nextCell = document.querySelector(".serial_number[data-data='" + nextId.join(';') + "']")
    let nextCellText
    if (nextCell) {
      nextCellText = nextCell.innerHTML
      while (/[Бб].?[Нн]/g.test(nextCellText) || nextCellText === systemCase.serialNumber) {
        nextId[1] = Number(nextId[1]) + 1 + ''
        nextCell = document.querySelector(".serial_number[data-data='" + nextId.join(';') + "']")
        if (!nextCell) {
          break
        }
        nextCellText = nextCell.innerHTML
      }
      if (nextCell) {
        nextCell.focus()
      }
      //TextToSpeech
      if (voice) {
        const rows = document.querySelector(".serial_number[data-data='" + nextId.join(';') + "']").parentElement
        const row = rows.children
        if (row) {
          textToSpeech(row[1].innerText, 1)
        }
      }
    }
    painting()
  }
}

function refreshOneTable(systemCase) {
  const container = document.getElementById(systemCase._id)
  container.innerHTML = ""
  createSystemCaseTable(systemCase, container)
}

function clkCopy() {
  document.getElementById('inputCopy').focus()
  document.getElementById('btnSubmit').disabled = true
}

/**
 * Удалить системный блок
 */
function delBtn() {
  const id = document.getElementById('hidId').value
  deleteData('/systemCases/delete', {id})
    .then((data) => {
      if (data.message === 'ok') {
        document.getElementById(id).style.display = 'none'
      }
    })
}
