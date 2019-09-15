function CreateTablePC() {
    let col_rus = ["", "Обозначение изделия", "Наименование изделия", "Характеристика", "Количество", "Заводской номер", "Примечания"]
        
        let table = document.createElement("table");
        table.className = "table table-sm table-bordered table-hover"
        

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

        const divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

        $(".add-row").click(function(){
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


        $(".delete-row").click(function(){
            $("table tbody").find('input[name="record"]').each(function(){
                if($(this).is(":checked")){
                    $(this).parents("tr").remove();
                }
            });
        });
        
        
        });
}