// добавление данных в сессию браузера
function addSession() {
  let field_ean_code = document.getElementById("ean_code").value
  sessionStorage.setItem("ean_code", field_ean_code)
  let field_type_pki = document.getElementById("type_pki").value
  sessionStorage.setItem("type_pki", field_type_pki)
  let field_vendor = document.getElementById("vendor").value
  sessionStorage.setItem("vendor", field_vendor)
  let field_model = document.getElementById("model").value
  sessionStorage.setItem("model", field_model)
  let field_country = document.getElementById("country").value
  sessionStorage.setItem("country", field_country)
  let field_part = document.getElementById("part").value
  sessionStorage.setItem("part", field_part)
  let field_serial_number = document.getElementById("serial_number").value
  sessionStorage.setItem("serial_number", field_serial_number)
}

// выгрузка данных из сессии браузера
function loadSession() {
  let field_ean_code = document.getElementById("ean_code")
  if (sessionStorage.getItem("ean_code")) {
    field_ean_code.value = sessionStorage.getItem("ean_code")
  }
  let field_type_pki = document.getElementById("type_pki")
  if (sessionStorage.getItem("type_pki")) {
    field_type_pki.value = sessionStorage.getItem("type_pki")
  }
  let field_vendor = document.getElementById("vendor")
  if (sessionStorage.getItem("vendor")) {
    field_vendor.value = sessionStorage.getItem("vendor")
  }
  let field_model = document.getElementById("model")
  if (sessionStorage.getItem("model")) {
    field_model.value = sessionStorage.getItem("model")
  }
  let field_country = document.getElementById("country")
  if (sessionStorage.getItem("country")) {
    field_country.value = sessionStorage.getItem("country")
  }
  let field_part = document.getElementById("part")
  if (sessionStorage.getItem("part")) {
    field_part.value = sessionStorage.getItem("part")
  }
  if (sessionStorage.getItem("type_pki")) {
    document.getElementById("serial_number").focus()
  } else {
    document.getElementById("ean_code").focus()
  }
}

//валидация формы добавления и редактирования ПКИ
(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation')
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
  }, false)
})()

function plusOne(number) {
  let indexChar = 0
  for (let index = 0; index < number.length; index++) {
    if (!/\d/.test(number[index])) {
      indexChar = index
    }
  }
  let first_part = number.slice(0, indexChar + 1)
  let second_part = number.slice(indexChar + 1)
  return first_part + (parseInt(second_part) + 1)
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

function searchEAN(valueEAN) {
  let data = {
    valueEAN: valueEAN
  }
  postData('/pkis/searchEAN', data)
    .then((data) => {
      if (data != 'none') {
        document.getElementById('type_pki').value = data.type_pki
        document.getElementById('vendor').value = data.vendor
        document.getElementById('model').value = data.model
        document.getElementById('country').value = data.country
      } else {
        document.getElementById('type_pki').value = ''
        document.getElementById('vendor').value = ''
        document.getElementById('model').value = ''
        document.getElementById('country').value = ''
      }
    })
}

function load_part_navbar() {
  postData('/pcPa/part')
    .then((data) => {
      if (data) {
        CreateSelectNavbar(data.parts, function () {
          if (data.currentPartId) {
            document.getElementById('part_select_navbar').value = data.currentPartId
          }
        })
      }
    })
}

function CreateSelectNavbar(data, callback) {
  let select = document.getElementById('part_select_navbar')
  for (let i = 0; i < data.length; i++) {
    let option = document.createElement("option")
    option.text = data[i].part
    option.value = data[i]._id
    select.appendChild(option)
  }
  callback()
}

function changeSelect(selectedItem) {
  let data = {
    selectedItem: selectedItem
  }
  postData('/insert_part_session', data)
    .then((data) => {
      location.reload()
    })
}

function setPage(page) {
  if (page) {
    let data = {
      page: page
    }
    postData('/pcPa/setPage', data)
      .then((data) => {})
  }
}

function on(elSelector, eventName, selector, fn) {
  var element = document.querySelector(elSelector)
  element.addEventListener(eventName, function(event) {
      var possibleTargets = element.querySelectorAll(selector)
      var target = event.target
      for (var i = 0, l = possibleTargets.length; i < l; i++) {
          var el = target
          var p = possibleTargets[i]
          while(el && el !== element) {
              if (el === p) {
                  return fn.call(p, event)
              }
              el = el.parentNode
          }
      }
  })
}