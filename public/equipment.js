function load_table_sp(ean_id) {
  data = {
    id: ean_id
  }
  postData('/equipment/sp_unit', data)
    .then((data) => {
      if (data.message == 'ok') {
        CreateTable1SP()
      } else if (data.serial_number) {
        CreateTableSP_PKI(data)
      } else {
        CreateTableSP_EAN(data)
      }
    })
}

function CreateTable1SP() {
  let col_rus = ["", "Наименование", "Фирма", "Модель", "Количество", "СЗЗ Тип2"]
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "sp_unit"
  // Заголовок таблицы
  let tr = table.insertRow(-1)
  let thead = table.createTHead()
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }
  const divContainer = document.getElementById("pki_sp_table1")
  divContainer.innerHTML = ""
  divContainer.appendChild(table)

  let tableRef = document.getElementById('pki_sp_table1').getElementsByTagName('tbody')[0]

  tr = tableRef.insertRow(-1)

  let chCell = tr.insertCell(-1)
  chCell.innerHTML = "<input type='checkbox' name='record'>"
  chCell.className = "record"

  let nameCell = tr.insertCell(-1)
  nameCell.className = "name"
  nameCell.id = "name"
  nameCell.contentEditable = "true"

  let vendorCell = tr.insertCell(-1)
  vendorCell.className = "vendor"
  vendorCell.id = "vendor"
  vendorCell.contentEditable = "true"

  let modelCell = tr.insertCell(-1)
  modelCell.className = "model"
  modelCell.id = "model"
  modelCell.contentEditable = "true"

  let quantityCell = tr.insertCell(-1)
  quantityCell.innerHTML = "1"
  quantityCell.className = "quantity"
  quantityCell.id = "quantity"
  quantityCell.contentEditable = "true"

  let szz2Cell = tr.insertCell(-1)
  szz2Cell.innerHTML = '1'
  szz2Cell.className = "szz2"
  szz2Cell.id = "szz2"
  szz2Cell.contentEditable = "true"
}

function validate(input) {
  input.style.borderColor = "#f57e7e";
  input.style.backgroundColor = "#f1f1ae";
  input.style.borderWidth = 2;
}

function submitEq() {
  const type_pkiInput = document.getElementById('type_pki')
  const vendorInput = document.getElementById('vendor')
  const modelInput = document.getElementById('model')
  const ean_codeInput = document.getElementById('ean_code')
  const countryInput = document.getElementById('country')

  const type_pki = type_pkiInput.value
  const vendor = vendorInput.value
  const model = modelInput.value
  const ean_code = ean_codeInput.value
  const country = countryInput.value
  if (!ean_codeInput.value) {
    validate(ean_codeInput)
    return false
  }
  if (!type_pkiInput.value) {
    validate(type_pkiInput)
    return false
  }
  if (!vendorInput.value) {
    validate(vendorInput)
    return false
  }
  if (!modelInput.value) {
    validate(modelInput)
    return false
  }
  if (!countryInput.value) {
    validate(countryInput)
    return false
  }
  // формирование POST запроса для таблицы СП
  let sp_unit = []
  let table = document.getElementById('pki_sp_table1')
  let n = table.querySelectorAll('.name').length
  let tr = table.querySelectorAll('tr')
  if (n > 0) {
    for (let i = 1; i < tr.length; i++) {
      let name = tr[i].querySelector('.name').innerHTML
      let vendor = tr[i].querySelector('.vendor').innerHTML
      let model = tr[i].querySelector('.model').innerHTML
      let quantity = tr[i].querySelector('.quantity').innerHTML
      let szz2 = tr[i].querySelector('.szz2').innerHTML
      sp_unit.push({
        i: i,
        name: name,
        vendor: vendor,
        model: model,
        quantity: quantity,
        szz2: szz2
      })
    }
  }
  let sp_unit1 = []
  table = document.getElementById('pki_sp_table2')
  n = table.querySelectorAll('.name').length
  tr = table.querySelectorAll('tr')
  if (n > 0) {
    for (let i = 1; i < tr.length; i++) {
      let name = tr[i].querySelector('.name').innerHTML
      let vendor = tr[i].querySelector('.vendor').innerHTML
      let model = tr[i].querySelector('.model').innerHTML
      let quantity = tr[i].querySelector('.quantity').innerHTML
      let szz2 = tr[i].querySelector('.szz2').innerHTML
      sp_unit1.push({
        i: i,
        name: name,
        vendor: vendor,
        model: model,
        quantity: quantity,
        szz2: szz2
      })
    }
  }
  data = {
    ean_code: ean_code,
    type_pki: type_pki,
    vendor: vendor,
    model: model,
    country: country,
    sp_unit: sp_unit,
    sp_unit1: sp_unit1
  }
  if (document.forms["add"]) {
    postData('/equipment/add', data)
      .then(() => {})
    if (ean_code && type_pki && vendor && model && country) {
      document.forms["add"].submit()
    }
  }

  if (document.forms["edit"]) {
    postData('/equipment/edit', data)
      .then(() => {})
    if (ean_code && type_pki && vendor && model && country) {
      document.forms["edit"].submit()
    }
  }
}

function CreateTableSP_EAN(ean) {
  let col_rus = ["", "Наименование", "Фирма", "Модель", "Количество", "СЗЗ Тип2"]
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "sp_unit"

  // Заголовок таблицы
  let tr = table.insertRow(-1)
  let thead = table.createTHead()
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }

  let divContainer = document.getElementById("pki_sp_table1");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

  let tableRef = document.getElementById('pki_sp_table1').getElementsByTagName('tbody')[0]

  for (const unit of ean.sp_unit) {
    tr = tableRef.insertRow(-1)

    let chCell = tr.insertCell(-1)
    chCell.innerHTML = "<input type='checkbox' name='record'>"
    chCell.className = "record"

    let nameCell = tr.insertCell(-1)
    nameCell.className = "name"
    nameCell.innerHTML = unit.name
    nameCell.id = "name"
    nameCell.contentEditable = "true"

    let vendorCell = tr.insertCell(-1)
    vendorCell.className = "vendor"
    vendorCell.innerHTML = unit.vendor
    vendorCell.id = "vendor"
    vendorCell.contentEditable = "true"

    let modelCell = tr.insertCell(-1)
    modelCell.className = "model"
    modelCell.innerHTML = unit.model
    modelCell.id = "model"
    modelCell.contentEditable = "true"

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = unit.quantity
    quantityCell.className = "quantity"
    quantityCell.id = "quantity"
    quantityCell.contentEditable = "true"

    let szz2Cell = tr.insertCell(-1)
    szz2Cell.innerHTML = unit.szz2
    szz2Cell.className = "szz2"
    szz2Cell.id = "szz2"
    szz2Cell.contentEditable = "true"
  }

  table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "sp_unit1"

  // Заголовок таблицы
  tr = table.insertRow(-1)
  thead = table.createTHead()
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }

  if (ean.sp_unit1 != '') {
    divContainer = document.getElementById("pki_sp_table2");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    tableRef = document.getElementById('pki_sp_table2').getElementsByTagName('tbody')[0]

    for (const unit of ean.sp_unit1) {
      tr = tableRef.insertRow(-1)

      let chCell = tr.insertCell(-1)
      chCell.innerHTML = "<input type='checkbox' name='record'>"
      chCell.className = "record"

      let nameCell = tr.insertCell(-1)
      nameCell.className = "name"
      nameCell.innerHTML = unit.name
      nameCell.id = "name"
      nameCell.contentEditable = "true"

      let vendorCell = tr.insertCell(-1)
      vendorCell.className = "vendor"
      vendorCell.innerHTML = unit.vendor
      vendorCell.id = "vendor"
      vendorCell.contentEditable = "true"

      let modelCell = tr.insertCell(-1)
      modelCell.className = "model"
      modelCell.innerHTML = unit.model
      modelCell.id = "model"
      modelCell.contentEditable = "true"

      let quantityCell = tr.insertCell(-1)
      quantityCell.innerHTML = unit.quantity
      quantityCell.className = "quantity"
      quantityCell.id = "quantity"
      quantityCell.contentEditable = "true"

      let szz2Cell = tr.insertCell(-1)
      szz2Cell.innerHTML = '1'
      szz2Cell.className = "szz2"
      szz2Cell.id = "szz2"
      szz2Cell.contentEditable = "true"
    }
  }
}

function load_data(q) {
  let data = {
    q: q,
  }
  postData('/equipment/load', data)
    .then((data) => {
      CreateTableFromJSON(data.eans)
      CreateSelectType(data.types, function () {})
    })
}

function CreateTableFromJSON(data) {
  let col_rus = ["#", 'Штрих код', "Наименование", "Фирма", "Модель", "Страна производства"]

  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-responsive table-striped"

  // TABLE ROW.
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th") // TABLE HEADER.
    th.rowSpan = 2
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }
  th = document.createElement("th")
  th.innerHTML = ''
  th.rowSpan = 2
  tr.appendChild(th)

  // Заполнение таблицы
  let tbody = table.createTBody()
  for (let i = 0; i < data.length; i++) {
    tr = tbody.insertRow(-1)

    let numberCell = tr.insertCell(-1)
    numberCell.innerHTML = i + 1
    numberCell.style.fontWeight = "700"

    let eanCell = tr.insertCell(-1)
    eanCell.innerHTML = data[i].ean_code
    eanCell.dataset.id = data[i]._id
    eanCell.className = "ean"
    eanCell.id = "ean"
    eanCell.style.fontWeight = "700"

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = data[i].type_pki
    typeCell.dataset.id = data[i]._id
    typeCell.className = "type"
    typeCell.id = "type"
    typeCell.style.fontWeight = "700"

    let vendorCell = tr.insertCell(-1)
    vendorCell.innerHTML = data[i].vendor
    vendorCell.dataset.id = data[i]._id
    vendorCell.className = "vendor"
    vendorCell.id = "vendor"
    vendorCell.style.fontWeight = "700"

    let modelCell = tr.insertCell(-1)
    modelCell.innerHTML = data[i].model
    modelCell.dataset.id = data[i]._id
    modelCell.className = "model"
    modelCell.id = "model"
    modelCell.style.fontWeight = "700"

    let countryCell = tr.insertCell(-1)
    countryCell.innerHTML = data[i].country
    countryCell.dataset.id = data[i]._id
    countryCell.className = "country"
    countryCell.id = "country"
    countryCell.contentEditable = "true"
    countryCell.style.fontWeight = "700"

    let buttonCell = tr.insertCell(-1)
    let id = data[i]._id
    let part = data[i].part
    buttonCell.innerHTML = (
      "<button class=\"btn_f\" onclick=\"location.href='/equipment/" + id + "/edit?allow=true';\"><i class=\"fa fa-pen\"></i></button>"
    )
  }

  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent"
  divContainer.appendChild(table)
}

function searchEANCode(q) {
  let data = {
    q: q,
  }
  postData('/equipment/search', data)
    .then((data) => {
      if (data.message != 'ok') {
        CreateTableFromJSON(data.eans)
      }
    })
}

function autoComplete() {
  getData('/equipment/autocomplete')
    .then((data) => {
      const types = data.types
      const vendors = data.vendors
      const countrys = data.countrys
      autocomplete(document.getElementById("vendor"), vendors)
      autocomplete(document.getElementById("type_pki"), types)
      autocomplete(document.getElementById("country"), countrys)
    })
}

function addRow() {
  let records = document.querySelectorAll('input[name="record"]')
  for (const rec of records) {
    if (rec.checked) {
      let checkedRow = rec.closest("tr")
      let newRow = document.createElement("tr")
      insCell('', newRow, "<input type='checkbox' name='record'>", 'record')
      insCell('', newRow, '', 'name', '', true)
      insCell('', newRow, '', 'vendor', '', true)
      insCell('', newRow, '', 'model', '', true)
      insCell('', newRow, '1', 'quantity', '', true)
      insCell('', newRow, '1', 'szz2', '', true)
      checkedRow.parentNode.insertBefore(newRow, checkedRow.nextSibling)
    }
  }
}

function delRow() {
  let records = document.querySelectorAll('input[name="record"]')
  for (const rec of records) {
    if (rec.checked) {
      rec.closest("tr").remove()
    }
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