function blur() {
  let tds = document.querySelectorAll('.type_pki,.vendor,.model,.serial_number,.country')
  for (const td of tds) {
    td.addEventListener("blur", function (event) {
      let id = event.target.dataset.id
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
      let overlay = document.getElementById('overlay')
      overlay.style.display = 'none'
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
    insCell('', tr, i + 1, '')
    insCell('', tr, data[i].type_pki, 'type_pki', '', true, {
      'id': data[i]._id
    })
    insCell('', tr, data[i].vendor, 'vendor', '', true, {
      'id': data[i]._id
    })
    insCell('', tr, data[i].model, 'model', '', true, {
      'id': data[i]._id
    })
    insCell('', tr, data[i].serial_number, 'serial_number', '', true, {
      'id': data[i]._id
    })
    insCell('', tr, data[i].country, 'country', '', true, {
      'id': data[i]._id
    })
    insCell('', tr, data[i].number_machine, 'number_machine')
    let id = data[i]._id
    let part = data[i].part
    let html = (
      "<button class=\"btn_f\" onclick=\"location.href='/pkis/" + id + "/edit?allow=true';\"><i class=\"bi bi-pencil-fill\"></i></button>" +
      "<button class=\"btn_d delBtn\" data-id=\'" + id + "'\ data-part=\'" + part + "'\ data-bs-toggle=\"modal\" data-bs-target=\"#modalDel\"><i data-id=\'" + id + "'\ class=\"bi bi-trash-fill\"></i></button>"
    )
    insCell('', tr, html, 'buttons')
  }
  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent table-responsive"
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
  postData('/pkis/del', {
      id
    })
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
      document.getElementById('overlay').style.display = 'none'
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

// function insCell(parrent, html = '', classN, id, contentEditable, dataset) {
//   let cell = parrent.insertCell(-1)
//   if (classN) cell.className = classN
//   if (id) cell.id = id
//   if (contentEditable) cell.contentEditable = contentEditable
//   cell.innerHTML = html
//   if (dataset) {
//     for (const [key, value] of Object.entries(dataset)) {
//       cell.dataset[key] = value
//     }
//   }
// }

function validate(input) {
  input.style.borderColor = "#f57e7e";
  input.style.backgroundColor = "#f1f1ae";
  input.style.borderWidth = 2;
}

async function addPkiSubmit() {
  document.getElementById('error_message').style.display = 'none'
  document.getElementById("formContent").style.boxShadow = '0 13px 16px 0 rgba(0, 0, 0, 0.9)'
  const ean_code = document.getElementById("ean_code").value
  const type_pki = document.getElementById("type_pki").value
  const vendor = document.getElementById("vendor").value
  const model = document.getElementById("model").value
  const country = document.getElementById("country").value
  const part = document.getElementById("part").value
  const serial_number = document.getElementById("serial_number").value
  if (ean_code && !localStorage.countSymbols) {
    const data = {
      valueEAN: ean_code
    }
    await postData('/pkis/searchEAN', data)
      .then((data) => {
        if (data.countSymbols) {
          localStorage.countSymbols = data.countSymbols
        }
      })
  }
  if (localStorage.countSymbols && serial_number.length != +localStorage.countSymbols) {
    document.getElementById('sound').play()
    document.getElementById("serial_number").value = ''
    return
  }
  localStorage.ean_code = ean_code
  localStorage.type_pki = type_pki
  localStorage.vendor = vendor
  localStorage.model = model
  localStorage.country = country
  localStorage.part = part

  textToSpeech(serial_number.slice(-3), 5)

  if (!type_pki) {
    validate(document.getElementById("type_pki"))
    return false
  }
  if (!vendor) {
    validate(document.getElementById("vendor"))
    return false
  }
  if (!model) {
    validate(document.getElementById("model"))
    return false
  }
  if (!country) {
    validate(document.getElementById("country"))
    return false
  }
  if (!part) {
    validate(document.getElementById("part"))
    return false
  }
  if (!serial_number) {
    validate(document.getElementById("serial_number"))
    return false
  }
  document.getElementById("serial_number").value = ''
  if (serial_number) {
    let array = localStorage.snList
    let snArr = []
    if (array && array.length > 0) {
      snArr = array.split(',')
    }
    if (snArr.length > 10) {
      snArr.pop()
    }
    snArr.unshift(serial_number)
    localStorage.snList = snArr
  }
  const pki = new PKI(ean_code, type_pki, vendor, model, country, part, serial_number)
  pki.addPKIToDB().then((data) => {
    if (data.status == 'snExists') {
      document.getElementById('sound').play()
      document.getElementById('error_message').style.display = 'block'
      document.getElementById('alert').innerHTML = data.flashErr
    } else if (data.status == 'ok') {
      if (data.flashErr) {
        document.getElementById('sound').play()
        document.getElementById('error_message').style.display = 'block'
        document.getElementById('alert').innerHTML = data.flashErr
      }
    }
    let array = localStorage.snList
    if (array) {
      snList(array.split(','))
    }
    document.getElementById("formContent").style.boxShadow = '0 30px 60px 0 rgba(0, 0, 0, 0.9)'
  })
}

function searchAndReplace() {
  let overlay = document.getElementById('overlay')
  overlay.style.display = 'block'
  const search = document.getElementById('searchInput').value
  const replace = document.getElementById('replaceInput').value
  data = {
    search,
    replace
  }
  postData('/pkis/searchAndReplace', data)
    .then(() => {
      load_data()
    })
}