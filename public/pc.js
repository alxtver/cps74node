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
            th.innerHTML = col_rus[i];
            tr.appendChild(th);
            thead.appendChild(tr)
        }
        let tbody = table.createTBody()
        tbody.className = "pc_unit_tbody"

        const divContainer = document.getElementById("pc_unit_table");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

        $(".add-row-pc").click(function(){
            // var tbody = document.getElementById("pc_unit_tbody");
            let tableRef = document.getElementById('pc_unit').getElementsByTagName('tbody')[0];
           

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
           // var markup = "<tr><td><input type='checkbox' name='record'></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
           // $("table tbody").append(markup);


        $(".delete-row-pc").click(function(){
            $("#pc_unit").find('input[name="record"]').each(function(){
                if($(this).is(":checked")){
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

        $(".add-row-system").click(function(){
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


        $(".delete-row-system").click(function(){
            $("#system_case_unit").find('input[name="record"]').each(function(){
                if($(this).is(":checked")){
                    $(this).parents("tr").remove();
                }
            });
        });
        
        
        });
}

function load_data(q) {
    $.ajax({
        url: "/pc/search",
        method: "POST",
        data: {
            q: q
        },
        success: function (data) {

            //$('#quote').html(data);
            CreateTableFromJSON(JSON.parse(data));

        }
    });
};

function CreateTableFromJSON(data) {

    
    
    
    // CREATE DYNAMIC TABLE.


    for (let i = 0; i < data.length; i++) {

        let col_rus = [
            "Обозначение изделия",
            "Наименование изделия",
            "Характеристика",
            "Количество",
            "Заводской номер",
            "Примечания"
        ]

        // таблица
        let table = document.createElement("table");
        table.className = "table table-sm table-bordered table-hover"
        let col_up = [
            'ФДШИ.' + data[i].fdsi,
            data[i].serial_number,
            data[i].arm,
            data[i].execution,
            "",
            ""
        ]
        
        
        let tr_up = table.insertRow(-1) // TABLE ROW.        
        let thead_up = table.createTHead()
        thead_up.className = "thead-up"        
        for (let i = 0; i < col_up.length; i++) {
            let td = document.createElement("td") // TABLE HEADER.
            td.innerHTML = col_up[i];
            tr_up.appendChild(td);
            thead_up.appendChild(tr_up)
        }
        // console.log(data[i])



        // Заголовок таблицы
        let tr = table.insertRow(-1) // TABLE ROW.        
        let thead = table.createTHead()
        thead.className = "thead-dark"        
        for (let i = 0; i < col_rus.length; i++) {
            let th = document.createElement("th") // TABLE HEADER.
            th.innerHTML = col_rus[i];
            tr.appendChild(th);
            thead.appendChild(tr)
        }
        
        arr_pc_unit = data[i].pc_unit
        
        for (let j = 0; j < arr_pc_unit.length; j++) {
            tr = table.insertRow(-1)

            let fdsiCell = tr.insertCell(-1)
            fdsiCell.innerHTML = arr_pc_unit[j].fdsi

            let typeCell = tr.insertCell(-1)
            typeCell.innerHTML = arr_pc_unit[j].type

            let nameCell = tr.insertCell(-1)
            nameCell.innerHTML = arr_pc_unit[j].name

            let quantityCell = tr.insertCell(-1)
            quantityCell.innerHTML = arr_pc_unit[j].quantity

            let serial_numberCell = tr.insertCell(-1)
            serial_numberCell.innerHTML = arr_pc_unit[j].serial_number

            let notesCell = tr.insertCell(-1)
            notesCell.innerHTML = arr_pc_unit[j].notes

        }

        let divContainer = document.getElementById("PC");
        let divCont = document.createElement("div")        

        divCont.id = data[i]._id
        divContainer.appendChild(divCont);
        
        divCont.innerHTML = ""
        divCont.appendChild(table)
    }

    
}