function searchPKI(q) {
  let data = {
    q: q,
  }
  postData('/sp/search', data)
    .then((data) => {
      CreateTableFromJSON(data.pkis)
    })
}

function load_data(q) {
  let data = {
    q: q,
  }
  postData('/sp/search', data)
    .then((data) => {
      CreateTableFromJSON(data.pkis)
      CreateSelectType(data.types, function () {
        if (data.selectedType) {
          document.getElementById('type_select_navbar').value = data.selectedType
        }
        let tds = document.querySelectorAll('.szz1')
        for (const td of tds) {
          td.addEventListener("blur", function (event) {
            let id = event.target.dataset.id
            let szz1 = event.target.innerHTML
            let cell = document.querySelector(".szz2[data-id='" + id + "']")
            if (szz1) {
              cell.innerHTML = ''
            } else {
              cell.innerHTML = '1'
            }
            edit_szz1(id, szz1)
          }, true)
        }
      })

      let szzs = document.querySelectorAll('.szz1')
      for (const szz of szzs) {
        szz.addEventListener("keypress", function (event) {
          if (event.keyCode == 13) {
            event.preventDefault()
            let id = event.target.dataset.data
            next_id = Number(id) + 1
            document.querySelector(".szz1[data-data='" + next_id + "']").focus()
          }
        }, true)
      }
    })
}

function CreateTableFromJSON(data) {
  let col_rus = ["#", "Наименование", "Фирма", "Модель", "Количество", "Серийный номер", "Страна производства"]

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

  let th = document.createElement("th")
  th.innerHTML = 'СЗЗ'
  th.colSpan = 2
  tr.appendChild(th)
  thead.appendChild(tr)

  th = document.createElement("th")
  th.innerHTML = ''
  th.rowSpan = 2
  tr.appendChild(th)

  tr = table.insertRow(-1)
  th = document.createElement("th")
  th.innerHTML = 'Тип 1'
  tr.appendChild(th)
  th = document.createElement("th")
  th.innerHTML = 'Тип 2'
  tr.appendChild(th)
  thead.appendChild(tr)

  // Заполнение таблицы
  let tbody = table.createTBody()
  for (let i = 0; i < data.length; i++) {
    tr = tbody.insertRow(-1)

    let numberCell = tr.insertCell(-1)
    numberCell.innerHTML = i + 1
    numberCell.style.fontWeight = "700"

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

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = '1'
    quantityCell.dataset.id = data[i]._id
    quantityCell.className = "quantity"
    quantityCell.id = "quantity"
    quantityCell.style.fontWeight = "700"

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = data[i].serial_number
    serial_numberCell.dataset.id = data[i]._id
    serial_numberCell.className = "serial_number"
    serial_numberCell.id = "serial_number"
    serial_numberCell.style.fontWeight = "700"

    let countryCell = tr.insertCell(-1)
    countryCell.innerHTML = data[i].country
    countryCell.dataset.id = data[i]._id
    countryCell.className = "country"
    countryCell.id = "country"
    countryCell.contentEditable = "true"
    countryCell.style.fontWeight = "700"

    let szz1Cell = tr.insertCell(-1)
    szz1Cell.dataset.id = data[i]._id
    szz1Cell.className = "szz1"
    szz1Cell.dataset.data = i + 1
    szz1Cell.id = "szz1"
    if (data[i].szz1) {
      szz1Cell.innerHTML = data[i].szz1
    } else {
      szz1Cell.innerHTML = ''
    }
    szz1Cell.style.fontWeight = "700"
    szz1Cell.contentEditable = "true"

    let szz2Cell = tr.insertCell(-1)
    szz2Cell.dataset.id = data[i]._id
    szz2Cell.className = "szz2"
    szz2Cell.id = "szz2"
    if (data[i].szz1) {
      szz2Cell.innerHTML = ''
    } else {
      if (data[i].type_pki == "Процессор") {
        szz2Cell.innerHTML = ''
      } else {
        szz2Cell.innerHTML = '1'
      }
    }
    szz2Cell.style.fontWeight = "700"

    let buttonCell = tr.insertCell(-1)
    let id = data[i]._id
    let part = data[i].part
    buttonCell.innerHTML = (
      "<button class=\"btn_f\" onclick=\"location.href='/sp/" + id + "/edit?allow=true';\"><i class=\"bi bi-pencil-fill\"></i></button>"
    )

    // if (data[i].sp_unit.length > 0) {
    //   for (const unit of data[i].sp_unit) {
    //     tr = tbody.insertRow(-1)
    //     let numberCell = tr.insertCell(-1)
    //     numberCell.innerHTML = ''

    //     let nameCell = tr.insertCell(-1)
    //     nameCell.innerHTML = unit.name
    //     nameCell.dataset.id = data[i]._id
    //     nameCell.className = "name"
    //     nameCell.id = "name"

    //     let vendorCell = tr.insertCell(-1)
    //     vendorCell.innerHTML = unit.vendor
    //     vendorCell.dataset.id = data[i]._id
    //     vendorCell.className = "vendor"
    //     vendorCell.id = "vendor"

    //     let modelCell = tr.insertCell(-1)
    //     modelCell.innerHTML = unit.model
    //     modelCell.dataset.id = data[i]._id
    //     modelCell.className = "model"
    //     modelCell.id = "model"

    //     let quantityCell = tr.insertCell(-1)
    //     quantityCell.innerHTML = unit.quantity
    //     quantityCell.dataset.id = data[i]._id
    //     quantityCell.className = "quantity"
    //     quantityCell.id = "quantity"

    //     let serial_numberCell = tr.insertCell(-1)
    //     serial_numberCell.innerHTML = unit.serial_number
    //     serial_numberCell.dataset.id = data[i]._id
    //     serial_numberCell.className = "serial_number"
    //     serial_numberCell.id = "serial_number"

    //     let countryCell = tr.insertCell(-1)
    //     countryCell.innerHTML = ''
    //     countryCell.dataset.id = data[i]._id
    //     countryCell.className = "country"
    //     countryCell.id = "country"

    //     let szz1Cell = tr.insertCell(-1)
    //     szz1Cell.innerHTML = ''
    //     szz1Cell.dataset.id = data[i]._id
    //     szz1Cell.id = "szz1"

    //     let szz2Cell = tr.insertCell(-1)
    //     szz2Cell.innerHTML = unit.szz2
    //     szz2Cell.dataset.id = data[i]._id
    //     szz2Cell.id = "szz2"
    //     szz2Cell.style.fontWeight = "700"

    //     let blankCell = tr.insertCell(-1)
    //     blankCell.innerHTML = ''
    //   }
    // }
  }
  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent"
  divContainer.appendChild(table)
}

function edit_szz1(id, szz1) {
  let data = {
    id: id,
    szz1: szz1
  }
  postData('/sp/edit_ajax', data)
}

function changeSelectType(selectedItem) {
  let data = {
    selectedItem: selectedItem,
  }
  postData('/sp/insert_type_session', data)
    .then(() => {
      searchPKI(selectedItem)
    })
}

function CreateTableSP() {
  let col_rus = ["Наименование", "Фирма", "Модель", "Количество", "Серийный (инв.) номер", "СЗЗ Тип 2"]

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

  const divContainer = document.getElementById("pki_sp_table")
  divContainer.innerHTML = ""
  divContainer.appendChild(table)

  let tableRef = document.getElementById('pki_sp_table').getElementsByTagName('tbody')[0]

  tr = tableRef.insertRow(-1)
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

  let serial_numberCell = tr.insertCell(-1)
  serial_numberCell.className = "serial_number"
  serial_numberCell.id = "serial_number"
  serial_numberCell.contentEditable = "true"

  let szz2Cell = tr.insertCell(-1)
  szz2Cell.innerHTML = "1"
  szz2Cell.className = "szz2"
  szz2Cell.id = "szz2"
  szz2Cell.contentEditable = "true"


}

function subSpPki() {
  let id = document.getElementById('id').value
  let ean_code = document.getElementById('ean_code').value
  let szz1 = document.getElementById('szz1').value
  let sp_unit = []
  // формирование POST запроса для таблицы СП
  let table = document.getElementById('pki_sp_table')
  let n = table.querySelectorAll('.name').length
  let tr = table.querySelectorAll('tr')
  if (n > 0) {
    for (let i = 1; i < tr.length; i++) {
      let name = tr[i].querySelector('.name').innerText
      let vendor = tr[i].querySelector('.vendor').innerText
      let model = tr[i].querySelector('.model').innerText
      let quantity = tr[i].querySelector('.quantity').innerText
      let serial_number = tr[i].querySelector('.serial_number').innerText
      let szz2 = tr[i].querySelector('.szz2').innerText
      sp_unit.push({
        i: i,
        name: name,
        vendor: vendor,
        model: model,
        quantity: quantity,
        serial_number: serial_number,
        szz2: szz2
      })
    }
  }
  let data = {
    id: id,
    ean_code: ean_code,
    szz1: szz1,
    sp_unit: sp_unit
  }
  postData('/sp/edit', data)
    .then(() => {
      document.location.pathname = '/sp'
    })
}

function CreateTableSP_PKI(pki) {
  let col_rus = ["Наименование", "Фирма", "Модель", "Количество", "Серийный (инв.) номер", "СЗЗ Тип 2"]

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

  const divContainer = document.getElementById("pki_sp_table");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

  let tableRef = document.getElementById('pki_sp_table').getElementsByTagName('tbody')[0]
  let n = 1
  if (pki.sp_unit) {
    for (const unit of pki.sp_unit) {
      tr = tableRef.insertRow(-1)
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

      let serial_numberCell = tr.insertCell(-1)
      serial_numberCell.className = "serial_number"
      serial_numberCell.innerHTML = unit.serial_number
      serial_numberCell.id = "serial_number"
      serial_numberCell.dataset.data = n
      serial_numberCell.contentEditable = "true"

      let szz2Cell = tr.insertCell(-1)
      szz2Cell.innerHTML = unit.szz2
      szz2Cell.className = "szz2"
      szz2Cell.id = "szz2"
      szz2Cell.contentEditable = "true"
      n += 1
    }
  }

}

function load_table_sp(pki_id) {
  let data = {
    id: pki_id
  }
  postData('/sp/sp_unit', data)
    .then((data) => {
      if (data.message == 'ok') {
        CreateTableSP()
      } else {
        CreateTableSP_PKI(data)
      }
      let serials = document.querySelectorAll('.serial_number')
      for (const serial of serials) {
        serial.addEventListener("keypress", function (event) {
          if (event.keyCode == 13) {
            event.preventDefault()
            let id = serial.dataset.data
            let next_id = Number(id) + 1
            let nextCellText = document.querySelector(".serial_number[data-data='" + next_id + "']").innerText
            while (/[Бб].?[Нн]/g.test(nextCellText)) {
              next_id += 1
              nextCellText = document.querySelector(".serial_number[data-data='" + next_id + "']").innerText
            }
            document.querySelector(".serial_number[data-data='" + next_id + "']").focus()
          }
        }, true)
      }
    })
}

function load_table_viborka(pki_id, viborka) {
  let data = {
    id: pki_id,
    viborka: viborka
  }
  postData('/sp/viborka', data)
    .then((data) => {
      CreateTable_EAN(data)
    })
}


function CreateTable_EAN(ean) {
  let col_rus = ["Наименование", "Фирма", "Модель", "Количество", "Серийный (инв.) номер", "СЗЗ Тип 2"]

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

  const divContainer = document.getElementById("pki_sp_table");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

  let tableRef = document.getElementById('pki_sp_table').getElementsByTagName('tbody')[0]
  let n = 1
  for (const unit of ean) {
    tr = tableRef.insertRow(-1)


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

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.className = "serial_number"
    serial_numberCell.innerHTML = unit.serial_number
    serial_numberCell.id = "serial_number"
    serial_numberCell.dataset.data = n
    serial_numberCell.contentEditable = "true"

    let szz2Cell = tr.insertCell(-1)
    szz2Cell.innerHTML = unit.szz2
    szz2Cell.className = "szz2"
    szz2Cell.id = "szz2"
    szz2Cell.contentEditable = "true"
    n += 1
  }
}

function CreateTableSP_EAN(ean) {
  let col_rus = ["Наименование", "Фирма", "Модель", "Количество", "Серийный (инв.) номер", "СЗЗ Тип 2"]

  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "sp_unit"

  // Заголовок таблицы
  let tr = table.insertRow(-1)
  let thead = table.createTHead()
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    //th.rowSpan = 2
    // th.className = "thead-dark"
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }

  const divContainer = document.getElementById("pki_sp_table");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

  let tableRef = document.getElementById('pki_sp_table').getElementsByTagName('tbody')[0]

  for (const unit of ean.sp_unit) {
    tr = tableRef.insertRow(-1)


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

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.className = "serial_number"
    serial_numberCell.id = "serial_number"
    if (/[Бб].?[Нн]/g.test(unit.serial_number)) {
      serial_numberCell.innerHTML = unit.serial_number
    }
    serial_numberCell.contentEditable = "true"

    let szz2Cell = tr.insertCell(-1)
    szz2Cell.innerHTML = unit.szz2_number
    szz2Cell.className = "szz2"
    szz2Cell.id = "szz2"
    szz2Cell.contentEditable = "true"
  }
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