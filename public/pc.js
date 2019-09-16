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


$(document).ready(function(){
    CreateTablePC();
});

$('form').submit(function(){
// get table html
let part = $('#part').val()
let fdsi = $('#fdsi').val()
let serial_number = $('#serial_number').val()
let arm = $('#arm').val()
let execution = $('#execution').val()

let table = {html: $('#pc_unit').html()};
let pc_unit = [];
$('#pc_unit tr').each(function(i) {
  if (i == 0) {
      return true
  }
  let fdsi = $(this).find(".fdsi").html();
  let type = $(this).find(".type").html();
  let name = $(this).find(".name").html();
  let quantity = $(this).find(".quantity").html();
  let serial_number = $(this).find(".serial_number").html();
  let notes = $(this).find(".notes").html();
  
    
  pc_unit.push({
      i: i,
      fdsi: fdsi,
      type: type,
      name: name,
      quantity: quantity,
      serial_number: serial_number,
      notes: notes
  });
});


// POST the data
//  alert(data[1].html())
$.ajax({
    url: "/pc/add",
    type: "POST",
    data: {
        part: part,
        fdsi: fdsi,
        serial_number: serial_number,
        arm: arm,
        execution: execution,
        pc_unit: JSON.stringify(pc_unit)}
});
});    
