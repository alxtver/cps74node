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
    let tbody = table.createTBody()
    tbody.className = "pc_unit_tbody"

    const divContainer = document.getElementById("pc_unit_table");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    $(".add-row-pc").click(function () {
        let tableRef = document.getElementById('pc_unit').getElementsByTagName('tbody')[0]

        tr = tableRef.insertRow(-1)

        let chCell = tr.insertCell(-1)
        chCell.innerHTML = "<input type='checkbox' name='record'>"
        chCell.className = "record"
        chCell.id = "ch"

        let fdsiCell = tr.insertCell(-1)
        fdsiCell.className = "fdsi"
        fdsiCell.id = "fdsi"
        fdsiCell.contentEditable = "true"

        let typeCell = tr.insertCell(-1)
        typeCell.className = "type"
        typeCell.id = "type"
        typeCell.contentEditable = "true"

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

        let notesCell = tr.insertCell(-1)
        notesCell.className = "notes"
        notesCell.id = "notes"
        notesCell.contentEditable = "true"

        $(".delete-row-pc").click(function () {
            $("#pc_unit").find('input[name="record"]').each(function () {
                if ($(this).is(":checked")) {
                    $(this).parents("tr").remove();
                }
            });
        });


    });
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
        th.innerHTML = col_rus[i];
        tr.appendChild(th);
        thead.appendChild(tr)
    }
    let tbody = table.createTBody()

    const divContainer = document.getElementById("system_case_unit_table");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    $(".add-row-system").click(function () {
        tr = tbody.insertRow(-1)

        let chCell = tr.insertCell(-1)
        chCell.innerHTML = "<input type='checkbox' name='record'>"
        chCell.className = "record"
        chCell.id = "ch"

        let fdsiCell = tr.insertCell(-1)
        fdsiCell.className = "fdsi"
        fdsiCell.id = "fdsi"
        fdsiCell.contentEditable = "true"

        let typeCell = tr.insertCell(-1)
        typeCell.className = "type"
        typeCell.id = "type"
        typeCell.contentEditable = "true"

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

        let notesCell = tr.insertCell(-1)
        notesCell.className = "notes"
        notesCell.id = "notes"
        notesCell.contentEditable = "true"
        // var markup = "<tr><td><input type='checkbox' name='record'></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
        // $("table tbody").append(markup);


        $(".delete-row-system").click(function () {
            $("#system_case_unit").find('input[name="record"]').each(function () {
                if ($(this).is(":checked")) {
                    $(this).parents("tr").remove();
                }
            });
        });


    });
}

function load_data(q) {

    $.ajax({
        url: "/pc/search",
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
        method: "POST",
        data: {
            q: q
        },
        success: function (data) {

            CreateTableFromJSON(JSON.parse(data));

        }
    });
};

function load_part() {
    $.ajax({
        url: "/pc/part",
        method: "POST",
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
        success: function (data) {

            //$('#quote').html(data);
            CreateSelect(JSON.parse(data))

        }
    });
};

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
    td.className = "serial up"
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

        let nameCell = tr.insertCell(-1)
        nameCell.innerHTML = arr_pc_unit[j].name
        nameCell.dataset.id = pc._id
        nameCell.className = 'name'

        let quantityCell = tr.insertCell(-1)
        quantityCell.innerHTML = arr_pc_unit[j].quantity
        quantityCell.dataset.id = pc._id

        let serial_numberCell = tr.insertCell(-1)
        serial_numberCell.innerHTML = arr_pc_unit[j].serial_number
        serial_numberCell.dataset.id = pc._id
        serial_numberCell.dataset.obj = j
        serial_numberCell.dataset.unit = 'pc_unit'
        serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'pc_unit'
        serial_numberCell.className = 'serial_number'
        serial_numberCell.contentEditable = "true"

        let notesCell = tr.insertCell(-1)
        notesCell.innerHTML = arr_pc_unit[j].notes
        notesCell.innerHTML = arr_pc_unit[j].notes
        fdsiCell.dataset.id = pc._id

    }


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

    arr_system_case_unit = pc.system_case_unit

    for (let j = 0; j < arr_system_case_unit.length; j++) {
        tr = table.insertRow(-1)

        let fdsiCell = tr.insertCell(-1)
        fdsiCell.innerHTML = arr_system_case_unit[j].fdsi
        fdsiCell.dataset.id = pc._id

        let typeCell = tr.insertCell(-1)
        typeCell.innerHTML = arr_system_case_unit[j].type
        typeCell.dataset.id = pc._id

        let nameCell = tr.insertCell(-1)
        nameCell.innerHTML = arr_system_case_unit[j].name
        nameCell.dataset.id = pc._id

        let quantityCell = tr.insertCell(-1)
        quantityCell.innerHTML = arr_system_case_unit[j].quantity
        quantityCell.dataset.id = pc._id

        let serial_numberCell = tr.insertCell(-1)
        serial_numberCell.innerHTML = arr_system_case_unit[j].serial_number
        serial_numberCell.dataset.id = pc._id
        serial_numberCell.dataset.obj = j
        serial_numberCell.dataset.unit = 'system_case_unit'
        serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'system_case_unit'
        serial_numberCell.className = 'serial_number'
        serial_numberCell.contentEditable = "true"

        let notesCell = tr.insertCell(-1)
        notesCell.innerHTML = arr_system_case_unit[j].notes
        notesCell.dataset.id = pc._id

    }
    return table


}

function CreateTableFromJSON(data) {
    // CREATE DYNAMIC TABLE.


    let divContainer = document.getElementById("PC")
    divContainer.innerHTML = ""

    for (let i = 0; i < data.length; i++) {

        table = TablePc(data[i])
        let divContainer = document.getElementById("PC");
        let divCont = document.createElement("div")
        divCont.id = data[i]._id
        divCont.className = "tableContent mb-3"
        divContainer.appendChild(divCont);
        divCont.innerHTML = ""
        divCont.appendChild(table)

        let button_copy = document.createElement('input')
        button_copy.type = "button"
        button_copy.className = 'btn btn-dark mr-2 mb-1'
        button_copy.value = 'Копировать'
        button_copy.dataset.id = data[i]._id
        button_copy.setAttribute("onclick", "location.href='/pc/" + data[i]._id + "/edit?allow=true'")
        divCont.appendChild(button_copy)

        let button_edit = document.createElement('input')
        button_edit.type = 'button'
        button_edit.className = 'btn btn-dark mr-2 mb-1'
        button_edit.value = 'Редактировать'
        button_edit.setAttribute("onclick", "location.href='/pc/" + data[i]._id + "/edit?allow=true'")
        button_edit.dataset.id = data[i]._id
        divCont.appendChild(button_edit)

    }
}

function CreateSelect(data) {
    $("#part_select").append($('<option value="">...</option>'));
    for (let i = 0; i < data.length; i++) {
        $('#part_select').append('<option value="' + data[i]._id + '">' + data[i].part + '</option>');
    }
}

function edit_serial_number(id, obj, unit, serial_number) {
    $.ajax({
        url: "/pc/insert_serial",
        type: "POST",
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
        data: {
            id: id,
            obj: obj,
            unit: unit,
            serial_number: serial_number
        },
        success: function (pc) {
            UpdateCells(JSON.parse(pc))
        }
    });
}

function UpdateCells(pc) {
    let divContainer = document.getElementById(pc._id)
    divContainer.innerHTML = ""
    table = TablePc(pc)

    let divCont = document.createElement("div")
    divCont.id = pc._id
    divCont.className = "tableContent"
    divContainer.appendChild(divCont);
    divCont.innerHTML = ""
    divCont.appendChild(table)
}

function focusOn() {
    current_id = $("#hidd_id").val()
    console.log(current_id)
    $(".serial_number[data-data='" + current_id + "']").focus()
}