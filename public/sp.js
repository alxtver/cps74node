function searchPKI(q) {
  $.ajax({
    url: "/sp/search",
    method: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      q: q,
    },
    success: function (data) {
      CreateTableFromJSON(JSON.parse(data).pkis)
    }
  })
}

function load_data(q) {
  $.ajax({
    url: "/sp/search",
    method: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      q: q,
    },
    success: function (data) {
      CreateTableFromJSON(JSON.parse(data).pkis)
      CreateSelectType(JSON.parse(data).types, function () {
        if (JSON.parse(data).selectedType) {
          $("#type_select_navbar option:contains(" + JSON.parse(data).selectedType + ")").prop('selected', true)
        }
      })
    }
  })
}

function CreateTableFromJSON(data) {

  let col_rus = ["#", "Наименование", "Фирма", "Модель", "Количество", "Серийный номер", "Страна производства"]

  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-striped"

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
    szz2Cell.className = "szz1"
    szz2Cell.id = "szz1"
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
      "<button class=\"btn_f\" onclick=\"location.href='/sp/" + id + "/edit?allow=true';\"><i class=\"fa fa-pencil\"></i></button>"
      //"<button class=\"btn_d delBtn\" data-id=\'" + id + "'\ data-part=\'" + part + "'\ data-toggle=\"modal\" data-target=\"#modalDel\"><i class=\"fa fa-trash\"></i></button>"
    )

    if (data[i].sp_unit.length > 0) {
      for (const unit of data[i].sp_unit) {
        tr = tbody.insertRow(-1)
        let numberCell = tr.insertCell(-1)
        numberCell.innerHTML = ''

        let nameCell = tr.insertCell(-1)
        nameCell.innerHTML = unit.name
        nameCell.dataset.id = data[i]._id
        nameCell.className = "name"
        nameCell.id = "name"

        let vendorCell = tr.insertCell(-1)
        vendorCell.innerHTML = unit.vendor
        vendorCell.dataset.id = data[i]._id
        vendorCell.className = "vendor"
        vendorCell.id = "vendor"

        let modelCell = tr.insertCell(-1)
        modelCell.innerHTML = unit.model
        modelCell.dataset.id = data[i]._id
        modelCell.className = "model"
        modelCell.id = "model"

        let quantityCell = tr.insertCell(-1)
        quantityCell.innerHTML = unit.quantity
        quantityCell.dataset.id = data[i]._id
        quantityCell.className = "quantity"
        quantityCell.id = "quantity"

        let serial_numberCell = tr.insertCell(-1)
        serial_numberCell.innerHTML = unit.serial_number
        serial_numberCell.dataset.id = data[i]._id
        serial_numberCell.className = "serial_number"
        serial_numberCell.id = "serial_number"

        let countryCell = tr.insertCell(-1)
        countryCell.innerHTML = ''
        countryCell.dataset.id = data[i]._id
        countryCell.className = "country"
        countryCell.id = "country"

        let szz1Cell = tr.insertCell(-1)
        szz1Cell.innerHTML = ''
        szz1Cell.dataset.id = data[i]._id
        szz1Cell.className = "szz1"
        szz1Cell.id = "szz1"

        let szz2Cell = tr.insertCell(-1)
        szz2Cell.innerHTML = unit.szz2
        szz2Cell.dataset.id = data[i]._id
        szz2Cell.className = "szz2"
        szz2Cell.id = "szz2"
        szz2Cell.style.fontWeight = "700"

        let blankCell = tr.insertCell(-1)
        blankCell.innerHTML = ''
      }
    }
  }

  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent"
  divContainer.appendChild(table)
}

$(document).on('blur', '.country', function () {
  let id = $(this).data("id")
  let country = $(this).text()
  edit_country(id, country)
})

function edit_country(id, country) {
  $.ajax({
    url: "/sp/edit_ajax",
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

$(document).on('blur', '.szz1', function () {
  let id = $(this).data("id")
  let szz1 = $(this).text()
  edit_szz1(id, szz1)
})

function edit_szz1(id, szz1) {
  $.ajax({
    url: "/sp/edit_ajax",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      szz1: szz1
    },
    dataType: "text",
    success: function () {
      //load_data()
    }
  })
}

function load_type_select() {
  $.ajax({
    url: "/sp/types",
    method: "POST",
    //async: false,
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    success: function (data) {
      if (data) {
        CreateSelectType(JSON.parse(data).parts, function () {
          if (JSON.parse(data).reqSesPart) {
            $("#type_select_navbar option:contains(" + JSON.parse(data).reqSesPart + ")").prop('selected', true)
          }
        })
      }
    }
  })
}

function CreateSelectType(data, callback) {
  $("#type_select_navbar").append($('<option value="">...</option>'));
  for (let i = 0; i < data.length; i++) {
    $('#type_select_navbar').append('<option value="' + data[i] + '">' + data[i] + '</option>');
  }
  callback()
}

function changeSelectType(selectedItem) {
  $.ajax({
    url: "/sp/insert_type_session",
    method: "POST",
    //async: false,
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      selectedItem: selectedItem
    },
    success: function () {
      searchPKI(selectedItem)
    }
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

  

  $('#edit').submit(function () {
    // get table html
    let id = $('#id').val()
    let ean_code = $('#ean_code').val()
    let szz1 = $('#szz1').val()

    let sp_unit = []
    let n = 0
    let name_temp = ''
    $('#pki_sp_table tr').each(function (i) {
      name_temp = $(this).find(".name").text()
      n += 1
    })
    // формирование POST запроса для таблицы СП
    if (n != 1 && name_temp != '') {
      $('#pki_sp_table tr').each(function (i) {
        if (i == 0) {
          return true
        }
        let name = $(this).find(".name").text()
        let vendor = $(this).find(".vendor").text()
        let model = $(this).find(".model").text()
        let quantity = $(this).find(".quantity").text()
        let serial_number = $(this).find(".serial_number").text()
        let szz2 = $(this).find(".szz2").text()
        sp_unit.push({
          i: i,
          name: name,
          vendor: vendor,
          model: model,
          quantity: quantity,
          serial_number: serial_number,
          szz2: szz2
        })
      })
    }


    $.ajax({
      url: "/sp/edit",
      type: "POST",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: {
        id: id,
        ean_code: ean_code,
        szz1: szz1,
        sp_unit: sp_unit
      },
    })
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
  serial_numberCell.contentEditable = "true"

  let szz2Cell = tr.insertCell(-1)
  szz2Cell.innerHTML = unit.szz2
  szz2Cell.className = "szz2"
  szz2Cell.id = "szz2"
  szz2Cell.contentEditable = "true"
  }  

  $('#edit').submit(function () {
    // get table html
    let id = $('#id').val()
    let ean_code = $('#ean_code').val()
    let szz1 = $('#szz1').val()
    let viborka = $('#viborka').prop("checked")

    let sp_unit = []
    let n = 0
    let name_temp = ''
    $('#pki_sp_table tr').each(function (i) {
      name_temp = $(this).find(".name").text()
      n += 1
    })
    // формирование POST запроса для таблицы СП
    if (n != 1 && name_temp != '') {
      $('#pki_sp_table tr').each(function (i) {
        if (i == 0) {
          return true
        }
        let name = $(this).find(".name").text()
        let vendor = $(this).find(".vendor").text()
        let model = $(this).find(".model").text()
        let quantity = $(this).find(".quantity").text()
        let serial_number = $(this).find(".serial_number").text()
        let szz2 = $(this).find(".szz2").text()
        sp_unit.push({
          i: i,
          name: name,
          vendor: vendor,
          model: model,
          quantity: quantity,
          serial_number: serial_number,
          szz2: szz2
        })
      })
    }

    $.ajax({
      url: "/sp/edit",
      type: "POST",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: {
        id: id,
        ean_code: ean_code,
        szz1: szz1,
        sp_unit: sp_unit,
        viborka: viborka
      },
    })
  })
}

function load_table_sp(pki_id) {
  $.ajax({
    url: "/sp/sp_unit",
    method: "GET",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: pki_id,
    },
    success: function (data) {
      if (data == 'OK'){
        CreateTableSP()
      } else {
        CreateTableSP_PKI(data)
      }
    }
  })
}




function load_table_viborka(pki_id, viborka) {
  $.ajax({
    url: "/sp/viborka",
    method: "GET",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: pki_id,
      viborka: viborka
    },
    success: function (data) {
      CreateTable_EAN(data)
    }
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
  serial_numberCell.contentEditable = "true"

  let szz2Cell = tr.insertCell(-1)
  szz2Cell.innerHTML = unit.szz2
  szz2Cell.className = "szz2"
  szz2Cell.id = "szz2"
  szz2Cell.contentEditable = "true"
  }
} 

$(document).on('keypress', '#ean_code', function (e) {  
  let ean = $(this).val()
  let pki_id = $('#pki_id').val()
  let viborka
  if ($('#viborka').is(':checked') == true) {
    viborka = true
  } else {
    viborka = false
  }
  if (e.which == 13) {      
    $.ajax({
      url: "/sp/check_ean",
      method: "GET",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: {
        ean: ean,
        viborka: viborka,
        pki_id: pki_id
      },
      success: function (data) {
        if (data != "OK") {
          CreateTable_EAN(data)
        } else {
          CreateTableSP()
        }
      }
    }) 
  }
})

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
    if (unit.serial_number == 'б/н' || unit.serial_number == 'Б/Н' || unit.serial_number == 'Б/н') {
      serial_numberCell.innerHTML = unit.serial_number
    }
    serial_numberCell.contentEditable = "true"

    let szz2Cell = tr.insertCell(-1)
    szz2Cell.innerHTML = unit.szz2_number
    szz2Cell.className = "szz2"
    szz2Cell.id = "szz2"
    szz2Cell.contentEditable = "true"
  }  


  $('#edit').submit(function () {
    // get table html
    let id = $('#id').val()
    let ean_code = $('#ean_code').val()
    let szz1 = $('#szz1').val()

    let sp_unit = []
    let n = 0
    let name_temp = ''
    $('#pki_sp_table tr').each(function (i) {
      name_temp = $(this).find(".name").text()
      n += 1
    })
    // формирование POST запроса для таблицы СП
    if (n != 1 && name_temp != '') {
      $('#pki_sp_table tr').each(function (i) {
        if (i != 0) {
          let name = $(this).find(".name").text()
          let vendor = $(this).find(".vendor").text()
          let model = $(this).find(".model").text()
          let quantity = $(this).find(".quantity").text()
          let serial_number = $(this).find(".serial_number").text()
          let szz2 = $(this).find(".szz2").text()
          sp_unit.push({
            i: i,
            name: name,
            vendor: vendor,
            model: model,
            quantity: quantity,
            serial_number: serial_number,
            szz2_number: szz2
          })
        }
       
      })
    }
    $.ajax({
      url: "/sp/edit",
      type: "POST",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: {
        id: id,
        ean_code: ean_code,
        szz1: szz1,
        sp_unit: sp_unit
      },
    })
  })
}