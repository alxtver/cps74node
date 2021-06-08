function setColor() {
  let c = document.getElementById('color-input').value
  let content = document.querySelector('.tableContent')
  content.style.boxShadow = '0px 30px 60px ' + c
}

function CreateTablePC() {
  let col_rus = ["", "Обозначение изделия", "Наименование изделия", "Характеристика", "Количество", "Заводской номер", "Примечания"]
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "pc_unit"
  // Заголовок таблицы
  let tr = table.insertRow(-1)
  let thead = table.createTHead()
  thead.className = "table-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }
  const divContainer = document.getElementById("pc_unit_table")
  divContainer.innerHTML = ""
  divContainer.appendChild(table)

  let tableRef = document.getElementById('pc_unit').getElementsByTagName('tbody')[0]
  const complectPCUnit = [
    'Системный блок',
    'Клавиатура',
    'Мышь',
    'Монитор',
    'Монитор',
    'Источник бесперебойного питания',
    'Сетевой фильтр',
    'Гарнитура'
  ]

  createTableBody(complectPCUnit, tableRef)

  tr = tableRef.insertRow(-1)
  tr.className = 'apkzi'
  insCell('', tr, "<input type='checkbox' name='record'>", 'record', 'record')
  insCell('', tr, '', 'fdsi', 'fdsi', true)
  insCell('', tr, 'АПКЗИ', 'type', 'type', true, {
    'apkzi': 'apkzi'
  })
  insCell('', tr, '', 'name', 'name', true)
  insCell('', tr, '1', 'quantity', 'quantity', true)
  insCell('', tr, '', 'serial_number', 'serial_number', true, {
    'apkzi': 'apkzi'
  })
  insCell('', tr, '', 'notes', 'notes', true)
}

function CreateTableSystemCase() {
  let col_rus = ["", "Обозначение изделия", "Наименование изделия", "Характеристика", "Количество", "Заводской номер", "Примечания"]
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "system_case_unit"

  // Заголовок таблицы
  let tr = table.insertRow(-1)
  let thead = table.createTHead()
  thead.className = "table-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }
  const divContainer = document.getElementById("system_case_unit_table")
  divContainer.innerHTML = ""
  divContainer.appendChild(table)
  let tableRef = document.getElementById('system_case_unit_table').getElementsByTagName('tbody')[0]
  const complectSystemCaseUnit = [
    'Корпус',
    'Процессор',
    'Вентилятор процессора',
    'Блок питания',
    'Оперативная память',
    'Оперативная память',
    'Системная плата',
    'Видеокарта',
    'Накопитель на жестком магнитном диске',
    'Корзина для НЖМД',
    'Оптический привод'
  ]
  createTableBody(complectSystemCaseUnit, tableRef)
  createSZIRow(tableRef)
}

function painting() {
  let nameCells = document.querySelectorAll('td.name')
  let snCells = document.querySelectorAll('td.serial_number')
  for (const cell of nameCells) {
    if (cell.innerHTML === 'Н/Д') {
      cell.style.backgroundColor = 'coral'
    }
  }
  for (const cell of snCells) {
    if (cell.innerHTML === '') {
      cell.style.backgroundColor = 'darkgray'
    }
  }
}

function loadPage(page, pages) {
  const overlay = document.getElementById('overlay')
  overlay.style.display = 'block'
  const data = {
    page: page,
    pages: pages
  }
  postData('/pcPa/pagination', data)
    .then((data) => {
      CreateTableFromJSON(data, function () {
        painting()
        let overlay = document.getElementById('overlay')
        overlay.style.display = 'none'
      })

      let select = document.getElementById("serials")
      for (i = select.length - 1; i >= 0; i--) {
        select.remove(i)
      }
      for (const d of data) {
        let option = document.createElement("option")
        option.value = d.serial_number
        option.text = d.serial_number
        select.add(option)
      }

      let url = document.location.href
      let serial_number_id = url.match(/[\Z\d|-]{13,14}/i)
      if (serial_number_id) {
        if (document.getElementById(serial_number_id)) {
          const el = document.getElementById(serial_number_id[0])
          const offsetPosition = el.getBoundingClientRect().top - 70
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }
    })
}

function getPage() {
  getData('/pcPa/getPage')
    .then((page) => {
      createPagination(page)
    })
}

function setPage(page) {
  if (page) {
    let data = {
      page: page
    }
    postData('/pcPa/setPage', data)
  }
}

function load_pc(id) {
  let data = {
    id: id,
  }
  postData('/pcPa/pc_edit', data)
    .then((data) => {
      let color = data.back_color
      CreateTableEditPC(data, color)
      let colorInput = document.getElementById('color-input')
      colorInput.value = color
    })
}

function TableEditPcUnit(pc) {
  // таблица ПЭВМ
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "pc_unit"

  defaultHeader(table)

  let arr_pc_unit = pc.pc_unit
  for (let j = 0; j < arr_pc_unit.length; j++) {
    let tr = table.insertRow(-1)
    if (arr_pc_unit[j].apkzi) {
      tr.className = 'apkzi'
    }
    insCell('', tr, "<input type='checkbox' name='record'>", 'record', 'record')
    insCell('', tr, arr_pc_unit[j].fdsi, 'fdsi', '', true, {
      'id': pc._id
    })
    insCell('', tr, arr_pc_unit[j].type, 'type', '', true, {
      'id': pc._id
    })
    insCell('', tr, arr_pc_unit[j].name, 'name', '', true, {
      'id': pc._id
    })
    insCell('', tr, arr_pc_unit[j].quantity, 'quantity', '', true, {
      'id': pc._id
    })
    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arr_pc_unit[j].serial_number

    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'pc_unit'
    serial_numberCell.contentEditable = "true"
    if (arr_pc_unit[j].apkzi) {
      serial_numberCell.dataset.apkzi = "apkzi"
    }
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'pc_unit'
    serial_numberCell.className = 'serial_number'
    insCell('', tr, arr_pc_unit[j].notes, 'notes', '', true, {
      'id': pc._id
    })
  }
  return table
}

function TableEditSystemCase(pc) {
  // таблица ПЭВМ
  let table = document.createElement("table")
  table.className = "table table-sm table-bordered table-hover"
  table.id = "system_case_unit"

  defaultHeader(table)

  let arrSystemCaseUnit = pc.system_case_unit
  for (let j = 0; j < arrSystemCaseUnit.length; j++) {
    tr = table.insertRow(-1)
    if (arrSystemCaseUnit[j].szi) {
      tr.className = 'apkzi'
    }
    insCell('', tr, "<input type='checkbox' name='record'>", 'record', 'record')
    insCell('', tr, arrSystemCaseUnit[j].fdsi, 'fdsi', '', true, {
      'id': pc._id
    })
    insCell('', tr, arrSystemCaseUnit[j].type, 'type', '', true, {
      'id': pc._id
    })
    insCell('', tr, arrSystemCaseUnit[j].name, 'name', '', true, {
      'id': pc._id
    })
    insCell('', tr, arrSystemCaseUnit[j].quantity, 'quantity', '', true, {
      'id': pc._id
    })
    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arrSystemCaseUnit[j].serial_number

    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'system_case_unit'
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'system_case_unit'
    if (arrSystemCaseUnit[j].szi) {
      serial_numberCell.dataset.apkzi = 'szi'
    }
    serial_numberCell.className = 'serial_number'
    serial_numberCell.contentEditable = "true"
    insCell('', tr, arrSystemCaseUnit[j].notes, 'notes', '', true, {
      'id': pc._id
    })
  }
  return table
}

function CreateTableFromJSON(data, callback) {
  // CREATE DYNAMIC TABLE.
  let divContainer = document.getElementById("PC")
  divContainer.innerHTML = ""
  for (let i = 0; i < data.length; i++) {
    const table = tablePC(data[i], 'all', true,
      'fdsi',
      'type',
      'name',
      'quantity',
      'serial_number',
      'notes'
    )
    let divContainer = document.getElementById("PC");
    let divCont = document.createElement("div")
    divCont.id = data[i]._id
    divCont.className = "pcCard mb-3 table-responsive"
    divCont.style.cssText = '-webkit-box-shadow: 0 30px 60px 0' + data[i].back_color + ';box-shadow: 0 30px 60px 0' + data[i].back_color
    divContainer.appendChild(divCont);
    divCont.innerHTML = ""
    divCont.appendChild(table)

    buttons(divCont, data[i], `/pcPa/${data[i]._id}/edit?allow=true`)
  }
  callback()
}

function CreateTableEditPC(data, color) {
  // CREATE DYNAMIC TABLE.
  let divContainer = document.getElementById("PC")
  divContainer.innerHTML = ""

  tablePCUnit = TableEditPcUnit(data)
  tablePCSystemCase = TableEditSystemCase(data)

  divContainer = document.getElementById("PC");
  let divCont = document.createElement("div")
  divCont.id = "pc_unit_div"
  divContainer.appendChild(divCont);
  divCont.appendChild(tablePCUnit)

  divCont = document.createElement("div")
  divCont.id = "system_case_div"
  divContainer.appendChild(divCont);
  divCont.appendChild(tablePCSystemCase)

  let buttonAddRow = document.createElement('input')
  buttonAddRow.type = 'button'
  buttonAddRow.id = 'add-row'
  buttonAddRow.className = 'btn btn-outline-primary ms-2 me-2 mb-2'
  buttonAddRow.onclick = () => addRow()
  buttonAddRow.value = 'Добавить строку'
  divCont.appendChild(buttonAddRow)

  let buttonDelRow = document.createElement('input')
  buttonDelRow.type = 'button'
  buttonDelRow.id = 'delete-row'
  buttonDelRow.className = 'btn btn-outline-danger ms-2 me-2 mb-2'
  buttonDelRow.onclick = () => delRow()
  buttonDelRow.value = 'Удалить строку'
  divCont.appendChild(buttonDelRow)

  let br = document.createElement('br')
  divCont.appendChild(br)

  //huebee
  let colorInput = document.createElement('input')
  colorInput.className = 'mt-2 color-input'
  colorInput.id = 'color-input'
  colorInput.value = color
  colorInput.oninput = function () {
    setColor()
  }
  divCont.appendChild(colorInput)

  var hueb = new Huebee('.color-input', {
    notation: 'hex',
    saturations: 2,
    shades: 7,
    customColors: ['#618bd6', '#61d663', '#d6616b', '#d6d561', '#d661ba']
  })
  setColor()

  let button_edit = document.createElement('input')
  button_edit.type = 'button'
  button_edit.className = 'btn btn-outline-success mt-2 save_button'
  button_edit.value = 'Сохранить изменения'
  button_edit.id = "edit"
  button_edit.onclick = () => submitPC()
  button_edit.dataset.id = data._id
  divCont.appendChild(button_edit)

  let button_back = document.createElement('input')
  button_back.type = 'button'
  button_back.className = 'btn btn-outline-primary mb-2 mt-2 save_button'
  button_back.value = 'Назад'
  button_back.setAttribute("onclick", "location.href='/pcPa?part=" + data.part + "&serial_number=" + data.serial_number + "'")
  divCont.appendChild(button_back)
}

function flashAlert(data) {
  if (data.duplicatePki) {
    document.querySelector('.popup-checkbox').checked = true
    document.getElementById('oldNumber').innerHTML = 'Такой серийник уже есть!!!'
    const audio = {};
    audio["alert"] = new Audio();
    audio["alert"].src = "/sounds/alert.mp3"
    audio["alert"].play()
  } else {
    let oldNumberMachine = data.oldNumberMachine
    const pcSN = data.pc.serial_number
    if (oldNumberMachine) {
      if (oldNumberMachine !== pcSN) {
        document.querySelector('.popup-checkbox').checked = true
        document.getElementById('oldNumber').innerHTML = 'Серийник был привязан к машине с номером ' + oldNumberMachine
        const audio = {};
        audio["alert"] = new Audio();
        audio["alert"].src = "/sounds/alert.mp3"
        audio["alert"].play()
      } else {
        oldNumberMachine = null
      }
    }
  }
}

function edit_serial_number(id, obj, unit, serial_number) {
  let data = {
    id: id,
    obj: obj,
    unit: unit,
    serial_number: serial_number
  }
  postData('/pcPa/insert_serial', data)
    .then((data) => {
      flashAlert(data)
      if (!data.duplicatePki) {
        const serialNumber = data.pc.serial_number
        const oldNumberMachine = (data.oldNumberMachine !== serialNumber) ? data.oldNumberMachine : null
        UpdateCells(data.pc, oldNumberMachine)
        const user = document.getElementById('userName').value
        const id = data.pc._id
        socket.emit('updateAssemblyPC', {
          serialNumber,
          user,
          id
        })
      }
    })
}

function edit_serial_number_apkzi(id, obj, unit, serial_number) {
  let data = {
    id: id,
    obj: obj,
    unit: unit,
    serial_number: serial_number
  }
  postData('/pcPa/insert_serial_apkzi', data)
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



function updateOnePC(id, reqUser) {
  postData('/pcPa/getPC', {
      id
    })
    .then((data) => {
      const user = document.getElementById('userName').value
      if (user !== reqUser) {
        const card = document.getElementById(data.pc._id)
        card.classList.add('pcCardAssemblyUpdate')
        UpdateCells(data.pc, null, false)
        setTimeout(() => {
          card.classList.remove('pcCardAssemblyUpdate')
        }, 500);
      }
    })
}

function UpdateCells(pc, oldNumberMachine, voice = true) {

  if (oldNumberMachine) {
    // Обновление всех таблиц
    let page = document.getElementById('page').value
    let pages = document.getElementById('pagesCount').value
    loadPage(page, pages)
    painting()
  } else {
    //Обновление только одной таблицы
    let divContainer = document.getElementById(pc._id)
    divContainer.innerHTML = ""
    table = tablePC(pc, 'all', true,
      'fdsi',
      'type',
      'name',
      'quantity',
      'serial_number',
      'notes'
    )
    let divCont = document.createElement("div")
    divCont.id = pc._id
    divCont.className = "tableContent"
    divContainer.appendChild(divCont);
    divCont.innerHTML = ""
    divCont.appendChild(table)
    buttons(divCont, pc)
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
        if (voice) {
          let rows = document.querySelector(".serial_number[data-data='" + next_id.join(';') + "']").parentElement
          let row = rows.children
          if (row) {
            textToSpeech(row[1].innerText, 1)
          }
        }
      }
      painting()
    }
  }
}

function clkCopy() {
  document.getElementById('inputCopy').focus()
  document.getElementById('btnSubmit').disabled = true
}

function delBtn() {
  let id = document.getElementById('hidId').value
  let page = document.getElementById('page').value
  let data = {
    id: id,
    page: page
  }
  postData('/pcPa/delete', data)
    .then((data) => {
      let page = data.page
      let pages = data.pages
      document.getElementById('pagesCount').value = pages
      if (pages > 1) {
        createPagination(page)
      } else {
        createPagination(page)
        document.getElementById('paginationTop').hidden = true
        document.getElementById('paginationBottom').hidden = true
      }
      loadPage(page, pages)
    })
}

function testPC() {
  getData('/pcPa/test')
    .then((data) => {
      let serials = data.serials
      let results = data.results
      let divContainer = document.getElementById('testData')
      divContainer.innerHTML = ""
      let table = document.createElement("table");
      table.className = "table table-sm table-bordered table-hover"
      for (let i = 0; i < serials.length; i++) {
        let tr = table.insertRow(-1)
        let td = document.createElement("td")
        if (results[i] === 'ok') {
          td.className = 'cellOK'
        } else {
          td.className = 'cellNotOK'
        }
        td.innerHTML = serials[i]
        tr.appendChild(td)
        td = document.createElement("td")
        if (results[i] === 'ok') {
          td.className = 'cellOK'
        } else {
          td.className = 'cellNotOK'
        }
        td.innerHTML = results[i]
        tr.appendChild(td)
      }
      divContainer.appendChild(table)
    })
}


function ulPagination(page, pages) {
  const ul = document.createElement('ul')
  ul.className = 'PaUl'
  let pageCutLow = page - 1
  let pageCutHigh = page + 1
  // Создаем кнопку "Предыдущая"
  if (page > 1) {
    const li = document.createElement('li')
    li.className = 'page-item previous no'
    const a = document.createElement('a')
    a.className = 'latest'
    a.onclick = () => createPagination(page - 1)
    a.innerHTML = 'Предыдущая'
    li.appendChild(a)
    ul.appendChild(li)
  }
  if (pages < 6) {
    for (let p = 1; p <= pages; p++) {
      const active = page == p ? "active" : "no"
      const li = document.createElement('li')
      li.className = active
      const a = document.createElement('a')
      a.className = 'PaA'
      a.onclick = () => createPagination(p)
      a.innerHTML = p
      li.appendChild(a)
      ul.appendChild(li)
    }
  } else {
    if (page > 2) {
      const li = document.createElement('li')
      li.className = 'Pali no page-item'
      const a = document.createElement('a')
      a.className = 'PaA'
      a.onclick = () => createPagination(1)
      a.innerHTML = '1'
      li.appendChild(a)
      ul.appendChild(li)
      if (page > 3) {
        const li = document.createElement('li')
        li.className = 'Pali out-of-range'
        const a = document.createElement('a')
        a.className = 'PaA'
        a.onclick = () => createPagination(page - 2)
        a.innerHTML = '...'
        li.appendChild(a)
        ul.appendChild(li)
      }
    }
    if (page === 1) {
      pageCutHigh += 2;
    } else if (page === 2) {
      pageCutHigh += 1;
    }
    if (page === pages) {
      pageCutLow -= 2;
    } else if (page === pages - 1) {
      pageCutLow -= 1;
    }
    for (let p = pageCutLow; p <= pageCutHigh; p++) {
      if (p === 0) {
        p += 1;
      }
      if (p > pages) {
        continue
      }
      const active = page == p ? "active" : "no"
      const li = document.createElement('li')
      li.className = 'page-item ' + active
      const a = document.createElement('a')
      a.className = 'PaA'
      a.onclick = () => createPagination(p)
      a.innerHTML = p
      li.appendChild(a)
      ul.appendChild(li)
    }
    if (page < pages - 1) {
      if (page < pages - 2) {
        const li = document.createElement('li')
        li.className = 'out-of-range'
        const a = document.createElement('a')
        a.onclick = () => createPagination(page + 2)
        a.innerHTML = '...'
        li.appendChild(a)
        ul.appendChild(li)
      }
      const li = document.createElement('li')
      li.className = 'page-item no'
      const a = document.createElement('a')
      a.onclick = () => createPagination(pages)
      a.innerHTML = pages
      li.appendChild(a)
      ul.appendChild(li)
    }
  }
  if (page < pages) {
    const li = document.createElement('li')
    li.className = 'page-item next no'
    const a = document.createElement('a')
    a.className = 'latest'
    a.onclick = () => createPagination(page + 1)
    a.innerHTML = 'Следующая'
    li.appendChild(a)
    ul.appendChild(li)
  }
  return ul
}

function createPagination(page) {
  page = parseInt(page)
  const pages = parseInt(document.getElementById('pagesCount').value)
  const containerTop = document.getElementById('paginationTop')
  const containerBottom = document.getElementById('paginationBottom')
  containerTop.innerHTML = ''
  containerBottom.innerHTML = ''
  containerTop.appendChild(ulPagination(page, pages))
  containerBottom.appendChild(ulPagination(page, pages))
  loadPage(page, pages)
  document.getElementById('page').value = page
}

function selectPages(pageCount) {
  let data = {
    pageCount: pageCount
  }
  postData('/pcPa/pageCount', data)
    .then(() => {
      setPage(1)
      document.location.href = '/pcPa'
    })
}

function submitFormAddPc() {
  const formAddPC = document.querySelector('form')
  formAddPC.addEventListener('submit', (e) => {
    e.preventDefault()
    const part = document.getElementById('part').value
    const fdsi = document.getElementById('fdsi').value
    const serial_number = document.getElementById('serial_number').value
    const arm = document.getElementById('arm').value
    const execution = document.getElementById('execution').value
    const attachment = document.getElementById('attachment').value
    // формирование POST запроса для таблицы ПЭВМ
    let pc_unit = []
    const pcUnitTr = document.querySelectorAll('#pc_unit tr')
    pcUnitTr.forEach((tr, i) => {
      if (i == 0) return true
      let fdsi = tr.querySelector('.fdsi').innerText
      let type = tr.querySelector('.type').innerText
      let name = tr.querySelector('.name').innerText
      let quantity = tr.querySelector('.quantity').innerText
      let serial_number = tr.querySelector('.serial_number').innerText
      let notes = tr.querySelector('.notes').innerText
      if (tr.className == 'apkzi') {
        pc_unit.push({
          i: i,
          fdsi: fdsi,
          type: type,
          name: name,
          quantity: quantity,
          serial_number: serial_number,
          notes: notes,
          apkzi: "apkzi"
        })
      } else {
        pc_unit.push({
          i: i,
          fdsi: fdsi,
          type: type,
          name: name,
          quantity: quantity,
          serial_number: serial_number,
          notes: notes
        })
      }
    })
    // формирование POST запроса для таблицы системный блок
    let system_case_unit = []
    const systemCaseUnitTr = document.querySelectorAll('#system_case_unit tr')
    systemCaseUnitTr.forEach((tr, i) => {
      if (i === 0) return true
      let fdsi = tr.querySelector('.fdsi').innerText
      let type = tr.querySelector('.type').innerText
      let name = tr.querySelector('.name').innerText
      let quantity = tr.querySelector('.quantity').innerText
      let serial_number = tr.querySelector('.serial_number').innerText
      let notes = tr.querySelector('.notes').innerText
      if (tr.className === 'apkzi') {
        system_case_unit.push({
          i: i,
          fdsi: fdsi,
          type: type,
          name: name,
          quantity: quantity,
          serial_number: serial_number,
          notes: notes,
          szi: "szi"
        })
      } else {
        system_case_unit.push({
          i: i,
          fdsi: fdsi,
          type: type,
          name: name,
          quantity: quantity,
          serial_number: serial_number,
          notes: notes
        })
      }
    })
    let data = {
      part: part,
      fdsi: fdsi,
      serial_number: serial_number,
      arm: arm,
      execution: execution,
      attachment: attachment,
      pc_unit: JSON.stringify(pc_unit),
      system_case_unit: JSON.stringify(system_case_unit)
    }
    postData('/pcPa/add', data)
      .then((res) => {
        if (res.message === 'ok') {
          window.location = "/pcPa?part=" + data.part + "&serial_number=" + data.serial_number + "'"
        }
      })
  })
}

function validate(input) {
  input.style.borderColor = "#f57e7e";
  input.style.backgroundColor = "#f1f1ae";
  input.style.borderWidth = 2;
}

function submitPC() {
  const editBtn = document.getElementById('edit')
  const id = editBtn.dataset.id
  const partInput = document.getElementById('part')
  const fdsiInput = document.getElementById('fdsi')
  const snInput = document.getElementById('serial_number')
  const armInput = document.getElementById('arm')
  const executionInput = document.getElementById('execution')
  const attachmentInput = document.getElementById('attachment')
  const colorInput = document.getElementById('color-input')

  const part = partInput.value
  const fdsi = fdsiInput.value
  const serial_number = snInput.value
  const arm = armInput.value
  const execution = executionInput.value
  const attachment = attachmentInput.value
  const color = colorInput.value

  if (!partInput.value) {
    validate(partInput)
    return false
  }

  if (!snInput.value) {
    validate(snInput)
    return false
  }

  // формирование POST запроса для таблицы ПЭВМ
  let pc_unit = []
  const pcUnitTr = document.querySelectorAll('#pc_unit tr')
  pcUnitTr.forEach((tr, i) => {
    if (i === 0) return true
    let fdsi = tr.querySelector('.fdsi').innerText
    let type = tr.querySelector('.type').innerText
    let name = tr.querySelector('.name').innerText
    let quantity = tr.querySelector('.quantity').innerText
    let serial_number = tr.querySelector('.serial_number').innerText
    let notes = tr.querySelector('.notes').innerText
    if (tr.className === 'apkzi') {
      pc_unit.push({
        i: i,
        fdsi: fdsi,
        type: type,
        name: name,
        quantity: quantity,
        serial_number: serial_number,
        notes: notes,
        apkzi: "apkzi"
      })
    } else {
      pc_unit.push({
        i: i,
        fdsi: fdsi,
        type: type,
        name: name,
        quantity: quantity,
        serial_number: serial_number,
        notes: notes
      })
    }
  })
  // формирование POST запроса для таблицы системный блок
  let system_case_unit = []
  const systemCaseUnitTr = document.querySelectorAll('#system_case_unit tr')
  systemCaseUnitTr.forEach((tr, i) => {
    if (i === 0) return true
    let fdsi = tr.querySelector('.fdsi').innerText
    let type = tr.querySelector('.type').innerText
    let name = tr.querySelector('.name').innerText
    let quantity = tr.querySelector('.quantity').innerText
    let serial_number = tr.querySelector('.serial_number').innerText
    let notes = tr.querySelector('.notes').innerText
    if (tr.className == 'apkzi') {
      system_case_unit.push({
        i: i,
        fdsi: fdsi,
        type: type,
        name: name,
        quantity: quantity,
        serial_number: serial_number,
        notes: notes,
        szi: "szi"
      })
    } else {
      system_case_unit.push({
        i: i,
        fdsi: fdsi,
        type: type,
        name: name,
        quantity: quantity,
        serial_number: serial_number,
        notes: notes
      })
    }
  })
  const data = {
    id: id,
    part: part,
    fdsi: fdsi,
    serial_number: serial_number,
    arm: arm,
    execution: execution,
    attachment: attachment,
    color: color,
    pc_unit: JSON.stringify(pc_unit),
    system_case_unit: JSON.stringify(system_case_unit)
  }
  postData('/pcPa/pc_update', data)
    .then((res) => {
      if (res.message == 'ok') {
        window.location = "/pcPa?part=" + data.part + "&serial_number=" + data.serial_number + "'"
      }
    })
}
