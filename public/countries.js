$(document).ready(function () {
    load_data()
    $("body").on('click', '.delBtn', function () {
      $('#hidId').val($(this).data("id"))
    })
  })

function load_data(q) {
    $.ajax({
      url: "/countries/load",
      method: "GET",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      success: function (data) {
        CreateTableFromJSON(JSON.parse(data).countries)        
      }
    })
  }

  function CreateTableFromJSON(data) {

    let col_rus = ["#", "Страна производитель"]
  
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
        "<button class=\"btn_f\" onclick=\"location.href='/countries/" + id + "/edit?allow=true';\"><i class=\"fa fa-pencil\"></i></button>" +
        "<button class=\"btn_d delBtn\" data-id=\'" + id + "'\ data-part=\'" + part + "'\ data-toggle=\"modal\" data-target=\"#modalDel\"><i class=\"fa fa-trash\"></i></button>"
      )
    }
  
    const divContainer = document.getElementById("showData")
    divContainer.innerHTML = ""
    divContainer.className = "tableContent"
    divContainer.appendChild(table)
  }


  function delBtn() {
    let id = $('#hidId').val()
    let part = $('#hidPart').val()
    $.ajax({
      url: "/countries/del",
      method: "POST",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: {
        id: id
      },
      success: function (data) {
        load_data()
      }
    })
  }