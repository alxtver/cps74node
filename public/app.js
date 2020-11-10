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
  const data = {
    valueEAN: valueEAN
  }
  postData('/pkis/searchEAN', data)
    .then((data) => {
      const type = document.getElementById('type_pki')
      const vendor = document.getElementById('vendor')
      const model = document.getElementById('model')
      const country = document.getElementById('country')
      const serial_number = document.getElementById('serial_number')
      if (!data.message) {
        type.value = data.type_pki
        vendor.value = data.vendor
        model.value = data.model
        country.value = data.country
        serial_number.focus()
      } else {
        type.value = vendor.value = model.value = country.value = ''
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
    if (e.key == 'ArrowDown') {
      currentFocus++;
      addActive(x);
    } else if (e.key == 'ArrowUp') {
      currentFocus--;
      addActive(x);
    } else if (e.key == 'Enter') {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  })

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active")
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
  select.innerHTML = ''
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

function textToSpeech(text, rate) {
  if (sessionStorage.getItem("sound") === 'on') {
    const textToSpeech = text
    const ut = new SpeechSynthesisUtterance(textToSpeech)
    ut.lang = 'ru-RU'
    ut.volume = 1
    ut.rate = rate
    ut.pitch = 1.3
    speechSynthesis.speak(ut)
  }
}

function translit(serialNumber) {
  serialNumber = serialNumber.toUpperCase()
  for (const letter of serialNumber) {
    let codeOfLetter = letter.charCodeAt(0)
    if (codeOfLetter > 122) {
      let ruToEnSN = ''
      const ruLet = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ'
      const engLet = 'QWERTYUIOPASDFGHJKLZXCVBNM'
      for (const l of serialNumber) {
        ind = ruLet.indexOf(l)
        ruToEnSN += (ind >= 0) ? engLet[ind] : l
      }
      serialNumber = ruToEnSN
      break
    }
  }
  return serialNumber
}

function tablePC(pc, units = 'all', contentEditable = true, ...rows) {
  // таблица ПЭВМ
  let table = document.createElement("table")
  table.className = "table table-sm table-bordered table-hover table-responsive pctable"
  if (units === 'systemCase') {
    table.classList.remove('pctable', 'table-sm')
    table.classList.add('assemblytable')
  }
  table.id = pc._id
  let tr = table.insertRow(-1)
  const rowsHeaders = {
    fdsi: 'Обозначение изделия',
    type: 'Наименование изделия',
    name: 'Характеристика',
    quantity: 'Количество',
    serial_number: 'Заводской номер',
    notes: 'Примечания'
  }
  // шапка
  if (units === 'all') {
    insCell('', tr, 'ФДШИ.' + pc.fdsi, 'up', '', false)
  }

  td = document.createElement("td")
  td.innerHTML = pc.serial_number
  td.id = pc.serial_number
  if (units === 'systemCase') {
    td.id = 'serial_number'
  }
  td.style.cssText = 'font-size: 1.5rem;background-color:' + pc.back_color
  tr.appendChild(td)
  insCell('', tr, pc.arm, 'up', '', false)
  insCell('', tr, pc.execution, 'up', '', false)
  if (units === 'all') {
    insCell('', tr, '', 'up', '', false)
  }
  td = document.createElement("td")
  if (pc.attachment) {
    td.innerHTML = pc.attachment
    td.style.cssText = 'font-size: 1.1rem;border-radius: 0px 10px 0px 0px;background-color:' + pc.back_color
  }
  tr.appendChild(td)

  if (units === 'systemCase') {
    const apkziDiv = document.getElementById('apkziDiv')
    apkziDiv.innerHTML = ''
    let arr_pc_unit = pc.pc_unit
    for (let j = 0; j < arr_pc_unit.length; j++) {
      if (arr_pc_unit[j].apkzi && arr_pc_unit[j].serial_number != '') {
        const apkziDiv = document.getElementById('apkziDiv')
        apkziDiv.innerHTML = 'Номер АПКЗИ - ' + arr_pc_unit[j].serial_number
        apkziDiv.style.display = 'block'
      }
    }
  }

  if (units === 'all' || units === 'pcUnit') {
    // заголовок таблицы состава ПЭВМ
    if (pc.pc_unit.length > 0) {
      tr = table.insertRow(-1)
      for (row of rows) {
        insCell('', tr, rowsHeaders[row], 'header', '', false)
      }
    }
    // таблица ПЭВМ
    let arr_pc_unit = pc.pc_unit
    for (let j = 0; j < arr_pc_unit.length; j++) {
      tr = table.insertRow(-1)
      for (row of rows) {
        if (row != 'serial_number') {
          insCell('', tr, arr_pc_unit[j][row], row, '', false, {
            'id': pc._id
          })
        } else {
          let serial_numberCell = tr.insertCell(-1)
          serial_numberCell.innerHTML = arr_pc_unit[j].serial_number
          serial_numberCell.dataset.id = pc._id
          serial_numberCell.dataset.obj = j
          serial_numberCell.dataset.unit = 'pc_unit'
          if (contentEditable) {
            serial_numberCell.contentEditable = "true"
          }
          if (arr_pc_unit[j].apkzi) {
            serial_numberCell.dataset.apkzi = "apkzi"
            serial_numberCell.contentEditable = "false"
          }
          serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'pc_unit'
          serial_numberCell.className = 'serial_number'
          serial_numberCell.addEventListener('keypress', function (e) {
            if (e.key == 'Enter') {
              e.preventDefault()
              const id = e.target.dataset.id
              const obj = e.target.dataset.obj
              const unit = e.target.dataset.unit
              const serial_number = e.target.innerText
              const data_hidd = e.target.dataset.data
              const data_apkzi = e.target.dataset.apkzi
              document.getElementById('hidd_id').value = data_hidd
              if (data_apkzi) {
                edit_serial_number_apkzi(id, obj, unit, serial_number)
              } else {
                edit_serial_number(id, obj, unit, serial_number)
              }
            }
          })
        }
      }
    }
  }
  // таблица системного блока
  if (units === 'all' || units === 'systemCase') {
    if (pc.system_case_unit.length > 0) {
      tr = table.insertRow(-1)
      for (row of rows) {
        insCell('', tr, rowsHeaders[row], 'header', '', false)
      }
    }
    let arr_system_case_unit = pc.system_case_unit
    for (let j = 0; j < arr_system_case_unit.length; j++) {
      tr = table.insertRow(-1)
      for (row of rows) {
        if (row != 'serial_number') {
          insCell('', tr, arr_system_case_unit[j][row], row, '', false, {
            'id': pc._id
          })
        } else {
          let serial_numberCell = tr.insertCell(-1)
          serial_numberCell.innerHTML = arr_system_case_unit[j].serial_number
          serial_numberCell.dataset.id = pc._id
          serial_numberCell.dataset.obj = j
          serial_numberCell.dataset.unit = 'system_case_unit'
          serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'system_case_unit'
          if (arr_system_case_unit[j].szi) {
            serial_numberCell.dataset.apkzi = 'szi'
          }
          serial_numberCell.className = 'serial_number'
          if (contentEditable) {
            serial_numberCell.contentEditable = "true"
            serial_numberCell.addEventListener('keypress', function (e) {
              if (e.key == 'Enter') {
                e.preventDefault()
                const id = e.target.dataset.id
                const obj = e.target.dataset.obj
                const unit = e.target.dataset.unit
                const serial_number = e.target.innerText
                const data_hidd = e.target.dataset.data
                const data_apkzi = e.target.dataset.apkzi
                document.getElementById('hidd_id').value = data_hidd
                if (data_apkzi) {
                  edit_serial_number_apkzi(id, obj, unit, serial_number)
                } else {
                  edit_serial_number(id, obj, unit, serial_number)
                }
              }
            })
          }
        }
      }
    }
  }
  return table
}