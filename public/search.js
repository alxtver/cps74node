function search() {
  let val = document.querySelector('#serial_number').value
  data = {
    val: val
  }
  postData('/search/searchPKI', data)
    .then((data) => {
      const containerPKI = document.querySelector('#resultPKI')
      const containerPC = document.querySelector('#resultPC')
      const containerAPKZI = document.querySelector('#resultAPKZI')
      containerPC.innerHTML = ''
      containerPKI.innerHTML = ''
      containerAPKZI.innerHTML = ''
      if (data.message == 'not found') {
        containerPKI.innerHTML = 'Нет результатов...'
      } else {
        if (data.pkis) {
          CreateTablePKI(data.pkis, containerPKI)
        }
        if (data.pcs) {
          CreateTablePC(data.pcs, containerPC, () => {
            const val = document.querySelector('#serial_number').value
            const tds = document.querySelectorAll('td.serial_number')
            for (const td of tds) {
              if (td.innerHTML == val.trim()) {
                td.parentNode.style.background = 'orangered'
                td.parentNode.style.fontWeight = '600'
              }
            }
          })
        }
        if (data.apkzis) {
          CreateTableAPKZI(data.apkzis, containerAPKZI)
        }
      }
    })
}

function CreateTablePKI(data, container) {
  let col_rus = [
    '№',
    'Тип',
    'Производитель',
    'Модель',
    'Серийный номер',
    'Страна производства',
    'Номер машины',
    'Тема'
  ]
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-responsive table-striped"
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "table-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }
  let tbody = table.createTBody()
  for (let i = 0; i < data.length; i++) {
    tr = tbody.insertRow(-1)
    insCell('', tr, i + 1)
    insCell('', tr, data[i].type_pki)
    insCell('', tr, data[i].vendor)
    insCell('', tr, data[i].model)
    insCell('', tr, data[i].serial_number)
    insCell('', tr, data[i].country)
    insCell('', tr, data[i].number_machine)
    insCell('', tr, data[i].part)
  }
  container.innerHTML = ""
  container.appendChild(table)
}

function CreateTableAPKZI(data, container) {
  let col_rus = [
    "№",
    "ФДШИ",
    "Наим. АПКЗИ",
    "Наим. контроллера СЗИ",
    "ФДШИ контроллера",
    "Зав. номер",
    "Зав. номер контроллера",
    "Номер машины",
    'Тема'
  ]
  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table")
  table.className = "table table-sm table-bordered table-hover table-responsive table-striped"
  // TABLE ROW.
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "table-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th") // TABLE HEADER.
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }
  // Заполнение таблицы
  let tbody = table.createTBody()
  for (let i = 0; i < data.length; i++) {
    tr = tbody.insertRow(-1)
    insCell('', tr, i + 1)
    insCell('', tr, data[i].fdsi)
    insCell('', tr, data[i].apkzi_name)
    insCell('', tr, data[i].kont_name)
    insCell('', tr, data[i].fdsiKontr)
    insCell('', tr, data[i].zav_number)
    insCell('', tr, data[i].kontr_zav_number)
    insCell('', tr, data[i].number_machine ? data[i].number_machine : '')
    insCell('', tr, data[i].part)
  }
  container.innerHTML = ""
  container.appendChild(table)
}

function CreateTablePC(data, container, callback) {
  container.innerHTML = ""
  for (let i = 0; i < data.length; i++) {
    table = tablePC(data[i], 'all', true,
      'fdsi',
      'type',
      'name',
      'quantity',
      'serial_number',
      'notes'
    )
    let divCont = document.createElement("div")
    divCont.id = data[i]._id
    divCont.className = "pcCard mb-3"
    divCont.style.cssText = '-webkit-box-shadow: 0 30px 60px 0' + data[i].back_color + ';box-shadow: 0 30px 60px 0' + data[i].back_color
    container.appendChild(divCont);
    divCont.innerHTML = ""
    divCont.appendChild(table)
    const part = document.querySelectorAll('.up')
    part[part.length - 1].innerHTML = data[i].part
    part[part.length - 1].style.fontSize = '1.2rem'
  }
  callback()
}