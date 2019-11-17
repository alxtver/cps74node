function CreateTablePC() {
  let col_rus = ["", "Обозначение изделия", "Наименование изделия", "Характеристика", "Количество", "Заводской номер", "Примечания"]

  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "pc_unit"

  // Заголовок таблицы
  let tr = table.insertRow(-1)
  let thead = table.createTHead()
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    // th.className = "thead-dark"
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }

  const divContainer = document.getElementById("pc_unit_table");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);


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

  for (const unit of complectPCUnit) {
    tr = tableRef.insertRow(-1)

    let chCell = tr.insertCell(-1)
    chCell.innerHTML = "<input type='checkbox' name='record'>"
    chCell.className = "record"

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.className = "fdsi"
    fdsiCell.id = "fdsi"
    fdsiCell.contentEditable = "true"

    let typeCell = tr.insertCell(-1)
    typeCell.className = "type"
    typeCell.id = "type"
    typeCell.contentEditable = "true"
    typeCell.innerHTML = unit

    let nameCell = tr.insertCell(-1)
    nameCell.className = "name"
    nameCell.id = "name"
    nameCell.contentEditable = "true"


    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = "1"
    quantityCell.className = "quantity"
    quantityCell.id = "quantity"
    quantityCell.contentEditable = "true"

    let serial_numberCell = tr.insertCell(-1)
    
    serial_numberCell.id = "serial_number"
    serial_numberCell.contentEditable = "true"
    if (unit == 'Системный блок' || unit == 'Сетевой фильтр' || unit == 'Гарнитура') {
      serial_numberCell.className = "serial_number number_mashine"
    } else {
      serial_numberCell.className = "serial_number"
    }

    let notesCell = tr.insertCell(-1)
    notesCell.className = "notes"
    notesCell.id = "notes"
    notesCell.contentEditable = "true"
    if (unit == 'Системный блок') {
      notesCell.innerHTML = 'с кабелем питания'
    }
  }


  tr = tableRef.insertRow(-1)
  tr.className = "apkzi"

  chCell = tr.insertCell(-1)
  chCell.innerHTML = "<input type='checkbox' name='record'>"
  chCell.className = "record"

  fdsiCell = tr.insertCell(-1)
  fdsiCell.className = "fdsi"
  fdsiCell.id = "fdsi"
  fdsiCell.contentEditable = "true"

  typeCell = tr.insertCell(-1)
  typeCell.className = "type"
  typeCell.id = "type"
  typeCell.contentEditable = "true"
  typeCell.dataset.apkzi = "apkzi"
  typeCell.innerHTML = "АПКЗИ"

  nameCell = tr.insertCell(-1)
  nameCell.className = "name"
  nameCell.id = "name"
  nameCell.contentEditable = "true"


  quantityCell = tr.insertCell(-1)
  quantityCell.innerHTML = "1"
  quantityCell.className = "quantity"
  quantityCell.id = "quantity"
  quantityCell.contentEditable = "true"

  serial_numberCell = tr.insertCell(-1)
  serial_numberCell.className = "serial_number"
  serial_numberCell.id = "serial_number"
  serial_numberCell.dataset.apkzi = "apkzi"
  serial_numberCell.contentEditable = "true"

  notesCell = tr.insertCell(-1)
  notesCell.className = "notes"
  notesCell.id = "notes"
  notesCell.contentEditable = "true"

}

function CreateTableSystemCase() {
  let col_rus = ["", "Обозначение изделия", "Наименование изделия", "Характеристика", "Количество", "Заводской номер", "Примечания"]

  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"
  table.id = "system_case_unit"


  // Заголовок таблицы
  let tr = table.insertRow(-1)
  let thead = table.createTHead()
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    // th.className = "thead-dark"
    th.innerHTML = col_rus[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }

  const divContainer = document.getElementById("system_case_unit_table");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

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
  for (const unit of complectSystemCaseUnit) {
    tr = tableRef.insertRow(-1)
    tr.className = "szi"

    let chCell = tr.insertCell(-1)
    chCell.innerHTML = "<input type='checkbox' name='record'>"
    chCell.className = "record"

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.className = "fdsi"
    fdsiCell.id = "fdsi"
    fdsiCell.contentEditable = "true"

    let typeCell = tr.insertCell(-1)
    typeCell.className = "type"
    typeCell.id = "type"
    typeCell.contentEditable = "true"
    typeCell.innerHTML = unit

    let nameCell = tr.insertCell(-1)
    nameCell.className = "name"
    nameCell.id = "name"
    nameCell.contentEditable = "true"


    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = "1"
    quantityCell.className = "quantity"
    quantityCell.id = "quantity"
    quantityCell.contentEditable = "true"

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.className = "serial_number"
    serial_numberCell.id = "serial_number"
    serial_numberCell.contentEditable = "true"
    if (unit == 'Корпус') {
      serial_numberCell.className = "serial_number number_mashine"
    } else {
      serial_numberCell.className = "serial_number"
    }
    if (unit == 'Вентилятор процессора') {
      serial_numberCell.innerHTML = 'б/н'
    }

    let notesCell = tr.insertCell(-1)
    notesCell.className = "notes"
    notesCell.id = "notes"
    notesCell.contentEditable = "true"

  }


  tr = tableRef.insertRow(-1)

  chCell = tr.insertCell(-1)
  chCell.innerHTML = "<input type='checkbox' name='record'>"
  chCell.className = "record"

  fdsiCell = tr.insertCell(-1)
  fdsiCell.className = "fdsi"
  fdsiCell.id = "fdsi"
  fdsiCell.contentEditable = "true"

  typeCell = tr.insertCell(-1)
  typeCell.className = "type"
  typeCell.id = "type"
  typeCell.dataset.apkzi = "szi"
  typeCell.contentEditable = "true"
  typeCell.innerHTML = "Контроллер СЗИ10 PCI"

  nameCell = tr.insertCell(-1)
  nameCell.className = "name"
  nameCell.id = "name"
  nameCell.contentEditable = "true"

  quantityCell = tr.insertCell(-1)
  quantityCell.innerHTML = "1"
  quantityCell.className = "quantity"
  quantityCell.id = "quantity"
  quantityCell.contentEditable = "true"

  serial_numberCell = tr.insertCell(-1)
  serial_numberCell.className = "serial_number"
  serial_numberCell.id = "serial_number"
  serial_numberCell.dataset.apkzi = "szi"
  serial_numberCell.contentEditable = "true"

  notesCell = tr.insertCell(-1)
  notesCell.className = "notes"
  notesCell.id = "notes"
  notesCell.contentEditable = "true"

  $(".add-row").click(function () {
    $("#pc_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        let checkedRow = $(this).parents("tr")
        newRow = document.createElement("tr")

        let checkCell = newRow.insertCell(-1)
        checkCell.innerHTML = "<input type='checkbox' name='record'>"
        checkCell.className = "record"

        let fdsiCell = newRow.insertCell(-1)
        fdsiCell.className = "fdsi"
        fdsiCell.id = "fdsi"
        fdsiCell.contentEditable = "true"

        let typeCell = newRow.insertCell(-1)
        typeCell.className = "type"
        typeCell.id = "type"
        typeCell.contentEditable = "true"

        let nameCell = newRow.insertCell(-1)
        nameCell.className = "name"
        nameCell.id = "name"
        nameCell.contentEditable = "true"

        let quantityCell = newRow.insertCell(-1)
        quantityCell.innerHTML = "1"
        quantityCell.className = "quantity"
        quantityCell.id = "quantity"
        quantityCell.contentEditable = "true"

        let serial_numberCell = newRow.insertCell(-1)
        serial_numberCell.className = "serial_number"
        serial_numberCell.id = "serial_number"
        serial_numberCell.contentEditable = "true"

        let notesCell = newRow.insertCell(-1)
        notesCell.className = "notes"
        notesCell.id = "notes"
        notesCell.contentEditable = "true"

        $(newRow).insertAfter(checkedRow)
      }
    })
    $("#system_case_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        let checkedRow = $(this).parents("tr")
        newRow = document.createElement("tr")

        let checkCell = newRow.insertCell(-1)
        checkCell.innerHTML = "<input type='checkbox' name='record'>"
        checkCell.className = "record"

        let fdsiCell = newRow.insertCell(-1)
        fdsiCell.className = "fdsi"
        fdsiCell.id = "fdsi"
        fdsiCell.contentEditable = "true"

        let typeCell = newRow.insertCell(-1)
        typeCell.className = "type"
        typeCell.id = "type"
        typeCell.contentEditable = "true"

        let nameCell = newRow.insertCell(-1)
        nameCell.className = "name"
        nameCell.id = "name"
        nameCell.contentEditable = "true"

        let quantityCell = newRow.insertCell(-1)
        quantityCell.innerHTML = "1"
        quantityCell.className = "quantity"
        quantityCell.id = "quantity"
        quantityCell.contentEditable = "true"

        let serial_numberCell = newRow.insertCell(-1)
        serial_numberCell.className = "serial_number"
        serial_numberCell.id = "serial_number"
        serial_numberCell.contentEditable = "true"

        let notesCell = newRow.insertCell(-1)
        notesCell.className = "notes"
        notesCell.id = "notes"
        notesCell.contentEditable = "true"

        $(newRow).insertAfter(checkedRow)
      }
    })
})
  $(".delete-row").click(function () {
    $("#pc_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        $(this).parents("tr").remove();
      }
    })
    $("#system_case_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        $(this).parents("tr").remove();
      }
    })
  })
}

function load_data(q) {
  $.ajax({
    url: "/pc/search",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    method: "POST",
    data: {
      q: q
    },
    success: function (data) {
      CreateTableFromJSON(JSON.parse(data), function () {
        $("td.name").each(function () {
          if ($(this).text() == 'Н/Д') {
            $(this).css("background-color", "coral")
          }
        })
        $("td.serial_number").each(function () {
          if (!$(this).text()) {
            $(this).css("background-color", "darkgray")
          }
        })
        let current_id = $("#hidd_id").val()
        let next_id = current_id.split(";")
        next_id[1] = Number(next_id[1]) + 1 + ''

        if ($(".popup-checkbox").is(":not(:checked)")) {
          $(".serial_number[data-data='" + next_id.join(';') + "']").focus()
          $("td.serial_number").each(function () {
            if (!$(this).text()) {
              $(this).css("background-color", "darkgray")
            }
          })
        }
      })
      if (q) {
        const serial_number_id = '#' + q
        $('html, body').animate({
          scrollTop: $(serial_number_id).offset().top
        }, 500)
      }
    }
  })
}

function load_pc(id) {

  $.ajax({
    url: "/pc/pc_edit",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    method: "POST",
    data: {
      id: id
    },
    success: function (data) {
      CreateTableEditPC(JSON.parse(data))
    }
  })
}



function TablePc(pc) {
  // таблица ПЭВМ
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover pctable"
  table.id = pc._id

  let tr = table.insertRow(-1) // TABLE ROW.        

  let td = document.createElement("td")
  td.innerHTML = 'ФДШИ.' + pc.fdsi
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.serial_number
  td.id = pc.serial_number
  if (pc.back_color == 'Синий') {
    td.className = "serial_blue up"
  } else if (pc.back_color == 'Зеленый') {
    td.className = "serial_green up"
  } else if (pc.back_color == 'Красный') {
    td.className = "serial_red up"
  } else if (pc.back_color == 'Желтый') {
    td.className = "serial_yelow up"
  } else {
    td.className = "serial up"
  }
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.arm
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.execution
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  tr.appendChild(td)
  td = document.createElement("td")
  tr.appendChild(td)

  if (pc.pc_unit.length > 0) {
    tr = table.insertRow(-1) // TABLE ROW.        

    td = document.createElement("td")
    td.innerHTML = 'Обозначение изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Наименование изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Характеристика'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Количество'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Заводской номер'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Примечания'
    td.className = "header"
    tr.appendChild(td)
  }

  arr_pc_unit = pc.pc_unit

  for (let j = 0; j < arr_pc_unit.length; j++) {
    tr = table.insertRow(-1)

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.innerHTML = arr_pc_unit[j].fdsi
    fdsiCell.dataset.id = pc._id



    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = arr_pc_unit[j].type
    typeCell.dataset.id = pc._id
    typeCell.className = 'type'
    typeCell.contentEditable = 'true'

    let nameCell = tr.insertCell(-1)
    nameCell.innerHTML = arr_pc_unit[j].name
    nameCell.dataset.id = pc._id
    nameCell.className = 'name'
    nameCell.contentEditable = 'true'

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = arr_pc_unit[j].quantity
    quantityCell.dataset.id = pc._id

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arr_pc_unit[j].serial_number
    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'pc_unit'
    serial_numberCell.contentEditable = "true"
    if (arr_pc_unit[j].apkzi) {
      serial_numberCell.dataset.apkzi = "apkzi"
      serial_numberCell.contentEditable = "false"
    }
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'pc_unit'
    serial_numberCell.className = 'serial_number'


    let notesCell = tr.insertCell(-1)
    notesCell.innerHTML = arr_pc_unit[j].notes
    notesCell.innerHTML = arr_pc_unit[j].notes
    fdsiCell.dataset.id = pc._id

  }

  if (pc.system_case_unit.length > 0) {
    tr = table.insertRow(-1) // TABLE ROW.        

    td = document.createElement("td")
    td.innerHTML = 'Обозначение изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Наименование изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Характеристика'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Количество'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Заводской номер'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Примечания'
    td.className = "header"
    tr.appendChild(td)
  }
  arr_system_case_unit = pc.system_case_unit

  for (let j = 0; j < arr_system_case_unit.length; j++) {
    tr = table.insertRow(-1)

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.innerHTML = arr_system_case_unit[j].fdsi
    fdsiCell.dataset.id = pc._id

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = arr_system_case_unit[j].type
    typeCell.dataset.id = pc._id
    typeCell.contentEditable = 'true'

    let nameCell = tr.insertCell(-1)
    nameCell.innerHTML = arr_system_case_unit[j].name
    nameCell.className = 'name'
    nameCell.dataset.id = pc._id
    nameCell.contentEditable = 'true'

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = arr_system_case_unit[j].quantity
    quantityCell.dataset.id = pc._id

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arr_system_case_unit[j].serial_number
    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'system_case_unit'
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'system_case_unit'
    if (arr_system_case_unit[j].szi) {
      serial_numberCell.dataset.apkzi = 'szi'
    }

    serial_numberCell.className = 'serial_number'
    serial_numberCell.contentEditable = "true"

    let notesCell = tr.insertCell(-1)
    notesCell.innerHTML = arr_system_case_unit[j].notes
    notesCell.dataset.id = pc._id
  }
  return table
}

function TableEditPcUnit(pc) {
  // таблица ПЭВМ

  let table = document.createElement("table");

  table.className = "table table-sm table-bordered table-hover pctable"
  table.id = "pc_unit"

  tr = table.insertRow(-1) // TABLE ROW.        

  td = document.createElement("td")
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Обозначение изделия'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Наименование изделия'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Характеристика'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Количество'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Заводской номер'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Примечания'
  td.className = "header"
  tr.appendChild(td)

  arr_pc_unit = pc.pc_unit

  for (let j = 0; j < arr_pc_unit.length; j++) {
    tr = table.insertRow(-1)

    let chCell = tr.insertCell(-1)
    chCell.innerHTML = "<input type='checkbox' name='record'>"
    chCell.className = "record"

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.innerHTML = arr_pc_unit[j].fdsi
    fdsiCell.dataset.id = pc._id
    fdsiCell.className = 'fdsi'
    fdsiCell.contentEditable = "true"

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = arr_pc_unit[j].type
    typeCell.dataset.id = pc._id
    typeCell.className = 'type'
    typeCell.contentEditable = "true"

    let nameCell = tr.insertCell(-1)
    nameCell.innerHTML = arr_pc_unit[j].name
    nameCell.dataset.id = pc._id
    nameCell.className = 'name'
    nameCell.contentEditable = "true"

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = arr_pc_unit[j].quantity
    quantityCell.dataset.id = pc._id
    quantityCell.className = 'quantity'
    quantityCell.contentEditable = "true"

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


    let notesCell = tr.insertCell(-1)
    notesCell.innerHTML = arr_pc_unit[j].notes
    notesCell.innerHTML = arr_pc_unit[j].notes
    notesCell.dataset.id = pc._id
    notesCell.className = 'notes'
    notesCell.contentEditable = "true"
  }
  return table
}

function TableEditSystemCase(pc) {
  // таблица ПЭВМ

  let table = document.createElement("table");

  table.className = "table table-sm table-bordered table-hover pctable"
  table.id = "system_case_unit"

  tr = table.insertRow(-1) // TABLE ROW.        

  td = document.createElement("td")
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Обозначение изделия'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Наименование изделия'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Характеристика'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Количество'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Заводской номер'
  td.className = "header"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = 'Примечания'
  td.className = "header"
  tr.appendChild(td)

  arr_system_case_unit = pc.system_case_unit

  for (let j = 0; j < arr_system_case_unit.length; j++) {
    tr = table.insertRow(-1)

    let chCell = tr.insertCell(-1)
    chCell.innerHTML = "<input type='checkbox' name='record'>"
    chCell.className = "record"

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.innerHTML = arr_system_case_unit[j].fdsi
    fdsiCell.dataset.id = pc._id
    fdsiCell.className = 'fdsi'
    fdsiCell.contentEditable = "true"

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = arr_system_case_unit[j].type
    typeCell.dataset.id = pc._id
    typeCell.className = 'type'
    typeCell.contentEditable = "true"

    let nameCell = tr.insertCell(-1)
    nameCell.innerHTML = arr_system_case_unit[j].name
    nameCell.dataset.id = pc._id
    nameCell.className = 'name'
    nameCell.contentEditable = "true"

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = arr_system_case_unit[j].quantity
    quantityCell.dataset.id = pc._id
    quantityCell.className = 'quantity'
    quantityCell.contentEditable = "true"

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arr_system_case_unit[j].serial_number
    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'system_case_unit'
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'system_case_unit'
    if (arr_system_case_unit[j].szi) {
      serial_numberCell.dataset.apkzi = 'szi'
    }

    serial_numberCell.className = 'serial_number'
    serial_numberCell.contentEditable = "true"

    let notesCell = tr.insertCell(-1)
    notesCell.innerHTML = arr_system_case_unit[j].notes
    notesCell.dataset.id = pc._id
    notesCell.className = 'notes'
    notesCell.contentEditable = "true"
  }
  return table
}

function CreateTableFromJSON(data, callback) {
  // CREATE DYNAMIC TABLE.
  let divContainer = document.getElementById("PC")
  divContainer.innerHTML = ""

  for (let i = 0; i < data.length; i++) {
    table = TablePc(data[i])
    let divContainer = document.getElementById("PC");
    let divCont = document.createElement("div")
    divCont.id = data[i]._id
    if (data[i].back_color == 'Синий') {
      divCont.className = "tableContent-blue mb-3"
    } else if (data[i].back_color == 'Зеленый') {
      divCont.className = "tableContent-green mb-3"
    } else if (data[i].back_color == 'Красный') {
      divCont.className = "tableContent-red mb-3"
    } else if (data[i].back_color == 'Желтый') {
      divCont.className = "tableContent-yelow mb-3"
    } else {
      divCont.className = "tableContent mb-3"
    }    
    divContainer.appendChild(divCont);
    divCont.innerHTML = ""
    divCont.appendChild(table)

    let button_copy = document.createElement('input')
    button_copy.type = "button"
    button_copy.className = 'btn btn-outline-primary mr-2 mb-2 ml-3 copyBtn'
    button_copy.onchange = "klcCopy()"
    button_copy.value = 'Копировать'
    button_copy.dataset.id = data[i]._id
    button_copy.dataset.serial_number = data[i].serial_number
    button_copy.dataset.toggle = 'modal'
    button_copy.dataset.target = '#modalCopy'
    divCont.appendChild(button_copy)

    let button_edit = document.createElement('input')
    button_edit.type = 'button'
    button_edit.className = 'btn btn-outline-success mr-2 mb-2'
    button_edit.value = 'Редактировать'
    button_edit.setAttribute("onclick", "location.href='/pc/" + data[i]._id + "/edit?allow=true'")
    button_edit.dataset.id = data[i]._id
    divCont.appendChild(button_edit)

    let button_del = document.createElement('input')
    button_del.type = 'button'
    button_del.className = 'btn btn-outline-danger mr-2 mb-2 delBtn float-right'
    button_del.value = 'Удалить'    
    button_del.dataset.id = data[i]._id
    button_del.dataset.serial_number = data[i].serial_number
    button_del.dataset.target = '#modalDel'
    button_del.dataset.toggle = 'modal'
    divCont.appendChild(button_del)
  }
  callback()
}

function CreateTableEditPC(data) {
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

  let button_add_row = document.createElement('input')
  button_add_row.type = 'button'
  button_add_row.id = 'add-row'
  button_add_row.className = 'btn btn-outline-primary ml-2 mr-2 mb-2'
  button_add_row.value = 'Добавить строку'
  divCont.appendChild(button_add_row)

  let button_del_row = document.createElement('input')
  button_del_row.type = 'button'
  button_del_row.id = 'delete-row'
  button_del_row.className = 'btn btn-outline-danger ml-2 mr-2 mb-2'
  button_del_row.value = 'Удалить строку'
  divCont.appendChild(button_del_row)
  
  let select_color = document.createElement('select')
  select_color.className = 'form-control'
  select_color.id = 'select_color'
  let colors = ['...', 'Красный', 'Синий', 'Зеленый', 'Желтый']
  for (const color of colors) {
    let option = document.createElement("option")
    option.text = color;
    select_color.add(option)
  }  
  divCont.appendChild(select_color)

  let button_edit = document.createElement('input')
  button_edit.type = 'submit'
  button_edit.className = 'btn btn-outline-success mt-2 save_button'
  button_edit.value = 'Сохранить изменения'
  button_edit.id = "submit"
  button_edit.dataset.id = data._id
  divCont.appendChild(button_edit)

  let button_back = document.createElement('input')
  button_back.type = 'button'
  button_back.className = 'btn btn-outline-primary  mt-2 save_button'
  button_back.value = 'Назад'
  button_back.setAttribute("onclick", "location.href='/pc?part=" + data.part + "&serial_number=" + data.serial_number + "'")
  divCont.appendChild(button_back)

  

  $("#add-row").click(function () {
    $("#pc_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        let checkedRow = $(this).parents("tr")
        newRow = document.createElement("tr")

        let checkCell = newRow.insertCell(-1)
        checkCell.innerHTML = "<input type='checkbox' name='record'>"
        checkCell.className = "record"

        let fdsiCell = newRow.insertCell(-1)
        fdsiCell.className = "fdsi"
        fdsiCell.id = "fdsi"
        fdsiCell.contentEditable = "true"

        let typeCell = newRow.insertCell(-1)
        typeCell.className = "type"
        typeCell.id = "type"
        typeCell.contentEditable = "true"

        let nameCell = newRow.insertCell(-1)
        nameCell.className = "name"
        nameCell.id = "name"
        nameCell.contentEditable = "true"

        let quantityCell = newRow.insertCell(-1)
        quantityCell.innerHTML = "1"
        quantityCell.className = "quantity"
        quantityCell.id = "quantity"
        quantityCell.contentEditable = "true"

        let serial_numberCell = newRow.insertCell(-1)
        serial_numberCell.className = "serial_number"
        serial_numberCell.id = "serial_number"
        serial_numberCell.contentEditable = "true"

        let notesCell = newRow.insertCell(-1)
        notesCell.className = "notes"
        notesCell.id = "notes"
        notesCell.contentEditable = "true"

        $(newRow).insertAfter(checkedRow)
      }
    })
    $("#system_case_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        let checkedRow = $(this).parents("tr")
        newRow = document.createElement("tr")

        let checkCell = newRow.insertCell(-1)
        checkCell.innerHTML = "<input type='checkbox' name='record'>"
        checkCell.className = "record"

        let fdsiCell = newRow.insertCell(-1)
        fdsiCell.className = "fdsi"
        fdsiCell.id = "fdsi"
        fdsiCell.contentEditable = "true"

        let typeCell = newRow.insertCell(-1)
        typeCell.className = "type"
        typeCell.id = "type"
        typeCell.contentEditable = "true"

        let nameCell = newRow.insertCell(-1)
        nameCell.className = "name"
        nameCell.id = "name"
        nameCell.contentEditable = "true"

        let quantityCell = newRow.insertCell(-1)
        quantityCell.innerHTML = "1"
        quantityCell.className = "quantity"
        quantityCell.id = "quantity"
        quantityCell.contentEditable = "true"

        let serial_numberCell = newRow.insertCell(-1)
        serial_numberCell.className = "serial_number"
        serial_numberCell.id = "serial_number"
        serial_numberCell.contentEditable = "true"

        let notesCell = newRow.insertCell(-1)
        notesCell.className = "notes"
        notesCell.id = "notes"
        notesCell.contentEditable = "true"

        $(newRow).insertAfter(checkedRow)
      }
    })
})
  

  $('#delete-row').click(function(){
    $("#pc_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        $(this).parents("tr").remove()
      }
    })
    $("#system_case_unit").find('input[name="record"]').each(function () {
      if ($(this).is(":checked")) {
        $(this).parents("tr").remove()
      }
    })
  })
}

function CreateSelect(data) {
  $("#part_select").append($('<option disabled selected value="">...</option>'))
  for (let i = 0; i < data.length; i++) {
    $('#part_select').append('<option value="' + data[i].part + '">' + data[i].part + '</option>')
  }
}

function edit_serial_number(id, obj, unit, serial_number) {
  $.ajax({
    url: "/pc/insert_serial",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      obj: obj,
      unit: unit,
      serial_number: serial_number
    },
    success: function (pc) {
      UpdateCells(JSON.parse(pc), function () {
      
        $("td.name").each(function () {
          if ($(this).text() == 'Н/Д') {
            $(this).css("background-color", "coral")
          }
        })

      
      })
    }
  })
}

function check_serial_number(serial_number) {
  $.ajax({
    url: "/pc/check_serial",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      serial_number: serial_number
    },
    success: function (data) {
      if (data != 'ok') {
        $(".popup-checkbox").prop('checked', true)
        let msg_txt = 'Серийник был привязан к машине с номером ' + data
        $("#oldNumber").text(msg_txt)
        var audio = {};
        audio["walk"] = new Audio();
        audio["walk"].src = "/sounds/S20759.mp3"        
        audio["walk"].play()
      }
    }
  })
}


function edit_serial_number_apkzi(id, obj, unit, serial_number) {
  $.ajax({
    url: "/pc/insert_serial_apkzi",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      id: id,
      obj: obj,
      unit: unit,
      serial_number: serial_number
    },
    success: function (pc) {
      UpdateCells(JSON.parse(pc))
    }
  })
}

function UpdateCells(pc, callback) {
  // Обновление всех таблиц
  load_data()
  if(callback) callback()

  // Обновление только одной таблицы

  // let divContainer = document.getElementById(pc._id)
  // divContainer.innerHTML = ""
  // console.log(pc.part);
  // table = TablePc(pc)
  // let divCont = document.createElement("div")
  // divCont.id = pc._id
  // divCont.className = "tableContent"
  // divContainer.appendChild(divCont);
  // divCont.innerHTML = ""
  // divCont.appendChild(table)

  // let button_copy = document.createElement('input')
  // button_copy.type = "button"
  // button_copy.className = 'btn btn-dark mr-2 mb-2 ml-3 copyBtn'
  // button_copy.onchange = "klcCopy()"
  // button_copy.value = 'Копировать'
  // button_copy.dataset.id = pc._id
  // button_copy.dataset.serial_number = pc.serial_number
  // button_copy.dataset.toggle = 'modal'
  // button_copy.dataset.target = '#modalCopy'
  // divCont.appendChild(button_copy)

  // let button_edit = document.createElement('input')
  // button_edit.type = 'button'
  // button_edit.className = 'btn btn-dark mr-2 mb-2'
  // button_edit.value = 'Редактировать'
  // button_edit.setAttribute("onclick", "location.href='/pc/" + pc._id + "/edit?allow=true'")
  // button_edit.dataset.id = pc._id
  // divCont.appendChild(button_edit)
}

function focusOn() {
  current_id = $("#hidd_id").val()
  $(".serial_number[data-data='" + current_id + "']").focus()
}

function find_serial(serial) {
  $.ajax({
    url: "/pc/find_serial",
    method: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      serial: serial
    },
    success: function (data) {
      if (data) {
        $("#inputCopy").css("background-color", "indianred")
        $("#hidd").append('<div id="danger" style="color: indianred">Машина с таким номером существует</div>')
        $('#btnSubmit').prop('disabled', true)
      } else {
        $("#inputCopy").css("background-color", "white")
        $("#danger").remove()
        $('#btnSubmit').prop('disabled', false)
      }
    }
  })
}

function klcCopy() {
  $("#inputCopy").focus()
  $('#btnSubmit').prop('disabled', true)
}

function delBtn() {
  let id = $('#hidId').val()  
  $.ajax({
      url: "/pc/delete",
      method: "POST",
      headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
      data: {
          id: id
      },
      success: function (data) {
          load_data()
      }
  })
}
