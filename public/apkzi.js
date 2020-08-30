function load_data(q, part) {
  data = {
    q: q,
    part: part
  }
  postData('/apkzi/search', data)
    .then((data) => {
      CreateTableFromJSON(data)
    })
}

function delBtn() {
  let id = document.getElementById('hidId').value
  let part = document.getElementById('hidPart').value
  data = {
    id: id,
    part: part
  }
  postData('/apkzi/del', data)
    .then((data) => {
      load_data('', data)
    })
}


function CreateTableFromJSON(data) {
  let col = ["type_pki", "vendor", "model", "serial_number", "country", "part", "number_machine"];
  let col_rus = ["ФДШИ",
    "Наим. АПКЗИ",
    "Наим. контроллера СЗИ",
    "Зав. номер",
    "Зав. номер контроллера",
    "Номер машины",
    ''
  ]

  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-responsive table-striped"

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  // TABLE ROW.
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th") // TABLE HEADER.
    // th.className = "thead-dark"
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }

  // Заполнение таблицы
  let tbody = table.createTBody()
  for (let i = 0; i < data.length; i++) {
    tr = tbody.insertRow(-1)

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
    number_machineCell.contentEditable = "true"
    if (data[i].number_machine) {
      number_machineCell.innerHTML = data[i].number_machine
    } else {
      number_machineCell.innerHTML = ''
    }

    let buttonCell = tr.insertCell(-1)
    let id = data[i]._id
    let part = data[i].part
    buttonCell.dataset.id = id
    buttonCell.innerHTML = (
      "<button class=\"btn_f\" onclick=\"location.href='/apkzi/" + id + "/edit?allow=true';\"><i class=\"fa fa-pen\"></i></button>" +
      "<button class=\"btn_d delBtn\" data-id=\'" + id + "'\ data-part=\'" + part + "'\ data-toggle=\"modal\" data-target=\"#modalDel\"><i class=\"fa fa-trash\"></i></button>"
    )
  }

  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent"
  divContainer.appendChild(table)
}

// Редактирование ячеек таблицы ПКИ
function edit_fdsi(id, fdsi) {
  data = {
    id: id,
    fdsi: fdsi
  }
  postData('/apkzi/edit_ajax', data)
    .then((data) => {      
    })
}

function edit_apkzi_name(id, apkzi_name) {
  data = {
    id: id,
    apkzi_name: apkzi_name
  }
  postData('/apkzi/edit_ajax', data)
    .then((data) => {      
    })
}

function edit_kont_name(id, kont_name) {
  data = {
    id: id,
    kont_name: kont_name
  }
  postData('/apkzi/edit_ajax', data)
    .then((data) => {      
    })
}

function edit_zav_number(id, zav_number) {
  data = {
    id: id,
    zav_number: zav_number
  }
  postData('/apkzi/edit_ajax', data)
    .then((data) => {      
    })
}

function edit_kontr_zav_number(id, kontr_zav_number) {
  data = {
    id: id,
    kontr_zav_number: kontr_zav_number
  }
  postData('/apkzi/edit_ajax', data)
    .then((data) => {      
    })
}

function edit_number_machine(id, number_machine) {
  data = {
    id: id,
    number_machine: number_machine
  }
  postData('/apkzi/edit_ajax', data)
    .then((data) => {      
    })
}