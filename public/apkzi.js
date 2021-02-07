function blur() {
  const tds = document.querySelectorAll('.fdsi,.apkzi_name,.kont_name,.fdsiKontr,.zav_number,.kontr_zav_number')
  for (const td of tds) {
    td.addEventListener("blur", function (event) {
      let id = event.target.dataset.id
      let value = event.target.textContent
      let className = event.target.className
      editCell(id, value, className)
    }, true)
  }
}

// Редактирование ячеек таблицы АПКЗИ
function editCell(id, value, field) {
  let data = new Object()
  data.id = id
  data[field] = value
  postData('/apkzi/edit_ajax', data)
}

function load_data(q, part) {
  const data = {
    q: q,
    part: part
  }
  postData('/apkzi/search', data)
    .then((data) => {
      CreateTableFromJSON(data, () => {
        blur()
      })
    })
}

function delBtn() {
  const id = document.getElementById('hidId').value
  const part = document.getElementById('hidPart').value
  const data = {
    id: id,
    part: part
  }
  postData('/apkzi/del', data)
    .then((data) => {
      load_data('', data)
    })
}

function CreateTableFromJSON(data, callback) {
  const col_rus = [
    "№",
    "ФДШИ",
    "Наим. АПКЗИ",
    "Наим. контроллера СЗИ",
    "ФДШИ контроллера",
    "Зав. номер",
    "Зав. номер контроллера",
    "Номер машины",
    ''
  ]
  // CREATE DYNAMIC TABLE.
  const table = document.createElement("table")
  table.className = "table table-sm table-bordered table-hover table-responsive table-striped"
  // TABLE ROW.
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "table-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th") // TABLE HEADER.
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }
  // Заполнение таблицы
  let tbody = table.createTBody()
  for (let i = 0; i < data.length; i++) {
    tr = tbody.insertRow(-1)

    let numberCell = tr.insertCell(-1)
    numberCell.innerHTML = parseInt(i) + 1

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.innerHTML = data[i].fdsi
    fdsiCell.dataset.id = data[i]._id
    fdsiCell.className = "fdsi"
    fdsiCell.contentEditable = "true"

    let apkzi_nameCell = tr.insertCell(-1)
    apkzi_nameCell.innerHTML = data[i].apkzi_name
    apkzi_nameCell.dataset.id = data[i]._id
    apkzi_nameCell.className = "apkzi_name"
    apkzi_nameCell.contentEditable = "true"

    let kont_nameCell = tr.insertCell(-1)
    kont_nameCell.innerHTML = data[i].kont_name
    kont_nameCell.dataset.id = data[i]._id
    kont_nameCell.className = "kont_name"
    kont_nameCell.contentEditable = "true"

    let kont_fdsiCell = tr.insertCell(-1)
    kont_fdsiCell.innerHTML = data[i].fdsiKontr
    kont_fdsiCell.dataset.id = data[i]._id
    kont_fdsiCell.className = "fdsiKontr"
    kont_fdsiCell.contentEditable = "true"

    let zav_numberCell = tr.insertCell(-1)
    zav_numberCell.innerHTML = data[i].zav_number
    zav_numberCell.dataset.id = data[i]._id
    zav_numberCell.className = "zav_number"
    zav_numberCell.contentEditable = "true"

    let kontr_zav_numberCell = tr.insertCell(-1)
    kontr_zav_numberCell.innerHTML = data[i].kontr_zav_number
    kontr_zav_numberCell.dataset.id = data[i]._id
    kontr_zav_numberCell.className = "kontr_zav_number"
    kontr_zav_numberCell.contentEditable = "true"

    let number_machineCell = tr.insertCell(-1)
    number_machineCell.dataset.id = data[i]._id
    number_machineCell.className = "number_machine"
    number_machineCell.innerHTML = data[i].number_machine ? data[i].number_machine : ''

    let buttonCell = tr.insertCell(-1)
    let id = data[i]._id
    let part = data[i].part
    buttonCell.dataset.id = id
    buttonCell.innerHTML = (
      "<button class=\"btn_f\" onclick=\"location.href='/apkzi/" + id + "/edit?allow=true';\"><i class=\"bi bi-pencil-fill\"></i></button>" +
      "<button class=\"btn_d delBtn\" data-id=\'" + id + "'\ data-part=\'" + part + "'\ data-bs-toggle=\"modal\" data-bs-target=\"#modalDel\"><i data-id=\'" + id + "'\ class=\"bi bi-trash-fill\"></i></button>"
    )
  }
  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent"
  divContainer.appendChild(table)

  //событие по клику на кнопку удалить
  let delBtns = document.querySelectorAll('.delBtn')
  for (const btn of delBtns) {
    btn.addEventListener('click', (event) => {
      document.getElementById('hidId').value = event.target.dataset.id
    })
  }
  callback()
}

function addAPKZISubmit() {
  document.getElementById("formContent").style.boxShadow = '0 13px 16px 0 rgba(0, 0, 0, 0.9)'
  const fdsi = document.getElementById('fdsi').value
  const apkzi_name = document.getElementById('apkzi_name').value
  const kont_name = document.getElementById('kont_name').value
  const fdsiKontr = document.getElementById('fdsiKontr').value
  const zav_number = document.getElementById('zav_number').value
  const kontr_zav_number = document.getElementById('kontr_zav_number').value
  const part = document.getElementById('part').value

  localStorage.fdsi = fdsi
  localStorage.apkzi_name = apkzi_name
  localStorage.kont_name = kont_name
  localStorage.fdsiKontr = fdsiKontr
  localStorage.zav_number = zav_number
  localStorage.kontr_zav_number = kontr_zav_number
  localStorage.part = part

  let zavNumberInput = document.getElementById('zav_number')
  let kontrZavNumberInput = document.getElementById('kontr_zav_number')
  zavNumberInput.value = calc(localStorage.zav_number).plusOne()
  kontrZavNumberInput.value = calc(localStorage.kontr_zav_number).plusOne()
  if (!fdsi) {
    validate(document.getElementById('fdsi'))
    return false
  }
  if (!apkzi_name) {
    validate(document.getElementById("apkzi_name"))
    return false
  }
  if (!kont_name) {
    validate(document.getElementById("kont_name"))
    return false
  }
  if (!fdsiKontr) {
    validate(document.getElementById("fdsiKontr"))
    return false
  }
  if (!zav_number) {
    validate(document.getElementById("zav_number"))
    return false
  }
  if (!kontr_zav_number) {
    validate(document.getElementById("kontr_zav_number"))
    return false
  }
  if (!part) {
    validate(document.getElementById("part"))
    return false
  }

  const apkzi = new APKZI(apkzi_name, kont_name, fdsi, fdsiKontr, zav_number, kontr_zav_number, part)
  apkzi.addAPKZIToDB().then(() => {
    document.getElementById("formContent").style.boxShadow = '0 30px 60px 0 rgba(0, 0, 0, 0.9)'
    kontrZavNumberInput.focus()
  })
}

function validate(input) {
  input.style.borderColor = "#f57e7e";
  input.style.backgroundColor = "#f1f1ae";
  input.style.borderWidth = 2;
}