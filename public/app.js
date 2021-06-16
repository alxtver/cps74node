function snList(arr) {
  let cont = document.getElementById("snBar");
  cont.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    let p = document.createElement("p");
    p.innerHTML = arr[i];
    p.style.opacity = (1 / (i + 2)).toString();
    p.style.fontWeight = "700";
    p.className = "noneSelect";
    cont.appendChild(p);
  }
}
// добавление данных в сессию браузера
function addSession() {
  localStorage.ean_code = document.getElementById("ean_code").value;
  localStorage.type_pki = document.getElementById("type_pki").value;
  localStorage.vendor = document.getElementById("vendor").value;
  localStorage.model = document.getElementById("model").value;
  localStorage.country = document.getElementById("country").value;
  localStorage.part = document.getElementById("part").value;

  let field_serial_number = document.getElementById("serial_number").value;
  if (field_serial_number) {
    let array = localStorage.snList;
    let snArr = [];
    if (array && array.length > 0) snArr = array.split(",");
    if (snArr.length > 10) snArr.pop();
    snArr.unshift(field_serial_number);
    localStorage.snList = snArr;
  }
}

// выгрузка данных из сессии браузера
function loadSession() {
  document.getElementById("ean_code").value = localStorage.ean_code || "";
  document.getElementById("type_pki").value = localStorage.type_pki || "";
  document.getElementById("vendor").value = localStorage.vendor || "";
  document.getElementById("model").value = localStorage.model || "";
  document.getElementById("country").value = localStorage.country || "";
  document.getElementById("part").value = localStorage.part || "";
  if (localStorage.type_pki) {
    document.getElementById("serial_number").focus();
  } else {
    document.getElementById("ean_code").focus();
  }
  let array = localStorage.snList;
  if (array) snList(array.split(","));
}

// function plusOne(number) {
//   let indexChar = 0
//   for (let index = 0; index < number.length; index++) {
//     if (!/\d/.test(number[index])) indexChar = index
//   }
//   let firstPart = number.slice(0, indexChar + 1)
//   let secondPart = number.slice(indexChar + 1)
//   const lengthSecondPart = secondPart.length
//   const secondPartPlusOne = parseInt(secondPart) + 1
//   return firstPart + secondPartPlusOne.toString().padStart(lengthSecondPart, '0')
// }

// function minusOne(number) {
//   let indexChar = 0
//   for (let index = 0; index < number.length; index++) {
//     if (!/\d/.test(number[index])) indexChar = index
//   }
//   let firstPart = number.slice(0, indexChar + 1)
//   let secondPart = number.slice(indexChar + 1)
//   const lengthSecondPart = secondPart.length
//   const secondPartMinusOne = parseInt(secondPart) - 1
//   return firstPart + secondPartMinusOne.toString().padStart(lengthSecondPart, '0')
// }

function calc(number) {
  let indexChar = 0;
  for (let index = 0; index < number.length; index++) {
    if (!/\d/.test(number[index])) indexChar = index;
  }
  let firstPart = number.slice(0, indexChar + 1);
  let secondPart = number.slice(indexChar + 1);
  const lengthSecondPart = secondPart.length;
  const secondPartPlusOne = parseInt(secondPart) + 1;
  const secondPartMinusOne = parseInt(secondPart) - 1;
  return {
    plusOne: function () {
      return (
        firstPart + secondPartPlusOne.toString().padStart(lengthSecondPart, "0")
      );
    },
    minusOne: function () {
      return (
        firstPart +
        secondPartMinusOne.toString().padStart(lengthSecondPart, "0")
      );
    },
  };
}

// добавление данных в сессию браузера
function addSessionApkzi() {
  localStorage.fdsi = document.getElementById("fdsi").value;
  localStorage.apkzi_name = document.getElementById("apkzi_name").value;
  localStorage.kont_name = document.getElementById("kont_name").value;
  localStorage.fdsiKontr = document.getElementById("fdsiKontr").value;
  localStorage.zav_number = document.getElementById("zav_number").value;
  localStorage.kontr_zav_number = document.getElementById(
    "kontr_zav_number"
  ).value;
  localStorage.part = document.getElementById("part").value;
}

// выгрузка данных из сессии браузера
function loadSessionApkzi() {
  document.getElementById("fdsi").value = localStorage.fdsi || "";
  document.getElementById("apkzi_name").value = localStorage.apkzi_name || "";
  document.getElementById("kont_name").value = localStorage.kont_name || "";
  document.getElementById("fdsiKontr").value = localStorage.fdsiKontr || "";
  document.getElementById("zav_number").value =
    calc(localStorage.zav_number).plusOne() || "";
  document.getElementById("kontr_zav_number").value =
    calc(localStorage.kontr_zav_number).plusOne() || "";
  document.getElementById("part").value = localStorage.part || "";

  if (localStorage.fdsi) {
    document.getElementById("kontr_zav_number").focus();
  } else {
    document.getElementById("fdsi").focus();
  }
}

function searchEAN(valueEAN) {
  const data = {
    valueEAN: valueEAN,
  };
  localStorage.removeItem("countSymbols");
  localStorage.removeItem("snList");
  postData("/pkis/searchEAN", data).then((data) => {
    // console.log(data.ean.countSymbols);
    const type = document.getElementById("type_pki");
    const vendor = document.getElementById("vendor");
    const model = document.getElementById("model");
    const country = document.getElementById("country");
    const serial_number = document.getElementById("serial_number");
    if (data.ean) {
      type.value = data.ean.type_pki;
      vendor.value = data.ean.vendor;
      model.value = data.ean.model;
      country.value = data.ean.country;
      serial_number.focus();
      textToSpeech(`${data.ean.type_pki} ${data.ean.vendor}`, 2);
      if (data.ean.countSymbols) {
        localStorage.countSymbols = data.ean.countSymbols;
      }
    } else if (data.upcitemdbValue) {
      type.value = "";
      vendor.value = data.upcitemdbValue.items[0].brand.toUpperCase();
      if (data.upcitemdbValue.items[0].model) {
        model.value = data.upcitemdbValue.items[0].model.toUpperCase();
      } else {
        model.value = data.upcitemdbValue.items[0].title.toUpperCase();
      }
      country.value = data.country;
    } else {
      type.value = vendor.value = model.value = "";
      country.value = data.country;
    }
  });
}

function load_part_navbar() {
  if (document.location.pathname !== "/auth/login") {
    postData("/pcPa/part").then((data) => {
      if (data) {
        CreateSelectNavbar(data.parts, function () {
          if (data.currentPartId) {
            document.getElementById("part_select_navbar").value =
              data.currentPartId;
          }
          const partInput = document.getElementById("part");
          if (partInput) {
            const select = document.getElementById("part_select_navbar");
            partInput.value = select.options[select.selectedIndex].innerHTML;
          }
        });
      }
    });
  }
}

function CreateSelectNavbar(data, callback) {
  const select = document.getElementById("part_select_navbar");
  for (let i = 0; i < data.length; i++) {
    const option = document.createElement("option");
    option.text = data[i].part;
    option.value = data[i]._id;
    select.appendChild(option);
  }
  callback();
}

function changeSelect(selectedItem) {
  const data = {
    selectedItem: selectedItem,
  };
  postData("/insert_part_session", data).then(() => {
    location.reload();
  });
}

function setPage(page) {
  if (page)
    postData("/pcPa/setPage", {
      page,
    });
}

function translate(text) {
  let ruToEnSN = "";
  let enToRuSN = "";
  const ruLet = "ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ";
  const engLet = "QWERTYUIOPASDFGHJKLZXCVBNM";
  for (const l of text.toUpperCase()) {
    const ind = ruLet.indexOf(l);
    ruToEnSN += ind >= 0 ? engLet[ind] : l;
  }
  for (const l of text.toUpperCase()) {
    const ind = engLet.indexOf(l);
    enToRuSN += ind >= 0 ? ruLet[ind] : l;
  }
  return {
    ruToEnSN: ruToEnSN,
    enToRuSN: enToRuSN,
  };
}

function autocomplete(inp, arr) {
  let currentFocus;
  inp.addEventListener("input", function (e) {
    let a,
      b,
      i,
      val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      let subs = arr[i].substr(0, val.length).toUpperCase();
      if (
        subs === val.toUpperCase() ||
        subs === translate(val).ruToEnSN ||
        subs === translate(val).enToRuSN
      ) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.key === "ArrowDown") {
      currentFocus++;
      addActive(x);
    } else if (e.key === "ArrowUp") {
      currentFocus--;
      addActive(x);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(element) {
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (element !== x[i] && element !== inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function CreateSelectType(data, callback) {
  const select = document.querySelector("#type_select_navbar");
  select.innerHTML = "";
  let option = document.createElement("option");
  option.text = "...";
  option.value = "...";
  select.add(option);
  for (const d of data) {
    option = document.createElement("option");
    option.text = d;
    option.value = d;
    select.add(option);
  }
  callback();
}

function setSoundSessionOn() {
  localStorage.sound = "on";
  document.getElementById("soundOff").hidden = true;
  document.getElementById("soundOn").hidden = false;
}

function setSoundSessionOff() {
  localStorage.sound = "off";
  document.getElementById("soundOff").hidden = false;
  document.getElementById("soundOn").hidden = true;
  speechSynthesis.cancel();
}

function textToSpeech(text, rate) {
  if (navigator.platform.indexOf("Win") + 1) {
    console.log(navigator.platform, rate);
  } else {
    rate = rate / 10 + 0.8;
    console.log(navigator.platform, rate);
  }
  if (localStorage.sound === "on") {
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = "ru-RU";
    ut.volume = 1;
    ut.rate = rate;
    ut.pitch = 1;
    speechSynthesis.speak(ut);
    // speechSynthesis.cancel()
  }
}

function tablePC(pc, units = "all", contentEditable = true, ...rows) {
  // таблица ПЭВМ
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover";
  if (units === "systemCase") {
    table.classList.remove("table-sm");
    table.classList.add("assemblytable");
  }
  table.id = pc._id;
  let tr = table.insertRow(-1);
  const rowsHeaders = {
    fdsi: "Обозначение изделия",
    type: "Наименование изделия",
    name: "Характеристика",
    quantity: "Количество",
    serial_number: "Заводской номер",
    notes: "Примечания",
  };
  // шапка
  if (units === "all") {
    insCell("", tr, "ФДШИ." + pc.fdsi, "up", "", false);
  }

  let td = document.createElement("td");
  td.innerHTML = pc.serial_number;
  td.id = pc.serial_number;
  if (units === "systemCase") {
    td.id = "serial_number";
  }
  td.style.cssText = "font-size: 1.5rem;background-color:" + pc.back_color;
  tr.appendChild(td);
  insCell("", tr, pc.arm, "up", "", false);
  insCell("", tr, pc.execution, "up", "", false);
  if (units === "all") {
    insCell("", tr, "", "up", "", false);
  }
  td = document.createElement("td");
  if (pc.attachment) {
    td.innerHTML = pc.attachment;
    td.style.cssText =
      "font-size: 1.1rem;border-radius: 0px 10px 0px 0px;background-color:" +
      pc.back_color;
  }
  tr.appendChild(td);

  if (units === "systemCase") {
    const apkziDiv = document.getElementById("apkziDiv");
    apkziDiv.innerHTML = "";
    let arr_pc_unit = pc.pc_unit;
    for (let j = 0; j < arr_pc_unit.length; j++) {
      if (arr_pc_unit[j].apkzi && arr_pc_unit[j].serial_number !== "") {
        const apkziDiv = document.getElementById("apkziDiv");
        apkziDiv.innerHTML = "Номер АПКЗИ - " + arr_pc_unit[j].serial_number;
        apkziDiv.style.display = "block";
      }
    }
  }

  if (units === "all" || units === "pcUnit") {
    // заголовок таблицы состава ПЭВМ
    if (pc.pc_unit.length > 0) {
      tr = table.insertRow(-1);
      for (const row of rows) {
        insCell("", tr, rowsHeaders[row], "table-dark", "", false);
      }
    }
    // таблица ПЭВМ
    let arr_pc_unit = pc.pc_unit;
    for (let j = 0; j < arr_pc_unit.length; j++) {
      tr = table.insertRow(-1);
      for (const row of rows) {
        if (row !== "serial_number") {
          insCell("", tr, arr_pc_unit[j][row], row, "", false, {
            id: pc._id,
          });
        } else {
          let serial_numberCell = tr.insertCell(-1);
          serial_numberCell.innerHTML = arr_pc_unit[j].serial_number;
          serial_numberCell.dataset.id = pc._id;
          serial_numberCell.dataset.obj = j;
          serial_numberCell.dataset.unit = "pc_unit";
          if (contentEditable) {
            serial_numberCell.contentEditable = "true";
          }
          if (arr_pc_unit[j].apkzi) {
            serial_numberCell.dataset.apkzi = "apkzi";
            serial_numberCell.contentEditable = "false";
          }
          serial_numberCell.dataset.data = pc._id + ";" + j + ";" + "pc_unit";
          serial_numberCell.className = "serial_number";
          serial_numberCell.addEventListener("keypress", function (e) {
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
        }
      }
    }
  }
  // таблица системного блока
  if (units === "all" || units === "systemCase") {
    if (pc.system_case_unit.length > 0) {
      tr = table.insertRow(-1);
      for (const row of rows) {
        insCell("", tr, rowsHeaders[row], "table-dark", "", false);
      }
    }
    let arr_system_case_unit = pc.system_case_unit;
    for (let j = 0; j < arr_system_case_unit.length; j++) {
      tr = table.insertRow();
      for (const row of rows) {
        if (row !== "serial_number") {
          insCell("", tr, arr_system_case_unit[j][row], row, "", false, {
            id: pc._id,
          });
        } else {
          let serial_numberCell = tr.insertCell(-1);
          serial_numberCell.innerHTML = arr_system_case_unit[j].serial_number;
          serial_numberCell.dataset.id = pc._id;
          serial_numberCell.dataset.obj = j;
          serial_numberCell.dataset.unit = "system_case_unit";
          serial_numberCell.dataset.data =
            pc._id + ";" + j + ";" + "system_case_unit";
          if (arr_system_case_unit[j].szi) {
            serial_numberCell.dataset.apkzi = "szi";
          }
          serial_numberCell.className = "serial_number";
          if (contentEditable) {
            serial_numberCell.contentEditable = "true";
            serial_numberCell.addEventListener("keypress", function (e) {
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
          }
        }
      }
    }
  }
  return table;
}

/**
 * Вставить ячейку
 * @param unit
 * @param parent
 * @param html
 * @param classN
 * @param id
 * @param contentEditable
 * @param dataset
 */
function insCell(
  unit,
  parent,
  html = "",
  classN,
  id,
  contentEditable,
  dataset
) {
  let cell = parent.insertCell(-1);
  if (classN) cell.className = classN;
  if (id) cell.id = id;
  if (contentEditable) cell.contentEditable = contentEditable;
  cell.innerHTML = html;
  if (id === "serial_number") {
    if (
      unit === "Системный блок" ||
      unit === "Сетевой фильтр" ||
      unit === "Гарнитура" ||
      unit === "Корпус"
    ) {
      cell.className = "serial_number number_mashine";
    } else if (unit === "Вентилятор процессора") {
      cell.innerHTML = "б/н";
    } else {
      cell.className = "serial_number";
    }
  }
  if (id === "notes" && unit === "Системный блок") {
    cell.innerHTML = "с кабелем питания";
  }
  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      cell.dataset[key] = value;
    }
  }
}

/**
 * Создание tbody
 * @param equipment
 * @param tbody
 */
function createTableBody(equipment, tbody) {
  for (const item of equipment) {
    const tr = tbody.insertRow();
    insCell(item, tr, "<input type='checkbox' name='record'>", "record");
    insCell(item, tr, "", "fdsi", "fdsi", true);
    insCell(item, tr, item, "type", "type", true);
    insCell(item, tr, "", "name", "name", true);
    insCell(item, tr, "1", "quantity", "quantity", true);
    insCell(item, tr, "", "serial_number", "serial_number", true);
    insCell(item, tr, "", "notes", "notes", true);
  }
}

/**
 * Создать строку СЗИ
 * @param tableBody
 */
function createSZIRow(tableBody) {
  const tr = tableBody.insertRow(-1);
  tr.className = "apkzi";
  insCell("", tr, "<input type='checkbox' name='record'>", "record", "record");
  insCell("", tr, "", "fdsi", "fdsi", true);
  insCell("", tr, "Контроллер СЗИ10 PCI", "type", "type", true, {
    apkzi: "szi",
  });
  insCell("", tr, "", "name", "name", true);
  insCell("", tr, "1", "quantity", "quantity", true);
  insCell("", tr, "", "serial_number", "serial_number", true, {
    apkzi: "szi",
  });
  insCell("", tr, "", "notes", "notes", true);
}

/**
 * Добавить строку в таблице
 */
function addRow() {
  let records = document.querySelectorAll('input[name="record"]');
  for (const rec of records) {
    if (rec.checked) {
      let checkedRow = rec.closest("tr");
      let newRow = document.createElement("tr");
      insCell("", newRow, "<input type='checkbox' name='record'>", "record");
      insCell("", newRow, "", "fdsi", "fdsi", true);
      insCell("", newRow, "", "type", "type", true);
      insCell("", newRow, "", "name", "name", true);
      insCell("", newRow, "1", "quantity", "quantity", true);
      insCell("", newRow, "", "serial_number", "serial_number", true);
      insCell("", newRow, "", "notes", "notes", true);
      checkedRow.parentNode.insertBefore(newRow, checkedRow.nextSibling);
    }
  }
}

/**
 * Удалить строку из таблицы
 */
function delRow() {
  let records = document.querySelectorAll('input[name="record"]');
  for (const rec of records) {
    if (rec.checked) {
      rec.closest("tr").remove();
    }
  }
}

function buttons(container, pc, editUrl) {
  const serialNumber = pc.serial_number || pc.serialNumber;
  let button_copy = document.createElement("input");
  button_copy.type = "button";
  button_copy.className = "btn btn-outline-primary me-2 mb-2 ms-3 copyBtn";
  button_copy.onchange = "clkCopy()";
  button_copy.value = "Копировать";
  button_copy.dataset.id = pc._id;
  button_copy.dataset.serial_number = serialNumber;
  button_copy.dataset.bsToggle = "modal";
  button_copy.dataset.bsTarget = "#modalCopy";
  button_copy.addEventListener("click", (e) => {
    document.getElementById("hidInputCopy").value = e.target.dataset.id;
    document.getElementById("inputCopy").value = e.target.dataset.serial_number;
  });
  container.appendChild(button_copy);

  let button_edit = document.createElement("input");
  button_edit.type = "button";
  button_edit.className = "btn btn-outline-success me-2 mb-2";
  button_edit.value = "Редактировать";
  button_edit.setAttribute("onclick", `location.href='${editUrl}'`);
  button_edit.dataset.id = pc._id;
  container.appendChild(button_edit);

  let button_del = document.createElement("input");
  button_del.type = "button";
  button_del.className = "btn btn-outline-danger me-2 mb-2 delBtn float-end";
  button_del.value = "Удалить";
  button_del.dataset.id = pc._id;
  button_del.dataset.serial_number = serialNumber;
  button_del.dataset.bsTarget = "#modalDel";
  button_del.dataset.bsToggle = "modal";
  button_del.addEventListener("click", (e) => {
    document.getElementById("hidId").value = e.target.dataset.id;
    document.getElementById("serial").innerHTML =
      "Серийный номер - " + e.target.dataset.serial_number;
  });
  container.appendChild(button_del);
}

/**
 * Поиск серийного номера
 * @param url
 * @param serialNumber
 * @param element
 */
function findSerialNumber(url, serialNumber, element) {
  const data = {
    serial: serialNumber,
  };
  postData(url, data).then((data) => {
    if (data) {
      element.style.backgroundColor = "indianred";
      let h = document.getElementById("hidd");
      let danger = document.getElementById("danger");
      if (!danger) {
        let d = document.createElement("div");
        d.id = "danger";
        d.style.color = "indianred";
        d.innerHTML = "Машина с таким номером существует";
        h.append(d);
      }
      document.getElementById("btnSubmit").disabled = true;
    } else {
      document.getElementById("inputCopy").style.backgroundColor = "white";
      if (document.getElementById("danger"))
        document.getElementById("danger").remove();
      document.getElementById("btnSubmit").disabled = false;
    }
  });
}

/**
 * Дефолтный хэдер
 * @param table
 */
function defaultHeader(table) {
  const tHead = table.createTHead(); // TABLE ROW.
  const row = tHead.insertRow();
  insCell("", row, "", "table-dark", "", false);
  insCell("", row, "Обозначение изделия", "table-dark", "", false);
  insCell("", row, "Наименование изделия", "table-dark", "", false);
  insCell("", row, "Характеристика", "table-dark", "", false);
  insCell("", row, "Количество", "table-dark", "", false);
  insCell("", row, "Заводской номер", "table-dark", "", false);
  insCell("", row, "Примечания", "table-dark", "", false);
}

/**
 * Добавить строку СЗИ
 */
function addSZI() {
  const tBody = document.querySelector("tbody");
  if (!tBody.querySelector(".apkzi")) {
    createSZIRow(tBody);
  }
}

function arrayFromTable(tableRows) {
  const units = [];
  tableRows.forEach((row, index) => {
    const unit = {
      i: index,
      fdsi: row.querySelector(".fdsi").innerText.trim(),
      type: row.querySelector(".type").innerText.trim(),
      name: row.querySelector(".name").innerText.trim(),
      quantity: row.querySelector(".quantity").innerText.trim(),
      serial_number: row.querySelector(".serial_number").innerText.trim(),
      notes: row.querySelector(".notes").innerText.trim(),
    };
    if (row.className === "apkzi") {
      unit.szi = "apkzi";
    }
    units.push(unit);
  });
  return units;
}

function flashAlert(data, serialNumber) {
  let oldMashine = data.oldNumberMachine || data.oldSystemCase?.serialNumber

  if (data.duplicatePki) {
    document.querySelector(".popup-checkbox").checked = true;
    document.getElementById("oldNumber").innerHTML =
      "Такой серийник уже есть!!!";
    const audio = {};
    audio["alert"] = new Audio();
    audio["alert"].src = "/sounds/alert.mp3";
    audio["alert"].play();
    return false;
  }
  if (oldMashine) {
    if (oldMashine !== serialNumber) {
      document.querySelector(".popup-checkbox").checked = true;
      document.getElementById("oldNumber").innerHTML =
        "Серийник был привязан к машине с номером " + oldMashine;
      const audio = {};
      audio["alert"] = new Audio();
      audio["alert"].src = "/sounds/alert.mp3";
      audio["alert"].play();
    } else {
      oldMashine = null;
    }
  }
}

function painting() {
  const nameCells = document.querySelectorAll("td.name");
  const snCells = document.querySelectorAll("td.serial_number");

  for (const cell of nameCells) {
    cell.style.backgroundColor = cell.innerHTML === "Н/Д" ? "coral" : "";
  }
  for (const cell of snCells) {
    cell.style.backgroundColor = cell.innerHTML === "" ? "darkgray" : "";
  }
}

function createSystemCaseTable(systemCase, container, assemblyTable = false) {
  const table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover";
  if (assemblyTable) {
    table.className = 'table table-bordered table-hover assemblytable'
  }
  table.id = systemCase._id;
  let row = table.insertRow();
  let columnNames = [
    "Обозначение изделия",
    "Наименование изделия",
    "Характеристика",
    "Количество",
    "Заводской номер",
    "Примечания",
  ];
  if (assemblyTable) {
    columnNames = [
      "Наименование изделия",
      "Характеристика",
      "Количество",
      "Заводской номер",
    ];
  }

  // шапка
  if (!assemblyTable) {
    insCell("", row, "ФДШИ." + systemCase.fdsi, "up", "", false);
  }
  let cell = document.createElement("td");
  cell.innerHTML = systemCase.serialNumber;
  cell.id = assemblyTable ? 'serial_number' : systemCase.serialNumber;
  cell.style.cssText =
    "font-size: 1.5rem;background-color:" + systemCase.back_color;
  row.appendChild(cell);
  insCell("", row, systemCase.arm, "up", "", false);
  insCell("", row, systemCase.execution, "up", "", false);
  if (!assemblyTable) {
    insCell("", row, "", "up", "", false);
  }

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
    row.className = 'system-case-row'
    if (!assemblyTable) {
      insCell("", row, unit.fdsi, "", "", false, { id: systemCase._id });
    }

    insCell("", row, unit.type, "type", "", false, { id: systemCase._id });
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
        const serialNumber = e.target.innerText;
        const data_hidd = e.target.dataset.data;
        const data_apkzi = e.target.dataset.apkzi;
        document.getElementById("hidd_id").value = data_hidd;
        if (data_apkzi) {
          insertSystemCaseSZI(id, obj, serialNumber);
        } else {
          editSerialNumber(id, obj, serialNumber);
        }
      }
    });
    if (!assemblyTable) {
      insCell("", row, unit.notes, "", "", false, { id: systemCase._id });
    }
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

function editSerialNumber(id, obj, serialNumber) {
  serialNumber = translate(serialNumber).ruToEnSN
  const data = {
    id: id,
    obj: obj,
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
        const row = document.querySelector(".serial_number[data-data='" + nextId.join(';') + "']").parentElement
        const cells = row.children

        if (cells) {
          for (const cell of cells) {
            if (cell.className === 'type') {
              textToSpeech(cell.innerText, 1)
              break
            }
          }

        }
      }
    }
    painting()
  }
}

function insertSystemCaseSZI(id, index, serialNumber) {
  postData('/systemCases/insertSystemCaseSZI', {id, index, serialNumber})
      .then((data) => {
        flashAlert(data)
        const serialNumber = data.pc.serial_number
        const oldNumberMachine = (data.oldNumberMachine != serialNumber) ? data.oldNumberMachine : null
        UpdateCells(data.pc, oldNumberMachine)
        const user = document.getElementById('userName').value
        const id = data.pc._id
        socket.emit('updateAssemblyPC', {
          serialNumber,
          user,
          id
        })
      })
}
