function load_data(q) {
  $.ajax({
    url: "/pkis/search",
    method: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      q: q,
    },
    success: function (data) {
      CreateTableFromJSON(JSON.parse(data))
    }
  })
}

// Редактирование ячеек таблицы ПКИ
function edit_type(id, type) {
  $.ajax({
    url: "/pkis/edit_ajax",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      type_pki: type
    },
    dataType: "text",
  })
}

function edit_vendor(id, vendor) {
  $.ajax({
    url: "/pkis/edit_ajax",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      vendor: vendor
    },
    dataType: "text",
  })
}

function edit_model(id, model) {
  $.ajax({
    url: "/pkis/edit_ajax",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      model: model
    },
    dataType: "text",
  })
}

function edit_serial_number(id, serial_number) {
  $.ajax({
    url: "/pkis/edit_ajax",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      serial_number: serial_number
    },
    dataType: "text",
  })
}

function edit_country(id, country) {
  $.ajax({
    url: "/pkis/edit_ajax",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      country: country
    },
    dataType: "text",
  })
}

function edit_part(id, part) {
  $.ajax({
    url: "/pkis/edit_ajax",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      part: part
    },
    dataType: "text",
  });
}

function CreateTableFromJSON(data) {
  // EXTRACT VALUE FOR HTML HEADER. 
  // ('Book ID', 'Book Name', 'Category' and 'Price')
  let col = ["#", "type_pki", "vendor", "model", "serial_number", "country", "part", "number_machine", ""];
  let col_rus = ["#", "Тип", "Производитель", "Модель", "Серийный номер", "Страна производства", "Партия", "Номер машины", ""];

  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-striped"

  // TABLE ROW.
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "thead-dark"
  for (let i = 0; i < col.length; i++) {
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

    let numberCell = tr.insertCell(-1)
    numberCell.innerHTML = i + 1

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = data[i].type_pki
    typeCell.dataset.id = data[i]._id
    typeCell.className = "type"
    typeCell.id = "type"
    typeCell.contentEditable = "true"

    let vendorCell = tr.insertCell(-1)
    vendorCell.innerHTML = data[i].vendor
    vendorCell.dataset.id = data[i]._id
    vendorCell.className = "vendor"
    vendorCell.id = "vendor"
    vendorCell.contentEditable = "true"

    let modelCell = tr.insertCell(-1)
    modelCell.innerHTML = data[i].model
    modelCell.dataset.id = data[i]._id
    modelCell.className = "model"
    modelCell.id = "model"
    modelCell.contentEditable = "true"

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = data[i].serial_number
    serial_numberCell.dataset.id = data[i]._id
    serial_numberCell.className = "serial_number"
    serial_numberCell.id = "serial_number"
    serial_numberCell.contentEditable = "true"

    let countryCell = tr.insertCell(-1)
    countryCell.innerHTML = data[i].country
    countryCell.dataset.id = data[i]._id
    countryCell.className = "country"
    countryCell.id = "country"
    countryCell.contentEditable = "true"

    let partCell = tr.insertCell(-1)
    partCell.innerHTML = data[i].part
    partCell.dataset.id = data[i]._id
    partCell.className = "part"
    partCell.id = "part"
    partCell.contentEditable = "true"

    let number_machineCell = tr.insertCell(-1)
    if (data[i].number_machine) {
      number_machineCell.innerHTML = data[i].number_machine
    } else {
      number_machineCell.innerHTML = ''
    }

    let buttonCell = tr.insertCell(-1)
    let id = data[i]._id
    let part = data[i].part
    buttonCell.innerHTML = (
      "<button class=\"btn_f\" onclick=\"location.href='/pkis/" + id + "/edit?allow=true';\"><i class=\"fa fa-pencil\"></i></button>" +
      "<button class=\"btn_d delBtn\" data-id=\'" + id + "'\ data-part=\'" + part + "'\ data-toggle=\"modal\" data-target=\"#modalDel\"><i class=\"fa fa-trash\"></i></button>"
    )
  }

  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent"
  divContainer.appendChild(table)
}



function CreateSelect(data) {
  $("#part_select").append($('<option value="">...</option>'));
  for (let i = 0; i < data.length; i++) {
    $('#part_select').append('<option value="' + data[i]._id + '">' + data[i].part + '</option>');
  }
}

function delBtn() {
  let id = $('#hidId').val()
  let part = $('#hidPart').val()
  $.ajax({
    url: "/pkis/del",
    method: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      part: part
    },
    success: function (data) {
      load_data('', data)
    }
  })
}