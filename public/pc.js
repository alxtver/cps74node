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
            
            let typeCell = tr.insertCell(-1)
            typeCell.innerHTML = "<input type='checkbox' name='record'>"
            typeCell.className = "record"
            typeCell.id = "type"
            typeCell.contentEditable = "true"
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