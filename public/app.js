
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

function plusOne(number) {
  let indexChar = 0
    for (let index = 0; index < number.length; index++) {
      if (!/\d/.test(number[index])){
        indexChar = index
        
      }
      
    }
    let first_part = number.slice(0, indexChar+1)
    let second_part = number.slice(indexChar+1)

    return first_part + (parseInt(second_part)+1)

}


// добавление данных в сессию браузера
function addSessionApkzi() {
  sessionStorage.setItem("fdsi", document.getElementById("fdsi").value)
  sessionStorage.setItem("apkzi_name", document.getElementById("apkzi_name").value)
  sessionStorage.setItem("kont_name", document.getElementById("kont_name").value)
  sessionStorage.setItem("zav_number", document.getElementById("zav_number").value)
  sessionStorage.setItem("kontr_zav_number", document.getElementById("kontr_zav_number").value)
  sessionStorage.setItem("part", document.getElementById("part").value)
}

// выгрузка данных из сессии браузера
function loadSessionApkzi() {
  let field_fdsi = document.getElementById("fdsi")
  if (sessionStorage.getItem("fdsi")) {
    field_fdsi.value = sessionStorage.getItem("fdsi")
  }

  let field_apkzi_name = document.getElementById("apkzi_name")
  if (sessionStorage.getItem("apkzi_name")) {
    field_apkzi_name.value = sessionStorage.getItem("apkzi_name")
  }

  let field_kont_name = document.getElementById("kont_name")
  if (sessionStorage.getItem("kont_name")) {
    field_kont_name.value = sessionStorage.getItem("kont_name")
  }

  let field_zav_number = document.getElementById("zav_number")
  if (sessionStorage.getItem("zav_number")) {    
    let zav_number_number = plusOne(sessionStorage.getItem("zav_number"))
    field_zav_number.value = zav_number_number
  }

  let field_kontr_zav_number = document.getElementById("kontr_zav_number")
  if (sessionStorage.getItem("kontr_zav_number")) {
    let kontr_zav_number = plusOne(sessionStorage.getItem("kontr_zav_number"))
    field_kontr_zav_number.value = kontr_zav_number
  }

  let field_part = document.getElementById("part")
  if (sessionStorage.getItem("part")) {
    field_part.value = sessionStorage.getItem("part")
  }

  if (sessionStorage.getItem("fdsi")) {
    document.getElementById("kont_name").focus();
  } else {
    document.getElementById("fdsi").focus();
  }
}
