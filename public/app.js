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
  localStorage.ean_code = document.getElementById("ean_code").value
  localStorage.type_pki = document.getElementById("type_pki").value
  localStorage.vendor = document.getElementById("vendor").value
  localStorage.model = document.getElementById("model").value
  localStorage.country = document.getElementById("country").value
  localStorage.part = document.getElementById("part").value

  let field_serial_number = document.getElementById("serial_number").value
  if (field_serial_number) {
    let array = localStorage.snList
    let snArr = []
    if (array && array.length > 0) snArr = array.split(',')
    if (snArr.length > 10) snArr.pop()
    snArr.unshift(field_serial_number)
    localStorage.snList = snArr
  }
}

// выгрузка данных из сессии браузера
function loadSession() {
  document.getElementById("ean_code").value = localStorage.ean_code || ''
  document.getElementById("type_pki").value = localStorage.type_pki || ''
  document.getElementById("vendor").value = localStorage.vendor || ''
  document.getElementById("model").value = localStorage.model || ''
  document.getElementById("country").value = localStorage.country || ''
  document.getElementById("part").value = localStorage.part || ''
  if (localStorage.type_pki) {
    document.getElementById("serial_number").focus()
  } else {
    document.getElementById("ean_code").focus()
  }
  let array = localStorage.snList
  if (array) snList(array.split(','))
}

// function plusOne(number) {
//   let indexChar = 0
//   for (let index = 0; index < number.length; index++) {
//     if (!/\d/.test(number[index])) indexChar = index
//   }
//   let firstPart = number.slice(0, indexChar + 1)
//   let secondPart = number.slice(indexChar + 1)
//   const lengthSecondPart = secondPart.length
//   const secondPartPlusOne = parseInt(secondPart) + 1
//   return firstPart + secondPartPlusOne.toString().padStart(lengthSecondPart, '0')
// }

// function minusOne(number) {
//   let indexChar = 0
//   for (let index = 0; index < number.length; index++) {
//     if (!/\d/.test(number[index])) indexChar = index
//   }
//   let firstPart = number.slice(0, indexChar + 1)
//   let secondPart = number.slice(indexChar + 1)
//   const lengthSecondPart = secondPart.length
//   const secondPartMinusOne = parseInt(secondPart) - 1
//   return firstPart + secondPartMinusOne.toString().padStart(lengthSecondPart, '0')
// }

function calc(number) {
  let indexChar = 0
  for (let index = 0; index < number.length; index++) {
    if (!/\d/.test(number[index])) indexChar = index
  }
  let firstPart = number.slice(0, indexChar + 1)
  let secondPart = number.slice(indexChar + 1)
  const lengthSecondPart = secondPart.length
  const secondPartPlusOne = parseInt(secondPart) + 1
  const secondPartMinusOne = parseInt(secondPart) - 1
  return {
    plusOne: function () {
      return firstPart + secondPartPlusOne.toString().padStart(lengthSecondPart, '0')
    },
    minusOne: function () {
      return firstPart + secondPartMinusOne.toString().padStart(lengthSecondPart, '0')
    }
  }
}

// добавление данных в сессию браузера
function addSessionApkzi() {
  localStorage.fdsi = document.getElementById("fdsi").value
  localStorage.apkzi_name = document.getElementById("apkzi_name").value
  localStorage.kont_name = document.getElementById("kont_name").value
  localStorage.fdsiKontr = document.getElementById("fdsiKontr").value
  localStorage.zav_number = document.getElementById("zav_number").value
  localStorage.kontr_zav_number = document.getElementById("kontr_zav_number").value
  localStorage.part = document.getElementById("part").value
}

// выгрузка данных из сессии браузера
function loadSessionApkzi() {
  document.getElementById("fdsi").value = localStorage.fdsi || ''
  document.getElementById("apkzi_name").value = localStorage.apkzi_name || ''
  document.getElementById("kont_name").value = localStorage.kont_name || ''
  document.getElementById("fdsiKontr").value = localStorage.fdsiKontr || ''
  document.getElementById("zav_number").value = calc(localStorage.zav_number).plusOne() || ''
  document.getElementById("kontr_zav_number").value = calc(localStorage.kontr_zav_number).plusOne() || ''
  document.getElementById("part").value = localStorage.part || ''

  if (localStorage.fdsi) {
    document.getElementById("kontr_zav_number").focus();
  } else {
    document.getElementById("fdsi").focus();
  }
}

function searchEAN(valueEAN) {
  const data = {
    valueEAN: valueEAN
  }
  localStorage.removeItem('countSymbols')
  localStorage.removeItem('snList')
  postData('/pkis/searchEAN', data)
    .then((data) => {
      // console.log(data.ean.countSymbols);
      const type = document.getElementById('type_pki')
      const vendor = document.getElementById('vendor')
      const model = document.getElementById('model')
      const country = document.getElementById('country')
      const serial_number = document.getElementById('serial_number')
      if (data.ean) {
        type.value = data.ean.type_pki
        vendor.value = data.ean.vendor
        model.value = data.ean.model
        country.value = data.ean.country
        serial_number.focus()
        textToSpeech(`${data.ean.type_pki} ${data.ean.vendor}`, 2)
        if (data.ean.countSymbols) {
          localStorage.countSymbols = data.ean.countSymbols
        }
      } else if (data.upcitemdbValue) {
        type.value = ''
        vendor.value = data.upcitemdbValue.items[0].brand.toUpperCase()
        if (data.upcitemdbValue.items[0].model) {
          model.value = data.upcitemdbValue.items[0].model.toUpperCase()
        } else {
          model.value = data.upcitemdbValue.items[0].title.toUpperCase()
        }
        country.value = data.country
      } else {
        type.value = vendor.value = model.value = ''
        country.value = data.country
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
            const partInput = document.getElementById('part')
            if (partInput) {
              const select = document.getElementById('part_select_navbar')
              const selectedPart = select.options[select.selectedIndex].innerHTML
              partInput.value = selectedPart
            }

          })
        }
      })
  }
}

function CreateSelectNavbar(data, callback) {
  const select = document.getElementById('part_select_navbar')
  for (let i = 0; i < data.length; i++) {
    const option = document.createElement("option")
    option.text = data[i].part
    option.value = data[i]._id
    select.appendChild(option)
  }
  callback()
}

function changeSelect(selectedItem) {
  const data = {
    selectedItem: selectedItem
  }
  postData('/insert_part_session', data)
    .then(() => {
      location.reload()
    })
}

function setPage(page) {
  if (page) postData('/pcPa/setPage', {
    page
  })
}

function translate(text) {
  let ruToEnSN = ''
  let enToRuSN = ''
  const ruLet = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ'
  const engLet = 'QWERTYUIOPASDFGHJKLZXCVBNM'
  for (const l of text.toUpperCase()) {
    const ind = ruLet.indexOf(l)
    ruToEnSN += (ind >= 0) ? engLet[ind] : l
  }
  for (const l of text.toUpperCase()) {
    const ind = engLet.indexOf(l)
    enToRuSN += (ind >= 0) ? ruLet[ind] : l
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
  const select = document.querySelector('#type_select_navbar')
  select.innerHTML = ''
  let option = document.createElement("option")
  option.text = '...'
  option.value = '...'
  select.add(option)
  for (const d of data) {
    option = document.createElement("option")
    option.text = d
    option.value = d
    select.add(option)
  }
  callback()
}

function setSoundSessionOn() {
  localStorage.sound = 'on'
  document.getElementById("soundOff").hidden = true
  document.getElementById("soundOn").hidden = false
}

function setSoundSessionOff() {
  localStorage.sound = 'off'
  document.getElementById("soundOff").hidden = false
  document.getElementById("soundOn").hidden = true
  speechSynthesis.cancel()
}

function textToSpeech(text, rate) {
  if (navigator.platform.indexOf('Win') + 1) {
    console.log(navigator.platform, rate)
  } else {
    rate = rate / 10 + 0.8
    console.log(navigator.platform, rate)
  }
  if (localStorage.sound === 'on') {
    const textToSpeech = text
    const ut = new SpeechSynthesisUtterance(textToSpeech)
    ut.lang = 'ru-RU'
    ut.volume = 1
    ut.rate = rate
    ut.pitch = 1.3
    speechSynthesis.speak(ut)
  }
}

function tablePC(pc, units = 'all', contentEditable = true, ...rows) {
  // таблица ПЭВМ
  let table = document.createElement("table")
  table.className = "table table-sm table-bordered table-hover"
  if (units === 'systemCase') {
    table.classList.remove('table-sm')
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
        insCell('', tr, rowsHeaders[row], 'table-dark', '', false)
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
        insCell('', tr, rowsHeaders[row], 'table-dark', '', false)
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

function insCell(unit, parrent, html = '', classN, id, contentEditable, dataset) {
  let cell = parrent.insertCell(-1)
  if (classN) cell.className = classN
  if (id) cell.id = id
  if (contentEditable) cell.contentEditable = contentEditable
  cell.innerHTML = html
  if (id == 'serial_number') {
    if (unit == 'Системный блок' || unit == 'Сетевой фильтр' || unit == 'Гарнитура' || unit == 'Корпус') {
      cell.className = "serial_number number_mashine"
    } else if (unit == 'Вентилятор процессора') {
      cell.innerHTML = 'б/н'
    } else {
      cell.className = "serial_number"
    }
  }
  if (id == 'notes' && unit == 'Системный блок') {
    cell.innerHTML = 'с кабелем питания'
  }
  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      cell.dataset[key] = value
    }
  }
}