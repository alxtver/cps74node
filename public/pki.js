function blur() {
  let tds = document.querySelectorAll('.type_pki,.vendor,.model,.serial_number,.country')
  for (const td of tds) {
    td.addEventListener("blur", function (event) {
      let id  = event.target.dataset.id
      let value = event.target.innerHTML
      let className = event.target.className
      editCell(id, value, className)
    }, true)
  }
}

function load_data(q) {
  let data = {
    q: q,
  }
  postData('/pkis/search', data)
    .then((data) => {
      CreateTableFromJSON(data.pkis, () => blur())
      CreateSelectType(data.types, function () {
        if (data.selectedType) {
          document.getElementById('type_select_navbar').value = data.selectedType
        }
      })
    })
}

// Редактирование ячеек таблицы ПКИ
function editCell(id, value, field) {
  let data = new Object()
  data.id = id
  data[field] = value
  postData('/pkis/edit_ajax', data)
}

function CreateTableFromJSON(data, callback) {
  let col_rus = ["#", "Тип", "Производитель", "Модель", "Серийный номер", "Страна производства", "Номер машины", ""];
  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-responsive table-striped"
  // TABLE ROW.
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "thead-dark"
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
    insCell(tr, i + 1, '')
    insCell(tr, data[i].type_pki, 'type_pki', '', true, {
      'id': data[i]._id
    })
    insCell(tr, data[i].vendor, 'vendor', '', true, {
      'id': data[i]._id
    })
    insCell(tr, data[i].model, 'model', '', true, {
      'id': data[i]._id
    })
    insCell(tr, data[i].serial_number, 'serial_number', '', true, {
      'id': data[i]._id
    })
    insCell(tr, data[i].country, 'country', '', true, {
      'id': data[i]._id
    })
    insCell(tr, data[i].number_machine, 'number_machine')
    let id = data[i]._id
    let part = data[i].part
    let html = (
      "<button class=\"btn_f\" onclick=\"location.href='/pkis/" + id + "/edit?allow=true';\"><i class=\"fa fa-pen\"></i></button>" +
      "<button class=\"btn_d delBtn\" data-id=\'" + id + "'\ data-part=\'" + part + "'\ data-toggle=\"modal\" data-target=\"#modalDel\"><i data-id=\'" + id + "'\ class=\"fa fa-trash\"></i></button>"
    )
    insCell(tr, html, 'buttons')
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

function delBtn() {
  let id = document.getElementById('hidId').value
  let data = {
    id: id
  }
  postData('/pkis/del', data)
    .then(() => {
      load_data()
    })
}

function changeSelectType(selectedItem) {
  let data = {
    selectedItem: selectedItem
  }
  postData('/sp/insert_type_session', data)
    .then(() => {
      document.getElementById('search').value = ''
      searchPKI(selectedItem)
    })
}

function searchPKI(q) {
  let data = {
    q: q
  }
  postData('/pkis/search', data)
    .then((data) => {
      CreateTableFromJSON(data.pkis, () => blur())
    })
}

function autoComplete() {
  getData('/pkis/autocomplete')
    .then((data) => {
      const types = data.types
      const vendors = data.vendors
      const countrys = data.countrys
      const parts = data.parts
      autocomplete(document.getElementById("vendor"), vendors)
      autocomplete(document.getElementById("type_pki"), types)
      autocomplete(document.getElementById("country"), countrys)
      autocomplete(document.getElementById("part"), parts)
    })
}

function insCell(parrent, html = '', classN, id, contentEditable, dataset) {
  let cell = parrent.insertCell(-1)
  if (classN) cell.className = classN
  if (id) cell.id = id
  if (contentEditable) cell.contentEditable = contentEditable
  cell.innerHTML = html
  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      cell.dataset[key] = value
    }
  }
}