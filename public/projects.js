

function load_data(q) {

    $.ajax({
        url: "/pc/search",
        method: "POST",
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
        data: {
            q: q,
            csrf: $('meta[name="csrf"]').attr('content')
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

    for (let elem of data) {
        table = TablePc(elem)
        let divContainer = document.getElementById("PC");
        let divCont = document.createElement("div")
        divCont.id = elem._id
        divCont.className = "tableContent mb-3"
        divContainer.appendChild(divCont);
        divCont.innerHTML = ""
        divCont.appendChild(table)

        let button_passport = document.createElement('input')
        button_passport.type = "button"
        button_passport.className = 'btn btn-outline-primary mr-2 mb-2 ml-3 copyBtn'
        button_passport.value = 'Паспорт'
        button_passport.setAttribute("onclick", "location.href='/projects/" + elem._id + "/passport'")
        button_passport.dataset.id = elem._id        
        divCont.appendChild(button_passport)
    }
}

function CreateSelect(data) {
    $("#part_select").append($('<option value="">...</option>'));
    for (let i = 0; i < data.length; i++) {
        $('#part_select').append('<option value="' + data[i]._id + '">' + data[i].part + '</option>');
    }
}

