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

  if (e.ctrlKey && e.key === 'ArrowRight') {
    e.preventDefault()
    getNextPC()
  } else if (e.ctrlKey && e.key === 'ArrowLeft') {
    e.preventDefault()
    getPreviousPC()
  }
}

function loadPage() {
  getData('/assembly/serialNumbers')
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
  getData('/assembly/currentSystemCase')
    .then((data) => {
      const select = document.getElementById('serials')
      select.value = data.currentSystemCase.serialNumber
      document.getElementById('PreviousPC').style.display = 'none'
      CreateTableFromJSON(data.currentSystemCase, function () {
        painting()
        document.getElementById('overlay').style.display = 'none'
        document.querySelectorAll('[data-obj="1"]')[0].focus()
      })
      if (data.currentSystemCase.serialNumber === data.firstSN) {
        document.getElementById('PreviousPC').style.display = 'none'
        document.getElementById('NextPC').style.display = 'inline'
      } else if (data.currentSystemCase.serialNumber === data.lastSN) {
        document.getElementById('PreviousPC').style.display = 'inline'
        document.getElementById('NextPC').style.display = 'none'
      } else {
        document.getElementById('PreviousPC').style.display = 'inline'
        document.getElementById('NextPC').style.display = 'inline'
      }
    })
}

function getPC(serialNumberSystemCase, metod) {
  getData(`/assembly/getSystemCase/${serialNumberSystemCase}`)
    .then((data) => {
      CreateTableFromJSON(data, function () {
        painting()
        document.getElementById('overlay').style.display = 'none'
        document.querySelectorAll('[data-obj="1"]')[0].focus()
        const card = document.querySelector('.pcCard')
        const audio = {};
        audio["slide"] = new Audio();
        audio["slide"].src = "/sounds/wave.mp3"
        audio["slide"].play()
        if (metod === 'next') {
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
  createSystemCaseTable(data, divContainer, true)
  callback()
}

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

function refreshOneTable(systemCase) {
  const container = document.getElementById(systemCase._id)
  container.innerHTML = ""
  createSystemCaseTable(systemCase, container, true)
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
      flashAlert(data, data.pc.serial_number)
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
        textToSpeech('Все серийники введены!', 1)
      }
    })
}

function allOK() {
  const nameCells = document.querySelectorAll('td.name')
  const snCells = document.querySelectorAll('td.serial_number')
  const nameIsOk = ([...nameCells]).reduce((prev, value) => {
    if (value.innerHTML === 'Н/Д') {
      value.style.backgroundColor = 'coral'
      prev = false
    }
    return prev
  }, true)
  const snIsOk = ([...snCells]).reduce((prev, value) => {
    if (value.innerHTML === '') {
      value.style.backgroundColor = 'darkgray'
      prev = false
    }
    return prev
  }, true)
  return (nameIsOk && snIsOk)
}

function insCell(unit, parrent, html = '', classN, id, contentEditable, dataset) {
  let cell = parrent.insertCell(-1)
  if (classN) cell.className = classN
  if (id) cell.id = id
  if (contentEditable) cell.contentEditable = contentEditable
  cell.innerHTML = html
  if (id === 'serial_number') {
    if (unit === 'Системный блок' || unit === 'Сетевой фильтр' || unit === 'Гарнитура' || unit === 'Корпус') {
      cell.className = "serial_number number_mashine"
    } else if (unit === 'Вентилятор процессора') {
      cell.innerHTML = 'б/н'
    } else {
      cell.className = "serial_number"
    }
  }
  if (id === 'notes' && unit === 'Системный блок') {
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
    if (select[i].value === serialNumber) {
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
    if (select[i].value === serialNumber) {
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
  if (lastPCSerialNumber !== serialNumber) {
    getPC(serialNumberPlusOne, 'next')
    select.value = serialNumberPlusOne
  }
  if (serialNumberPlusOne === lastPCSerialNumber) {
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
  if (firstPCSerialNumber !== serialNumber) {
    getPC(serialNumberMinusOne, 'previous')
    select.value = serialNumberMinusOne
  }
  if (serialNumberMinusOne === firstPCSerialNumber) {
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
