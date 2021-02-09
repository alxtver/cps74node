document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.sound) {
    document.getElementById("soundOff").hidden = true
    document.getElementById("soundOn").hidden = false
    setSoundSessionOn()
  } else if (localStorage.sound === 'on') {
    document.getElementById("soundOff").hidden = true
    document.getElementById("soundOn").hidden = false
  } else {
    document.getElementById("soundOff").hidden = false
    document.getElementById("soundOn").hidden = true
  }

  const snSelect = document.getElementById('serials')
  snSelect.addEventListener('change', (e) => {
    document.getElementById('apkziDiv').style.display = 'none'
    getPC(e.target.value)
  })
})

document.onkeydown = function (e) {

  if (e.ctrlKey && e.key == 'ArrowRight') {
    e.preventDefault()
    getNextPC()
  } else if (e.ctrlKey && e.key == 'ArrowLeft') {
    e.preventDefault()
    getPreviousPC()
  }
}

function loadPage() {
  postData('/assembly/serialNumbers')
    .then((data) => {
      let select = document.getElementById("serials")
      select.innerHTML = ''
      for (const d of data) {
        let option = document.createElement("option")
        option.value = d
        option.text = d
        select.add(option)
      }
      document.getElementById('overlay').style.display = 'none'
    })
  postData('/assembly/firstPC')
    .then((data) => {
      const select = document.getElementById('serials')
      select.value = data.firstPC.serial_number
      document.getElementById('PreviousPC').style.display = 'none'
      CreateTableFromJSON(data.firstPC, function () {
        painting()
        document.getElementById('overlay').style.display = 'none'
        document.querySelectorAll('[data-obj="1"]')[0].focus()
      })
      if (data.firstPC.serial_number === data.firstSN) {
        document.getElementById('PreviousPC').style.display = 'none'
        document.getElementById('NextPC').style.display = 'inline'
      } else if (data.firstPC.serial_number == data.lastSN) {
        document.getElementById('PreviousPC').style.display = 'inline'
        document.getElementById('NextPC').style.display = 'none'
      } else {
        document.getElementById('PreviousPC').style.display = 'inline'
        document.getElementById('NextPC').style.display = 'inline'
      }
    })
}

function getPC(serialNumberPC, metod) {
  const data = {
    serialNumberPC: serialNumberPC
  }
  postData('/assembly/getPC', data)
    .then((data) => {
      CreateTableFromJSON(data, function () {
        painting()
        document.getElementById('overlay').style.display = 'none'
        document.querySelectorAll('[data-obj="1"]')[0].focus()
        const card = document.querySelector('.pcCardAssembly')
        const audio = {};
        audio["slide"] = new Audio();
        audio["slide"].src = "/sounds/wave.mp3"
        audio["slide"].play()
        if (metod == 'next') {
          card.classList.add('pcCardAssemblyNext')
        } else {
          card.classList.add('pcCardAssemblyPrevious')
        }
      })
    })
}

function CreateTableFromJSON(data, callback) {
  let divContainer = document.getElementById("PC")
  divContainer.innerHTML = ""

  // table = TablePc(data)
  table = tablePC(data, 'systemCase', true,
    'type',
    'name',
    'quantity',
    'serial_number'
  )

  let divCont = document.createElement("div")
  divCont.id = data._id
  divCont.className = "pcCardAssembly mb-3"
  divCont.style.cssText = '-webkit-box-shadow: 0 2px 15px 0' + data.back_color + ';box-shadow: 0 2px 15px 0' + data.back_color
  divContainer.appendChild(divCont);
  divCont.innerHTML = ""
  divCont.appendChild(table)
  callback()
}

// function TablePc(pc) {
//   const apkziDiv = document.getElementById('apkziDiv')
//   apkziDiv.innerHTML = ''
//   // таблица ПЭВМ
//   let table = document.createElement("table");
//   table.className = "table table-bordered table-hover table-responsive assemblytable"
//   table.id = pc._id

//   let tr = table.insertRow(-1)

//   td = document.createElement("td")
//   td.innerHTML = pc.serial_number
//   td.id = 'serial_number'
//   td.style.cssText = 'font-size: 1.5rem;border-radius: 4px 0px 0px 0px;background-color:' + pc.back_color
//   tr.appendChild(td)
//   insCell('', tr, pc.arm, 'up', '', false)
//   insCell('', tr, pc.execution, 'up', '', false)

//   td = document.createElement("td")
//   if (pc.attachment) {
//     td.innerHTML = pc.attachment
//     td.style.cssText = 'font-size: 1.1rem;border-radius: 0px 4px 0px 0px;background-color:' + pc.back_color
//   }
//   tr.appendChild(td)
//   if (pc.system_case_unit.length > 0) {
//     tr = table.insertRow(-1) // TABLE ROW.
//     insCell('', tr, 'Наименование изделия', 'header', '', false)
//     insCell('', tr, 'Характеристика', 'header', '', false)
//     insCell('', tr, 'Количество', 'header', '', false)
//     insCell('', tr, 'Заводской номер', 'header', '', false)
//   }
//   let arr_pc_unit = pc.pc_unit
//   let arr_system_case_unit = pc.system_case_unit
//   for (let j = 0; j < arr_pc_unit.length; j++) {
//     if (arr_pc_unit[j].apkzi && arr_pc_unit[j].serial_number != '') {
//       const apkziDiv = document.getElementById('apkziDiv')
//       apkziDiv.innerHTML = 'Номер АПКЗИ - ' + arr_pc_unit[j].serial_number
//       apkziDiv.style.display = 'block'
//     }
//   }
//   for (let j = 0; j < arr_system_case_unit.length; j++) {
//     tr = table.insertRow(-1)
//     insCell('', tr, arr_system_case_unit[j].type, 'type', '', false, {
//       'id': pc._id
//     })
//     insCell('', tr, arr_system_case_unit[j].name, 'name', '', false, {
//       'id': pc._id
//     })
//     insCell('', tr, arr_system_case_unit[j].quantity, '', '', false, {
//       'id': pc._id
//     })
//     let serial_numberCell = tr.insertCell(-1)
//     serial_numberCell.innerHTML = arr_system_case_unit[j].serial_number
//     serial_numberCell.dataset.id = pc._id
//     serial_numberCell.dataset.obj = j
//     serial_numberCell.dataset.unit = 'system_case_unit'
//     serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'system_case_unit'
//     if (arr_system_case_unit[j].szi) {
//       serial_numberCell.dataset.apkzi = 'szi'
//     }
//     serial_numberCell.className = 'serial_number'
//     serial_numberCell.contentEditable = "true"
//     serial_numberCell.addEventListener('keypress', function (e) {
//       if (e.key == 'Enter') {
//         e.preventDefault()
//         const id = e.target.dataset.id
//         const obj = e.target.dataset.obj
//         const unit = e.target.dataset.unit
//         const serial_number = e.target.innerText
//         const data_hidd = e.target.dataset.data
//         const data_apkzi = e.target.dataset.apkzi
//         document.getElementById('hidd_id').value = data_hidd
//         if (data_apkzi) {
//           edit_serial_number_apkzi(id, obj, unit, serial_number)
//         } else {
//           edit_serial_number(id, obj, unit, serial_number)
//         }
//       }
//     })
//   }
//   return table
// }

function painting() {
  const status = document.getElementById('status')
  const statusName = document.getElementById('statusName')
  const count = document.getElementById('count')
  const serialsSelect = document.getElementById('serials')
  const selectedSerialIndex = serialsSelect.selectedIndex + 1
  count.innerHTML = selectedSerialIndex + ' / ' + serialsSelect.options.length
  if (allOK()) {
    status.style.background = '#4CAF50'
    count.style.color = '#4CAF50'
    statusName.innerHTML = "OK!"
  } else {
    status.style.background = '#f44336'
    count.style.color = '#f44336'
    statusName.innerHTML = "not OK!"
  }
}

function edit_serial_number(id, obj, unit, serialNumber) {
  serialNumber = translate(serialNumber).ruToEnSN
  const data = {
    id: id,
    obj: obj,
    unit: unit,
    serial_number: serialNumber
  }
  postData('/pcPa/insert_serial', data).then((data) => {
    flashAlert(data)
    UpdateCells(data.pc)
    const pc = document.getElementById('serial_number')
    const serialNumber = pc.innerHTML
    const user = document.getElementById('userName').value
    socket.emit('updateAssemblyPC', {
      serialNumber,
      user,
      id
    })
    if (allOK()) {
      textToSpeech('Все серийники введены!', 2)
    }
  })
}

function edit_serial_number_apkzi(id, obj, unit, serialNumber) {
  const data = {
    id: id,
    obj: obj,
    unit: unit,
    serial_number: serialNumber
  }
  postData('/pcPa/insert_serial_apkzi', data)
    .then((data) => {
      flashAlert(data)
      UpdateCells(data.pc)
      const pc = document.getElementById('serial_number')
      const serialNumber = pc.innerHTML
      const user = document.getElementById('userName').value
      socket.emit('updateAssemblyPC', {
        serialNumber,
        user,
        id
      })
      textToSpeech(document.getElementById('apkziDiv').innerHTML, 2)
      if (allOK()) {
        textToSpeech('Все серийники введены!', 2)
      }
    })
}

function allOK() {
  const nameCells = document.querySelectorAll('td.name')
  const snCells = document.querySelectorAll('td.serial_number')
  const nameIsOk = ([...nameCells]).reduce((prev, value) => {
    if (value.innerHTML == 'Н/Д') {
      value.style.backgroundColor = 'coral'
      prev = false
    }
    return prev
  }, true)
  const snIsOk = ([...snCells]).reduce((prev, value) => {
    if (value.innerHTML == '') {
      value.style.backgroundColor = 'darkgray'
      prev = false
    }
    return prev
  }, true)
  return (nameIsOk && snIsOk)
}

function flashAlert(data) {
  let oldNumberMachine = data.oldNumberMachine
  const pcSN = data.pc.serial_number
  if (oldNumberMachine) {
    if (oldNumberMachine != pcSN) {
      document.querySelector('.popup-checkbox').checked = true
      const msg_txt = 'Серийник был привязан к машине с номером ' + oldNumberMachine
      document.getElementById('oldNumber').innerHTML = msg_txt
      const audio = {};
      audio["alert"] = new Audio();
      audio["alert"].src = "/sounds/alert.mp3"
      audio["alert"].play()
    } else {
      oldNumberMachine = null
    }
  }
}

function UpdateCells(pc) {
  let divContainer = document.getElementById(pc._id)
  divContainer.innerHTML = ""
  table = tablePC(pc, 'systemCase', true,
    'type',
    'name',
    'quantity',
    'serial_number'
  )
  let divCont = document.createElement("div")
  divCont.id = pc._id
  divCont.className = "tableContent"
  divContainer.appendChild(divCont)
  divCont.innerHTML = ""
  divCont.appendChild(table)

  //переход на одну ячейку вниз
  let current_id = document.getElementById('hidd_id').value
  let next_id = current_id.split(";")
  next_id[1] = Number(next_id[1]) + 1 + ''
  if (!document.querySelector('.popup-checkbox').checked) {
    let nextCell = document.querySelector(".serial_number[data-data='" + next_id.join(';') + "']")
    let nextCellText
    if (nextCell) {
      nextCellText = nextCell.innerHTML
      while (/[Бб].?[Нн]/g.test(nextCellText) || nextCellText == pc.serial_number) {
        next_id[1] = Number(next_id[1]) + 1 + ''
        nextCell = document.querySelector(".serial_number[data-data='" + next_id.join(';') + "']")
        if (!nextCell) {
          break
        }
        nextCellText = nextCell.innerHTML
      }
      if (nextCell) {
        nextCell.focus()
      }
      //TextToSpeech
      let rows = document.querySelector(".serial_number[data-data='" + next_id.join(';') + "']").parentElement
      let row = rows.children
      if (row) {
        textToSpeech(row[0].innerText, 5)
      }
    }
    painting()
  }
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

function nextPC(serialNumber) {
  const select = document.getElementById('serials')
  let nextPCIndex
  for (let i = 0; i < select.length; i++) {
    if (select[i].value == serialNumber) {
      nextPCIndex = ++i
      break
    }
  }
  return (nextPCIndex >= select.length) ? null : select[nextPCIndex].value
}

function previousPC(serialNumber) {
  const select = document.getElementById('serials')
  let NextPCIndex
  for (let i = 0; i < select.length; i++) {
    if (select[i].value == serialNumber) {
      NextPCIndex = --i
      break
    }
  }
  return (NextPCIndex < 0) ? null : select[NextPCIndex].value
}

function getNextPC() {
  document.body.style.overflow = 'hidden';
  const serialNumber = document.getElementById('serial_number').innerHTML
  const serialNumberPlusOne = nextPC(serialNumber)
  const select = document.getElementById('serials')
  const lastPCSerialNumber = select.options[select.options.length - 1].value
  const nextButton = document.getElementById('NextPC')
  nextButton.classList.add("buttonsActive")
  setTimeout(() => {
    nextButton.classList.remove("buttonsActive")
  }, 300);
  if (lastPCSerialNumber != serialNumber) {
    getPC(serialNumberPlusOne, 'next')
    select.value = serialNumberPlusOne
  }
  if (serialNumberPlusOne == lastPCSerialNumber) {
    nextButton.style.display = 'none'
  }
  document.getElementById('PreviousPC').style.display = 'inline'
}

function getPreviousPC() {
  document.body.style.overflow = 'hidden';
  const serialNumber = document.getElementById('serial_number').innerHTML
  const serialNumberMinusOne = previousPC(serialNumber)
  const select = document.getElementById('serials')
  const firstPCSerialNumber = select.options[0].value
  const previousButton = document.getElementById('PreviousPC')
  previousButton.classList.add("buttonsActive")
  setTimeout(() => {
    previousButton.classList.remove("buttonsActive")
  }, 300);
  if (firstPCSerialNumber != serialNumber) {
    getPC(serialNumberMinusOne, 'previous')
    select.value = serialNumberMinusOne
  }
  if (serialNumberMinusOne == firstPCSerialNumber) {
    document.getElementById('PreviousPC').style.display = 'none'
  }
  document.getElementById('NextPC').style.display = 'inline'
}

function websocketUpdate(sn, reqUser) {
  const pc = document.getElementById('serial_number')
  const user = document.getElementById('userName').value
  const serialNumber = pc.innerHTML
  if (serialNumber == sn && reqUser != user) {
    updatePC(serialNumber, 'update')
  }
}

function updatePC(serialNumberPC, metod) {
  const data = {
    serialNumberPC: serialNumberPC
  }
  postData('/assembly/getPC', data)
    .then((data) => {
      CreateTableFromJSON(data, function () {
        painting()
        document.getElementById('overlay').style.display = 'none'
        document.querySelectorAll('[data-obj="1"]')[0].focus()
        const card = document.querySelector('.pcCardAssembly')
        card.classList.add('pcCardAssemblyUpdate')
      })
    })
}