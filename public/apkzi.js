function load_data(q, part) {
    $.ajax({
        url: "/apkzi/search",
        method: "POST",
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
        data: {
            q: q,
            part: part
        },
        success: function (data) {
            CreateTableFromJSON(JSON.parse(data))
        }
    })
}


function CreateTableFromJSON(data) {

    let col = ["type_pki", "vendor", "model", "serial_number", "country", "part", "number_machine", "in_case", ""];
    let col_rus = ["ФДШИ",
                   "Наименование АПКЗИ",
                   "Наименование контроллера СЗИ",
                   "Заводской номер",
                   "Заводской номер контроллера",
                   "Проект",
                   "Номер машины",
                   '']

    // CREATE DYNAMIC TABLE.
    let table = document.createElement("table");
    table.className = "table table-sm table-bordered table-hover table-striped"

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
        fdsiCell.className = "fdsi"
        fdsiCell.id = "fdsi"
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

        let partCell = tr.insertCell(-1)
        partCell.innerHTML = data[i].part
        partCell.dataset.id = data[i]._id
        partCell.className = "part"
        partCell.contentEditable = "true"

        let number_machineCell = tr.insertCell(-1)
        if (data[i].number_machine) {
            number_machineCell.innerHTML = data[i].number_machine
        } else {
            number_machineCell.innerHTML = ''
        }

        let buttonCell = tr.insertCell(-1)
        let id = data[i]._id
        buttonCell.innerHTML = (
            "<button class=\"btn_f\" onclick=\"location.href='/pkis/" + id + "/edit?allow=true';\"><i class=\"fa fa-pencil\"></i></button>" +
            "<button class=\"btn_d\" onclick=\"location.href='/pkis/" + id + "/del?allow=true';\"><i class=\"fa fa-trash\"></i></button>"
        )


    }

    const divContainer = document.getElementById("showData")
    divContainer.innerHTML = ""
    divContainer.className = "tableContent"
    divContainer.appendChild(table)
}