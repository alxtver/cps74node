function loadSN() {
  document.querySelector('body').style.background = '#3d3d3d'
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
  for (const i of data) {
    let label = ''
    if (i.attachment) {
      let sp = i.attachment.split(' ')
      label = (sp.length > 1) ? sp[0].slice(0, 3) + '. ' + sp[sp.length - 1] : sp[0] + '. '
    }
    const div = document.createElement('div')
    div.className = 'divGrid'
    const sn = i.serial_number.split('-')
    label += ' №'
    label += (sn.length > 1) ? sn[sn.length - 1] : sn[0]
    div.innerHTML = label
    div.id = i._id
    div.dataset.bsTarget = '#modalPC'
    div.dataset.bsToggle = 'modal'
    div.addEventListener("click", function (event) {
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
      CreateTableFromJSON(data, function () {})
      if (!isFirst) {
        modalWindow.classList.add('pcCardAssemblyUpdate')
      }
    })
}

function CreateTableFromJSON(data, callback) {
  // CREATE DYNAMIC TABLE.
  let divContainer = document.getElementById("PC")
  divContainer.innerHTML = ""
  table = tablePC(data, 'all', false,
    'fdsi',
    'type',
    'name',
    'quantity',
    'serial_number',
    'notes'
  )
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