function load_data(q) {
  let data = {
    q: q
  }
  postData('/pcPa/search', data)
    .then((data) => {
      CreateTableFromJSON(data)
      let select = document.getElementById("serials")
      for (const d of data) {
        let option = document.createElement("option")
        option.value = d.serial_number
        option.text = d.serial_number
        select.add(option)
      }
      let overlay = document.getElementById('overlay')
      overlay.style.display = 'none'
    })
}

function TablePc(pc) {
  // таблица ПЭВМ
  let table = document.createElement("table");

  table.className = "table table-sm table-bordered table-hover table-responsive pctable"
  table.id = pc._id

  let tr = table.insertRow(-1)
  let td = document.createElement("td")
  td.innerHTML = 'ФДШИ.' + pc.fdsi
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.serial_number
  td.id = pc.serial_number
  td.style.cssText = 'font-size: 1.5rem;background-color:' + pc.back_color
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.arm
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.execution
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  tr.appendChild(td)

  td = document.createElement("td")
  if (pc.attachment) {
    td.innerHTML = pc.attachment
    td.style.cssText = 'font-size: 1.1rem;border-radius: 0px 10px 0px 0px;background-color:' + pc.back_color
  }
  tr.appendChild(td)

  if (pc.pc_unit.length > 0) {
    tr = table.insertRow(-1)
    insCell(tr, 'Обозначение изделия', 'header')
    insCell(tr, 'Наименование изделия', 'header')
    insCell(tr, 'Характеристика', 'header')
    insCell(tr, 'Количество', 'header')
    insCell(tr, 'Заводской номер', 'header')
    insCell(tr, 'Примечания', 'header')
  }
  const arr_pc_unit = pc.pc_unit
  for (let j = 0; j < arr_pc_unit.length; j++) {
    tr = table.insertRow(-1)
    insCell(tr, arr_pc_unit[j].fdsi)
    insCell(tr, arr_pc_unit[j].type)
    insCell(tr, arr_pc_unit[j].name)
    insCell(tr, arr_pc_unit[j].quantity)
    insCell(tr, arr_pc_unit[j].serial_number)
    insCell(tr, arr_pc_unit[j].notes)
  }
  if (pc.system_case_unit.length > 0) {
    tr = table.insertRow(-1)
    insCell(tr, 'Обозначение изделия', 'header')
    insCell(tr, 'Наименование изделия', 'header')
    insCell(tr, 'Характеристика', 'header')
    insCell(tr, 'Количество', 'header')
    insCell(tr, 'Заводской номер', 'header')
    insCell(tr, 'Примечания', 'header')
  }
  const arr_system_case_unit = pc.system_case_unit
  for (let j = 0; j < arr_system_case_unit.length; j++) {
    tr = table.insertRow(-1)
    insCell(tr, arr_system_case_unit[j].fdsi)
    insCell(tr, arr_system_case_unit[j].type)
    insCell(tr, arr_system_case_unit[j].name)
    insCell(tr, arr_system_case_unit[j].quantity)
    insCell(tr, arr_system_case_unit[j].serial_number)
    insCell(tr, arr_system_case_unit[j].notes)
  }
  return table
}

function CreateTableFromJSON(data) {
  let divContainer = document.getElementById("PC")
  divContainer.innerHTML = ""

  for (let elem of data) {
    table = tablePC(elem, 'all', false,
      'fdsi',
      'type',
      'name',
      'quantity',
      'serial_number',
      'notes'
    )
    let divContainer = document.getElementById("PC");
    let divCont = document.createElement("div")
    divCont.id = elem._id
    divCont.style.cssText = '-webkit-box-shadow: 0 30px 60px 0' + elem.back_color + ';box-shadow: 0 30px 60px 0' + elem.back_color
    divCont.className = "pcCard mb-3"
    divContainer.appendChild(divCont);
    divCont.innerHTML = ""
    divCont.appendChild(table)

    let button_passport = document.createElement('input')
    button_passport.type = "button"
    button_passport.className = 'btn btn-outline-primary mr-1 mb-2 ml-3 copyBtn'
    button_passport.value = 'Паспорт Word'
    button_passport.setAttribute("onclick", "location.href='/projects/" + elem._id + "/passportDocx'")
    button_passport.dataset.id = elem._id
    divCont.appendChild(button_passport)

    let button_sbZipE = document.createElement('input')
    button_sbZipE.type = "button"
    button_sbZipE.className = 'btn btn-outline-primary mr-1 mb-2 ml-1 copyBtn'
    button_sbZipE.value = 'СБ Зип'
    button_sbZipE.setAttribute("onclick", "location.href='/projects/" + elem._id + "/zipPCEDocx'")
    button_sbZipE.dataset.id = elem._id
    divCont.appendChild(button_sbZipE)

    let button_ZIP = document.createElement('input')
    button_ZIP.type = "button"
    button_ZIP.className = 'btn btn-outline-primary mr-1 mb-2 ml-1 copyBtn'
    button_ZIP.value = 'Зип этикетка'
    button_ZIP.setAttribute("onclick", "location.href='/projects/" + elem._id + "/zipDocx'")
    button_ZIP.dataset.id = elem._id
    divCont.appendChild(button_ZIP)
  }
}

function insCell(parrent, html = '', classN) {
  let cell = parrent.insertCell(-1)
  if (classN) cell.className = classN
  cell.innerHTML = html
}