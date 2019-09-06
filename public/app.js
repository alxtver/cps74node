// добавление данных в сессию браузера
function addSession() {
  let field_type_pki = document.getElementById("type_pki").value;
  sessionStorage.setItem("type_pki", field_type_pki);

  let field_vendor = document.getElementById("vendor").value;
  sessionStorage.setItem("vendor", field_vendor);

  let field_model = document.getElementById("model").value;
  sessionStorage.setItem("model", field_model);

  let field_country = document.getElementById("country").value;
  sessionStorage.setItem("country", field_country);

  let field_part = document.getElementById("part").value;
  sessionStorage.setItem("part", field_part);

  let check = document.getElementById("in_case");

  if (check.checked) {
    sessionStorage.setItem("check", "checked");
  } else {
    sessionStorage.setItem("check", "unchecked");
  }
}

// выгрузка данных из сессии браузера
function loadSession() {
  let field_type_pki = document.getElementById("type_pki");
  if (sessionStorage.getItem("type_pki")) {
    field_type_pki.value = sessionStorage.getItem("type_pki");
  }

  let field_vendor = document.getElementById("vendor");
  if (sessionStorage.getItem("vendor")) {
    field_vendor.value = sessionStorage.getItem("vendor");
  }

  let field_model = document.getElementById("model");
  if (sessionStorage.getItem("model")) {
    field_model.value = sessionStorage.getItem("model");
  }

  let field_country = document.getElementById("country");
  if (sessionStorage.getItem("country")) {
    field_country.value = sessionStorage.getItem("country")
  }

  let field_part = document.getElementById("part");
  if (sessionStorage.getItem("part")) {
    field_part.value = sessionStorage.getItem("part")
  }

  if (sessionStorage.getItem("check") == "checked") {
    document.getElementById("in_case").checked = true;
  }

  if (sessionStorage.getItem("type_pki")) {
    document.getElementById("serial_number").focus();
  } else {
    document.getElementById("type_pki").focus();
  }
}

//валидация формы добавления и редактирования ПКИ
(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

function load_data(q) {
  $.ajax({
    url: "/pkis/user",
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
  // EXTRACT VALUE FOR HTML HEADER. 
  // ('Book ID', 'Book Name', 'Category' and 'Price')
  let col = ["type_pki", "vendor", "model", "serial_number", "country", "part", "number_machine", "in_case", ""];
  let col_rus = ["Тип", "Производитель", "Модель", "Серийный номер", "Страна производства", "Партия", "Номер машины", "В СБ", ""];

  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover"

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  let tr = table.insertRow(-1) // TABLE ROW.
  let thead = table.createTHead()
  thead.className = "thead-dark"
  for (let i = 0; i < col.length; i++) {
    let th = document.createElement("th") // TABLE HEADER.
    // th.className = "thead-dark"
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (let i = 0; i < data.length; i++) {
    tr = table.insertRow(-1)

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = data[i].type_pki

    let vendorCell = tr.insertCell(-1)
    vendorCell.innerHTML = data[i].vendor

    let modelCell = tr.insertCell(-1)
    modelCell.innerHTML = data[i].model

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = data[i].serial_number

    let countryCell = tr.insertCell(-1)
    countryCell.innerHTML = data[i].country

    let partCell = tr.insertCell(-1)
    partCell.innerHTML = data[i].part

    let number_machineCell = tr.insertCell(-1)
    if (data[i].number_machine) {
      number_machineCell.innerHTML = data[i].number_machine  
    } else {
      number_machineCell.innerHTML = ''
    }
    

    let in_caseCell = tr.insertCell(-1)
    in_caseCell.innerHTML = data[i].in_case

    let buttonCell = tr.insertCell(-1)
    let id = data[i]._id
    buttonCell.innerHTML = (
      "<button class=\"btn_f\" onclick=\"location.href='/pkis/" + id + "/edit?allow=true';\"><i class=\"fa fa-pencil\"></i></button>" +
      "<button class=\"btn_d\" onclick=\"location.href='/pkis/" + id + "/del?allow=true';\"><i class=\"fa fa-trash\"></i></button>"
    )


  }

  //     for (let j = 0; j < col.length; j++) {
  //         let tabCell = tr.insertCell(-1)

  //         if (data[i][col[j]]) {
  //           tabCell.innerHTML = data[i][col[j]]
  //           } else {
  //             tabCell.innerHTML = ''
  //           }
  //         console.log(data[i].in_case)
  // if (!col[j]) {
  //   let id = data[i]._id

  // }
  //         }

  // }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  const divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}