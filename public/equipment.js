function load_table_sp(ean_id) {
  $.ajax({
    url: "/equipment/sp_unit",
    method: "GET",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: ean_id,
    },
    success: function (data) {
      if (data == 'OK'){
        CreateTable1SP()
      } else if (data.serial_number) {
        CreateTableSP_PKI(data)
      } else {
        CreateTableSP_EAN(data)
      }
    }
  })
}

function CreateTable1SP() { 
  
  let col_rus = ["", "Наименование", "Фирма", "Модель", "Количество", "Серийный номер", "СЗЗ Тип2"]

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

  const divContainer = document.getElementById("pki_sp_table1");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);


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

  let serial_numberCell = tr.insertCell(-1)
  serial_numberCell.className = "serial_number"
  serial_numberCell.id = "serial_number"
  serial_numberCell.contentEditable = "true"

  let szz2Cell = tr.insertCell(-1)
  szz2Cell.innerHTML = '1'
  szz2Cell.className = "szz2"
  szz2Cell.id = "szz2"
  szz2Cell.contentEditable = "true"

  

  $('#add').submit(function () {
    // get table html
    let id = $('#id').val()
    let ean_code = $('#ean_code').val()
    let type_pki = $('#type_pki').val()    
    let vendor = $("#vendor").val()
    let model = $("#model").val()
    let country = $("#country").val()

    let sp_unit = []
    let n = 0
    let name_temp = ''
    $('#pki_sp_table1 tr').each(function (i) {
      name_temp = $(this).find(".name").text()
      n += 1
    })
    // формирование POST запроса для таблицы СП
    if (n != 1 && name_temp != '') {
      $('#pki_sp_table1 tr').each(function (i) {
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
            szz2: szz2
          })
        }        
      })
    }

    let sp_unit1 = []
    n = 0
    name_temp = ''
    $('#pki_sp_table2 tr').each(function (i) {
      name_temp = $(this).find(".name").text()
      n += 1
    })
    // формирование POST запроса для таблицы СП
    if (n != 1 && name_temp != '') {
      $('#pki_sp_table2 tr').each(function (i) {
        if (i != 0) {
          let name = $(this).find(".name").text()
          let vendor = $(this).find(".vendor").text()
          let model = $(this).find(".model").text()
          let quantity = $(this).find(".quantity").text()
          let serial_number = $(this).find(".serial_number").text()
          let szz2 = $(this).find(".szz2").text()
          sp_unit1.push({
            i: i,
            name: name,
            vendor: vendor,
            model: model,
            quantity: quantity,
            serial_number: serial_number,
            szz2: szz2
          })
        }        
      })
    }


    $.ajax({
      url: "/equipment/add",
      type: "POST",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: {
        id: id,
        ean_code: ean_code,
        type_pki: type_pki,
        vendor: vendor,
        model: model,
        country: country,        
        sp_unit: sp_unit,
        sp_unit1: sp_unit1
      },
    })
  })
}

function CreateTableSP_EAN(ean) { 
  
  let col_rus = ["", "Наименование", "Фирма", "Модель", "Количество", "Серийный (инв.) номер", "СЗЗ Тип2"]

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

  let serial_numberCell = tr.insertCell(-1)
  serial_numberCell.className = "serial_number"  
  serial_numberCell.id = "serial_number"
  if (unit.serial_number == 'б/н' || unit.serial_number == 'Б/Н' || unit.serial_number == 'Б/н') {
    serial_numberCell.innerHTML = unit.serial_number
  }
  serial_numberCell.contentEditable = "true"

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
    //th.rowSpan = 2
    // th.className = "thead-dark"
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

      let serial_numberCell = tr.insertCell(-1)
      serial_numberCell.className = "serial_number"  
      serial_numberCell.id = "serial_number"
      if (unit.serial_number == 'б/н' || unit.serial_number == 'Б/Н' || unit.serial_number == 'Б/н') {
        serial_numberCell.innerHTML = unit.serial_number
      }
      serial_numberCell.contentEditable = "true"

      let szz2Cell = tr.insertCell(-1)
      szz2Cell.innerHTML = '1'
      szz2Cell.className = "szz2"
      szz2Cell.id = "szz2"
      szz2Cell.contentEditable = "true"
    }
  }    
}

function load_data(q) {
  $.ajax({
    url: "/equipment/load",
    method: "GET",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      q: q,
    },
    success: function (data) {
      CreateTableFromJSON(JSON.parse(data).eans)
      CreateSelectType(JSON.parse(data).types, function () {
        if (JSON.parse(data).selectedType) {
          $("#type_select_navbar option:contains(" + JSON.parse(data).selectedType + ")").prop('selected', true)
        }
      })
    }
  })
}


function CreateTableFromJSON(data) {

  let col_rus = ["#", 'Штрих код', "Наименование", "Фирма", "Модель", "Страна производства"]

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
  $.ajax({
    url: "/equipment/search",
    method: "GET",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      q: q,
    },
    success: function (data) {
      if (data != 'OK'){        
        CreateTableFromJSON(JSON.parse(data).eans)
      }      
    }
  })
}


$(function() {
  $.ajax({
    url: "/equipment/autocomplete",
    method: "GET",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    success: function (data) {
      const types = JSON.parse(data).types
      const vendors = JSON.parse(data).vendors
      const countrys = JSON.parse(data).countrys
      $( "#vendor" ).autocomplete({
        source: vendors      
      })
      $( "#type_pki" ).autocomplete({
        source: types      
      })
      $( "#country" ).autocomplete({
        source: countrys      
      })
    }
  })
})


function load_type_select() {
  $.ajax({
    url: "/sp/types",
    method: "POST",
    //async: false,
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    success: function (data) {
      console.log(data)
      if (data) {
        CreateSelectType(JSON.parse(data).parts, function () {
          if (JSON.parse(data).reqSesPart) {
            $("#type_select_navbar").empty();
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
    $('#type_select_navbar').append('<option value="' + data[i] + '">' + data[i] + '</option>')
  }
  callback()
}