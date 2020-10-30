function snList(arr) {
  let cont = document.getElementById('snBar')
  cont.innerHTML = ''
  for (let i = 0; i < arr.length; i++) {
    let p = document.createElement('p')
    p.innerHTML = arr[i]
    p.style.opacity = 1 / (i + 2)
    p.style.fontWeight = 700
    p.className = 'noneSelect'
    cont.appendChild(p)
  }
}

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
  if (field_serial_number) {
    sessionStorage.getItem('snList')
    let array = sessionStorage.getItem('snList')
    let snArr = []
    if (array && array.length > 0) {
      snArr = array.split(',')
    }
    if (snArr.length > 10) {
      snArr.pop()
    }
    snArr.unshift(field_serial_number)
    sessionStorage.setItem('snList', snArr)
  }
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
  let array = sessionStorage.getItem('snList')
  if (array) {
    snList(array.split(','))
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
  let firstPart = number.slice(0, indexChar + 1)
  let secondPart = number.slice(indexChar + 1)
  const lengthSecondPart = secondPart.length
  const secondPartPlusOne = parseInt(secondPart) + 1
  return firstPart + secondPartPlusOne.toString().padStart(lengthSecondPart, '0')
}

function minusOne(number) {
  let indexChar = 0
  for (let index = 0; index < number.length; index++) {
    if (!/\d/.test(number[index])) {
      indexChar = index
    }
  }
  let firstPart = number.slice(0, indexChar + 1)
  let secondPart = number.slice(indexChar + 1)
  const lengthSecondPart = secondPart.length
  const secondPartPlusOne = parseInt(secondPart) - 1
  return firstPart + secondPartPlusOne.toString().padStart(lengthSecondPart, '0')
}



// добавление данных в сессию браузера
function addSessionApkzi() {
  sessionStorage.setItem("fdsi", document.getElementById("fdsi").value)
  sessionStorage.setItem("apkzi_name", document.getElementById("apkzi_name").value)
  sessionStorage.setItem("kont_name", document.getElementById("kont_name").value)
  sessionStorage.setItem("fdsiKontr", document.getElementById("fdsiKontr").value)
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

  let field_fdsiKontr = document.getElementById("fdsiKontr")
  if (sessionStorage.getItem("fdsiKontr")) {
    field_fdsiKontr.value = sessionStorage.getItem("fdsiKontr")
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
    field_kontr_zav_number.focus();
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
        document.getElementById('serial_number').focus()
      } else {
        document.getElementById('type_pki').value = ''
        document.getElementById('vendor').value = ''
        document.getElementById('model').value = ''
        document.getElementById('country').value = ''
      }
    })
}

function load_part_navbar() {
  if (document.location.pathname != '/auth/login') {
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
  element.addEventListener(eventName, function (event) {
    var possibleTargets = element.querySelectorAll(selector)
    var target = event.target
    for (var i = 0, l = possibleTargets.length; i < l; i++) {
      var el = target
      var p = possibleTargets[i]
      while (el && el !== element) {
        if (el === p) {
          return fn.call(p, event)
        }
        el = el.parentNode
      }
    }
  })
}

function translate(text) {
  let ruToEnSN = ''
  let enToRuSN = ''
  const ruLet = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ'
  const engLet = 'QWERTYUIOPASDFGHJKLZXCVBNM'
  for (const l of text.toUpperCase()) {
    let ind = ruLet.indexOf(l)
    if (ind >= 0) {
      ruToEnSN += engLet[ind]
    } else {
      ruToEnSN += l
    }
  }
  for (const l of text.toUpperCase()) {
    let ind = engLet.indexOf(l)
    if (ind >= 0) {
      enToRuSN += ruLet[ind]
    } else {
      enToRuSN += l
    }
  }
  return {
    ruToEnSN: ruToEnSN,
    enToRuSN: enToRuSN
  }
}

function autocomplete(inp, arr) {
  var currentFocus
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      let subs = arr[i].substr(0, val.length).toUpperCase()
      if (subs == val.toUpperCase() || subs == translate(val).ruToEnSN || subs == translate(val).enToRuSN) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  })

  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  })

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function CreateSelectType(data, callback) {
  let select = document.querySelector('#type_select_navbar')
  let option = document.createElement("option")
  option.text = '...'
  option.value = '...'
  select.add(option)
  for (let i = 0; i < data.length; i++) {
    option = document.createElement("option")
    option.text = data[i]
    option.value = data[i]
    select.add(option)
  }
  callback()
}

function setSoundSessionOn() {
  sessionStorage.setItem("sound", "on")
  document.getElementById("soundOff").hidden = true
  document.getElementById("soundOn").hidden = false
}

function setSoundSessionOff() {
  sessionStorage.setItem("sound", "off")
  document.getElementById("soundOff").hidden = false
  document.getElementById("soundOn").hidden = true
  speechSynthesis.cancel()
}