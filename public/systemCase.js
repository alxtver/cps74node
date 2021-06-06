/**
 * Загрузка системных блоков
 */
async function loadSystemCaseData() {
  const response = await getData("/systemCases/getAll");
  const systemCases = response.systemCases;
  createSystemCaseTable(systemCases, () => {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });
}

function createSystemCaseTable(systemCases, callback) {
  const container = document.getElementById("systemCases");
  container.innerHTML = "";
  for (const systemCase of systemCases) {
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
      insCell("", row, unit.name, "", "", false, { id: systemCase._id });
      insCell("", row, unit.quantity, "", "", false, { id: systemCase._id });
      const serialNumberCell = row.insertCell();
      serialNumberCell.innerHTML = unit.serial_number;
      serialNumberCell.dataset.id = systemCase._id;
      serialNumberCell.dataset.obj = systemCase.i;
      serialNumberCell.dataset.unit = "system_case_unit";
      serialNumberCell.contentEditable = "true";
      if (unit.apkzi) {
        serialNumberCell.dataset.apkzi = "szi";
      }
      serialNumberCell.dataset.data = unit._id + ";" + unit.i + ";" + "system_case_unit";
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
            edit_serial_number(id, obj, unit, serial_number);
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

    buttons(div, systemCase)
  }
  callback();
}
