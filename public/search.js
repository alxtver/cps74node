function search() {
  let val = document.querySelector('#serial_number').value
  data = {
    val: val
  }
  postData('/search/searchPKI', data)
    .then((data) => {
      let containerPKI = document.querySelector('#resultPKI')
      let containerPC = document.querySelector('#resultPC')
      containerPC.innerHTML = ''
      containerPKI.innerHTML = ''
      if (data.pkis.length > 0) {
        CreateTablePKI(data.pkis, containerPKI)
      }
      if (data.pcs.length > 0) {
        CreateTablePC(data.pcs, containerPC, () => {
          let val = document.querySelector('#serial_number').value
          let tds = document.querySelectorAll('tr[data-sn="' + val.trim() + '"]')
          for (const td of tds) {
            console.log(td);
            td.style.background = 'orangered'
            td.style.fontWeight = '600'
          }
        })
      }
      if (data.pkis.length == 0 && data.pcs.length == 0) {
        containerPKI.innerHTML = 'Нет результатов...'
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
  thead.className = "thead-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }
  let tbody = table.createTBody()
  for (let i = 0; i < data.length; i++) {
    tr = tbody.insertRow(-1)
    insCell(tr, i + 1)
    insCell(tr, data[i].type_pki)
    insCell(tr, data[i].vendor)
    insCell(tr, data[i].model)
    insCell(tr, data[i].serial_number)
    insCell(tr, data[i].country)
    insCell(tr, data[i].number_machine)
    insCell(tr, data[i].part)
  }
  container.innerHTML = ""
  container.appendChild(table)
}

function CreateTablePC(data, container, callback) {
  container.innerHTML = ""
  for (let i = 0; i < data.length; i++) {
    table = TablePc(data[i])
    let divCont = document.createElement("div")
    divCont.id = data[i]._id
    divCont.className = "pcCard mb-3"
    divCont.style.cssText = '-webkit-box-shadow: 0 30px 60px 0' + data[i].back_color + ';box-shadow: 0 30px 60px 0' + data[i].back_color
    container.appendChild(divCont);
    divCont.innerHTML = ""
    divCont.appendChild(table)
  }
  callback()
}

function TablePc(pc) {
  // таблица ПЭВМ
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-responsive pctable"
  table.id = pc._id

  let tr = table.insertRow(-1) // TABLE ROW.

  let td = document.createElement("td")
  td.innerHTML = 'ФДШИ.' + pc.fdsi
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.serial_number
  td.id = pc.serial_number
  td.style.cssText = 'font-size: 1.5rem;background-color:' + pc.back_color
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.arm
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  td.innerHTML = pc.execution
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  td.style.cssText = 'font-size: 1.5rem;background-color:' + pc.back_color
  td.innerHTML = pc.part
  td.className = "up"
  tr.appendChild(td)

  td = document.createElement("td")
  if (pc.attachment) {
    td.innerHTML = pc.attachment
    td.style.cssText = 'font-size: 1.1rem;border-radius: 0px 10px 0px 0px;background-color:' + pc.back_color
  }

  tr.appendChild(td)

  if (pc.pc_unit.length > 0) {
    tr = table.insertRow(-1)
    insCell(tr, 'Обозначение изделия', 'header')
    insCell(tr, 'Наименование изделия', 'header')
    insCell(tr, 'Характеристика', 'header')
    insCell(tr, 'Количество', 'header')
    insCell(tr, 'Заводской номер', 'header')
    insCell(tr, 'Примечания', 'header')
  }
  let arr_pc_unit = pc.pc_unit
  for (let j = 0; j < arr_pc_unit.length; j++) {
    tr = table.insertRow(-1)
    tr.dataset.sn = arr_pc_unit[j].serial_number
    insCell(tr, arr_pc_unit[j].fdsi)
    insCell(tr, arr_pc_unit[j].type)
    insCell(tr, arr_pc_unit[j].name)
    insCell(tr, arr_pc_unit[j].quantity)
    insCell(tr, arr_pc_unit[j].serial_number)
    insCell(tr, arr_pc_unit[j].notes)
  }
  if (pc.system_case_unit.length > 0) {
    tr = table.insertRow(-1)
    insCell(tr, 'Обозначение изделия', 'header')
    insCell(tr, 'Наименование изделия', 'header')
    insCell(tr, 'Характеристика', 'header')
    insCell(tr, 'Количество', 'header')
    insCell(tr, 'Заводской номер', 'header')
    insCell(tr, 'Примечания', 'header')
  }
  let arr_system_case_unit = pc.system_case_unit
  for (let j = 0; j < arr_system_case_unit.length; j++) {
    tr = table.insertRow(-1)
    tr.dataset.sn = arr_system_case_unit[j].serial_number
    insCell(tr, arr_system_case_unit[j].fdsi)
    insCell(tr, arr_system_case_unit[j].type)
    insCell(tr, arr_system_case_unit[j].name)
    insCell(tr, arr_system_case_unit[j].quantity)
    insCell(tr, arr_system_case_unit[j].serial_number)
    insCell(tr, arr_system_case_unit[j].notes)
  }
  return table
}

function insCell(parrent, html = '', classN) {
  let cell = parrent.insertCell(-1)
  if (classN) cell.className = classN
  cell.innerHTML = html
}