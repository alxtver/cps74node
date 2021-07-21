document.addEventListener("DOMContentLoaded", function () {
  const id = location.pathname.split('/')[2]
  loadSystemCase(id)
  localStorage.number_machine = document.getElementById('serial_number')
  eventOnSerials()
  document.addEventListener('keyup', (e) => {
    eventOnSerials()
  })

  document.onkeydown = function (e) {
    e = e || window.event;
    if (e.ctrlKey && (e.which === 83)) {
      e.preventDefault()
      document.getElementById('edit').click()
    }
  }
})
document.addEventListener('click', function (e) {
  setColor()
})

/**
 * При изменении зав. номера системного блока меняются серийники которые равны зав. номеру
 */
function eventOnSerials() {
  const snInput = document.getElementById('serial_number')
  snInput.addEventListener('keyup', (e) => {
    const oldSn = e.target.defaultValue
    const newSN = e.target.value
    const numbers = document.querySelectorAll('.serial_number')
    for (const number of numbers) {
      if (number.innerHTML === oldSn) {
        number.innerHTML = newSN
      }
    }
    e.target.defaultValue = newSN
  })
}

/**
 * Получить системный блок
 * @param id
 */
function loadSystemCase(id) {
  getData(`/systemCases/getSystemCase/${id}`)
    .then((data) => {
      const systemCase = data.systemCase
      systemCaseTable(systemCase)
    })
}

/**
 * Создать таблицу редактирования системного блока
 * @param systemCase
 */
function systemCaseTable(systemCase) {
  const container = document.getElementById('systemCase')
  container.innerHTML = ''
  const table = tableEditSystemCase(systemCase)
  container.appendChild(table);

  const buttonAddRow = document.createElement('input')
  buttonAddRow.type = 'button'
  buttonAddRow.id = 'add-row'
  buttonAddRow.className = 'btn btn-outline-primary ms-2 me-2 mb-2'
  buttonAddRow.onclick = () => addRow()
  buttonAddRow.value = 'Добавить строку'
  container.appendChild(buttonAddRow)

  const buttonAddSziRow = document.createElement('input')
  buttonAddSziRow.type = 'button'
  buttonAddSziRow.id = 'add-szi-row'
  buttonAddSziRow.className = 'btn btn-outline-success ms-2 me-2 mb-2'
  buttonAddSziRow.onclick = () => addSZI()
  buttonAddSziRow.value = 'Добавить СЗИ'
  container.appendChild(buttonAddSziRow)

  const buttonDelRow = document.createElement('input')
  buttonDelRow.type = 'button'
  buttonDelRow.id = 'delete-row'
  buttonDelRow.className = 'btn btn-outline-danger ms-2 me-2 mb-2'
  buttonDelRow.onclick = () => delRow()
  buttonDelRow.value = 'Удалить строку'
  container.appendChild(buttonDelRow)

  container.appendChild(document.createElement('br'))

  // Цветовая палитра
  const colorInput = document.createElement('input')
  colorInput.className = 'mt-2 color-input'
  colorInput.id = 'color-input'
  colorInput.value = systemCase.back_color
  colorInput.oninput = function () {
    setColor()
  }
  container.appendChild(colorInput)

  const hueb = new Huebee('.color-input', {
    notation: 'hex',
    saturations: 2,
    shades: 7,
    customColors: ['#618bd6', '#61d663', '#d6616b', '#d6d561', '#d661ba']
  })
  setColor()

  const editButton = document.createElement('input')
  editButton.type = 'button'
  editButton.className = 'btn btn-outline-success mt-2 save_button'
  editButton.value = 'Сохранить изменения'
  editButton.id = "edit"
  editButton.onclick = () => onEditSystemCase(systemCase._id)
  editButton.dataset.id = systemCase._id
  container.appendChild(editButton)

  const backButton = document.createElement('input')
  backButton.type = 'button'
  backButton.className = 'btn btn-outline-primary mb-2 mt-2 save_button'
  backButton.value = 'Назад'
  backButton.setAttribute("onclick", "location.href='/systemCases?part=" + systemCase.part + "&serial_number=" + systemCase.serialNumber + "'")
  container.appendChild(backButton)
}

/**
 * Установить цвет системного блока
 */
function setColor() {
  let colorInput = document.getElementById('color-input').value
  let content = document.querySelector('.tableContent')
  content.style.boxShadow = '0px 30px 60px ' + colorInput
}

function tableEditSystemCase(systemCase) {
  // таблица ПЭВМ
  let table = document.createElement("table")
  table.className = "table table-sm table-bordered table-hover"
  table.id = "systemCase"

  defaultHeader(table)

  const tbody = table.createTBody();
  const units = systemCase.systemCaseUnits
  for (const unit of units) {
    const row = tbody.insertRow()
    if (unit.szi) {
      row.className = 'apkzi'
    }
    insCell('', row, "<input type='checkbox' name='record'>", 'record', 'record')
    insCell('', row, unit.fdsi, 'fdsi', '', true, {
      'id': systemCase._id
    })
    insCell('', row, unit.type, 'type', '', true, {
      'id': systemCase._id
    })
    insCell('', row, unit.name, 'name', '', true, {
      'id': systemCase._id
    })
    insCell('', row, unit.quantity, 'quantity', '', true, {
      'id': systemCase._id
    })
    const serialNumberCell = row.insertCell()
    serialNumberCell.innerHTML = unit.serial_number
    serialNumberCell.dataset.id = systemCase._id
    serialNumberCell.dataset.obj = systemCase.i
    serialNumberCell.dataset.unit = 'system_case_unit'
    serialNumberCell.dataset.data = systemCase._id + ';' + systemCase.i + ';' + 'system_case_unit'
    if (unit.szi) {
      serialNumberCell.dataset.apkzi = 'szi'
    }
    serialNumberCell.className = 'serial_number'
    serialNumberCell.contentEditable = "true"
    insCell('', row, unit.notes, 'notes', '', true, {
      'id': systemCase._id
    })
  }
  return table
}

/**
 * Редактирование системного блока
 * @param id
 * @returns {boolean}
 */
function onEditSystemCase(id) {
  const tableRows = document.querySelectorAll("#systemCase tbody tr");
  const partInput = document.getElementById('part')
  const fdsiInput = document.getElementById('fdsi')
  const snInput = document.getElementById('serial_number')
  const executionInput = document.getElementById('execution')
  const attachmentInput = document.getElementById('attachment')
  const colorInput = document.getElementById('color-input')

  if (!partInput.value) {
    validate(partInput)
    return false
  }

  if (!snInput.value) {
    validate(snInput)
    return false
  }

  const data = {
    part: partInput.value,
    fdsi: fdsiInput.value,
    serialNumber: snInput.value,
    execution: executionInput.value,
    attachment: attachmentInput.value,
    back_color: colorInput.value,
    systemCaseUnits: arrayFromTable(tableRows)
  }
  putData('/systemCases/update', {id, data})
    .then((res) => {
      if (res.message === 'ok') {
        window.location = "/systemCases?part=" + data.part + "&serial_number=" + data.serialNumber + "'"
      }
    })
}

function validate(input) {
  input.style.borderColor = "#f57e7e";
  input.style.backgroundColor = "#f1f1ae";
  input.style.borderWidth = 2;
}
