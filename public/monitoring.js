function loadSN() {
  document.getElementById('overlay').style.display = 'block'
  postData('/assembly/pc')
    .then((data) => {
      createGrid(data)
      document.getElementById('overlay').style.display = 'none'
      paintingAllItem(data)
    })
}

function createGrid(data) {
  const container = document.getElementById("grid")
  const len = data.length
  // if (len > 200) {
  //   container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))'
  // } else if (len > 100) {
  //   container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'
  // } else if (len > 50) {
  //   container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))'
  // } else if (len > 10) {
  //   container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(400px, 1fr))'
  // } else {
  //   container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(500px, 1fr))'
  // }
  // container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(130px, 1fr))'
  for (const i of data) {
    const div = document.createElement('div')
    div.className = 'divGrid'
    div.innerHTML = i.serial_number
    div.id = i._id
    div.addEventListener("click", function (event) {
      div.dataset.target = '#modalPC'
      div.dataset.toggle = 'modal'
      const id = event.target.id
      loadModalPage(id)
    }, true)
    container.appendChild(div)
  }
}

function loadModalPage(id, isFirst = true) {
  const modalWindow = document.getElementById('modalWindow')
  modalWindow.classList.remove('pcCardAssemblyUpdate')
  const data = {
    id: id
  }
  postData('/assembly/getPCById', data)
    .then((data) => {
      CreateTableFromJSON(data, function () {
      })
      if (!isFirst) {
        modalWindow.classList.add('pcCardAssemblyUpdate')
      }
    })
}

function CreateTableFromJSON(data, callback) {
  // CREATE DYNAMIC TABLE.
  let divContainer = document.getElementById("PC")
  let modalWindow = document.getElementById('modalWindow')
  divContainer.innerHTML = ""
  table = TablePc(data)
  let divCont = document.createElement("div")
  divCont.id = data._id
  divCont.className = "pcCard mb-0"
  divContainer.appendChild(divCont);
  divCont.innerHTML = ""
  divCont.appendChild(table)
  callback()
}

function insCell(unit, parrent, html = '', classN, id, contentEditable, dataset) {
  let cell = parrent.insertCell(-1)
  if (classN) cell.className = classN
  if (id) cell.id = id
  if (contentEditable) cell.contentEditable = contentEditable
  cell.innerHTML = html
  if (id == 'serial_number') {
    if (unit == 'Системный блок' || unit == 'Сетевой фильтр' || unit == 'Гарнитура' || unit == 'Корпус') {
      cell.className = "serial_number number_mashine"
    } else if (unit == 'Вентилятор процессора') {
      cell.innerHTML = 'б/н'
    } else {
      cell.className = "serial_number"
    }
  }
  if (id == 'notes' && unit == 'Системный блок') {
    cell.innerHTML = 'с кабелем питания'
  }
  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      cell.dataset[key] = value
    }
  }
}

function TablePc(pc) {
  // таблица ПЭВМ
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-responsive pctable"
  table.id = pc._id

  let tr = table.insertRow(-1)

  insCell('', tr, 'ФДШИ.' + pc.fdsi, 'up', '', false)
  td = document.createElement("td")
  td.innerHTML = pc.serial_number
  td.id = pc.serial_number
  td.style.cssText = 'font-size: 1.5rem;background-color:' + pc.back_color
  tr.appendChild(td)
  insCell('', tr, pc.arm, 'up', '', false)
  insCell('', tr, pc.execution, 'up', '', false)
  insCell('', tr, '', 'up', '', false)
  td = document.createElement("td")
  if (pc.attachment) {
    td.innerHTML = pc.attachment
    td.style.cssText = 'font-size: 1.1rem;border-radius: 0px 10px 0px 0px;background-color:' + pc.back_color
  }
  tr.appendChild(td)
  if (pc.pc_unit.length > 0) {
    tr = table.insertRow(-1) // TABLE ROW.
    insCell('', tr, 'Обозначение изделия', 'header', '', false)
    insCell('', tr, 'Наименование изделия', 'header', '', false)
    insCell('', tr, 'Характеристика', 'header', '', false)
    insCell('', tr, 'Количество', 'header', '', false)
    insCell('', tr, 'Заводской номер', 'header', '', false)
    insCell('', tr, 'Примечания', 'header', '', false)
  }
  let arr_pc_unit = pc.pc_unit
  for (let j = 0; j < arr_pc_unit.length; j++) {
    tr = table.insertRow(-1)
    insCell('', tr, arr_pc_unit[j].fdsi, '', '', false, {
      'id': pc._id
    })
    insCell('', tr, arr_pc_unit[j].type, 'type', '', false, {
      'id': pc._id
    })
    insCell('', tr, arr_pc_unit[j].name, 'name', '', false, {
      'id': pc._id
    })
    insCell('', tr, arr_pc_unit[j].quantity, '', '', false, {
      'id': pc._id
    })
    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arr_pc_unit[j].serial_number
    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'pc_unit'
    if (arr_pc_unit[j].apkzi) {
      serial_numberCell.dataset.apkzi = "apkzi"
      serial_numberCell.contentEditable = "false"
    }
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'pc_unit'
    serial_numberCell.className = 'serial_number'
    serial_numberCell.addEventListener('keypress', function (e) {
      if (e.key == 'Enter') {
        e.preventDefault()
        const id = e.target.dataset.id
        const obj = e.target.dataset.obj
        const unit = e.target.dataset.unit
        const serial_number = e.target.innerText
        const data_hidd = e.target.dataset.data
        const data_apkzi = e.target.dataset.apkzi
        document.getElementById('hidd_id').value = data_hidd
        if (data_apkzi) {
          edit_serial_number_apkzi(id, obj, unit, serial_number)
        } else {
          edit_serial_number(id, obj, unit, serial_number)
        }
      }
    })
    insCell('', tr, arr_pc_unit[j].notes, '', '', false, {
      'id': pc._id
    })
  }

  if (pc.system_case_unit.length > 0) {
    tr = table.insertRow(-1) // TABLE ROW.
    insCell('', tr, 'Обозначение изделия', 'header', '', false)
    insCell('', tr, 'Наименование изделия', 'header', '', false)
    insCell('', tr, 'Характеристика', 'header', '', false)
    insCell('', tr, 'Количество', 'header', '', false)
    insCell('', tr, 'Заводской номер', 'header', '', false)
    insCell('', tr, 'Примечания', 'header', '', false)
  }
  let arr_system_case_unit = pc.system_case_unit
  for (let j = 0; j < arr_system_case_unit.length; j++) {
    tr = table.insertRow(-1)
    insCell('', tr, arr_system_case_unit[j].fdsi, '', '', false, {
      'id': pc._id
    })
    insCell('', tr, arr_system_case_unit[j].type, 'type', '', false, {
      'id': pc._id
    })
    insCell('', tr, arr_system_case_unit[j].name, 'name', '', false, {
      'id': pc._id
    })
    insCell('', tr, arr_system_case_unit[j].quantity, '', '', false, {
      'id': pc._id
    })
    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arr_system_case_unit[j].serial_number
    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'system_case_unit'
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'system_case_unit'
    if (arr_system_case_unit[j].szi) {
      serial_numberCell.dataset.apkzi = 'szi'
    }
    serial_numberCell.className = 'serial_number'
    serial_numberCell.addEventListener('keypress', function (e) {
      if (e.key == 'Enter') {
        e.preventDefault()
        const id = e.target.dataset.id
        const obj = e.target.dataset.obj
        const unit = e.target.dataset.unit
        const serial_number = e.target.innerText
        const data_hidd = e.target.dataset.data
        const data_apkzi = e.target.dataset.apkzi
        document.getElementById('hidd_id').value = data_hidd
        if (data_apkzi) {
          edit_serial_number_apkzi(id, obj, unit, serial_number)
        } else {
          edit_serial_number(id, obj, unit, serial_number)
        }
      }
    })
    insCell('', tr, arr_system_case_unit[j].notes, '', '', false, {
      'id': pc._id
    })
  }
  return table
}

function paintingAllItem(data) {
  for (const pc of data) {
    paintingOneItem(pc)
  }
}

function paintingOneItem(pc) {
  const item = document.getElementById(pc._id)
  item.className = 'divGrid'
  let isAllPCUnit = true
  let isAllSystemCaseUnit = true
  for (const unit of pc.pc_unit) {
    if (pc.pc_unit.length > 0) {
      if (unit.name == '' && unit.type != 'Системный блок' || unit.name == 'Н/Д' || unit.serial_number == '') {
        isAllPCUnit = false
        break
      }
    }
    if (pc.system_case_unit.length > 0) {
      for (const unit of pc.system_case_unit) {
        if (unit.type == '' || unit.name == '' || unit.name == 'Н/Д' || unit.serial_number == '') {
          isAllSystemCaseUnit = false
          break
        }
      }
    }
  }
  if (isAllPCUnit && isAllSystemCaseUnit) {
    item.classList.add('divGridAllOk')
  } else if (isAllSystemCaseUnit) {
    item.classList.add('divGridSystemOk')
  } else {
    item.classList.add('divGridNotOk')
  }
}

function modalWebsocketUpdate(id) {
  loadModalPage(id, false)
}

function websocketUpdate(id, userName) {
  const user = document.getElementById('userName').value
  const item = document.getElementById(id)
  item.classList.remove('monitoringPCUpdate')
  if (userName != user) {
    const data = {
      id: id
    }
    postData('/assembly/getPCById', data)
      .then((data) => {
        paintingOneItem(data)
        item.classList.add('monitoringPCUpdate')
      })
  }
}