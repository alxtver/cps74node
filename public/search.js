function search() {
	let val = document.querySelector('#serial_number').value
	data = {
		val: val
	}
	postData('/search/searchPKI', data)
		.then((data) => {
			let containerPKI = document.querySelector('#resultPKI')
			let containerPC = document.querySelector('#resultPC')
			if (data.pkis.length > 0) {
				CreateTablePKI(data.pkis, containerPKI)
			}
			if (data.pcs.length > 0) {
				CreateTablePC(data.pcs, containerPC)
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
		let numberCell = tr.insertCell(-1)
		numberCell.innerHTML = i + 1
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
		let number_machineCell = tr.insertCell(-1)
		if (data[i].number_machine) {
			number_machineCell.innerHTML = data[i].number_machine
		} else {
			number_machineCell.innerHTML = ''
		}
		let partCell = tr.insertCell(-1)
		partCell.innerHTML = data[i].part
	}
	container.innerHTML = ""
	container.appendChild(table)
}

function CreateTablePC(data, container) {
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
    tr = table.insertRow(-1) // TABLE ROW.        

    td = document.createElement("td")
    td.innerHTML = 'Обозначение изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Наименование изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Характеристика'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Количество'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Заводской номер'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Примечания'
    td.className = "header"
    tr.appendChild(td)
  }

  arr_pc_unit = pc.pc_unit

  for (let j = 0; j < arr_pc_unit.length; j++) {
    tr = table.insertRow(-1)

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.innerHTML = arr_pc_unit[j].fdsi
    fdsiCell.dataset.id = pc._id

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = arr_pc_unit[j].type
    typeCell.dataset.id = pc._id
    typeCell.className = 'type'
    typeCell.contentEditable = 'true'

    let nameCell = tr.insertCell(-1)
    nameCell.innerHTML = arr_pc_unit[j].name
    nameCell.dataset.id = pc._id
    nameCell.className = 'name'
    nameCell.contentEditable = 'true'

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = arr_pc_unit[j].quantity
    quantityCell.dataset.id = pc._id

    let serial_numberCell = tr.insertCell(-1)
    serial_numberCell.innerHTML = arr_pc_unit[j].serial_number
    serial_numberCell.dataset.id = pc._id
    serial_numberCell.dataset.obj = j
    serial_numberCell.dataset.unit = 'pc_unit'
    serial_numberCell.contentEditable = "true"
    if (arr_pc_unit[j].apkzi) {
      serial_numberCell.dataset.apkzi = "apkzi"
      serial_numberCell.contentEditable = "false"
    }
    serial_numberCell.dataset.data = pc._id + ';' + j + ';' + 'pc_unit'
    serial_numberCell.className = 'serial_number'

    let notesCell = tr.insertCell(-1)
    notesCell.innerHTML = arr_pc_unit[j].notes
    notesCell.innerHTML = arr_pc_unit[j].notes
    fdsiCell.dataset.id = pc._id
  }

  if (pc.system_case_unit.length > 0) {
    tr = table.insertRow(-1) // TABLE ROW.        

    td = document.createElement("td")
    td.innerHTML = 'Обозначение изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Наименование изделия'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Характеристика'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Количество'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Заводской номер'
    td.className = "header"
    tr.appendChild(td)

    td = document.createElement("td")
    td.innerHTML = 'Примечания'
    td.className = "header"
    tr.appendChild(td)
  }
  arr_system_case_unit = pc.system_case_unit

  for (let j = 0; j < arr_system_case_unit.length; j++) {
    tr = table.insertRow(-1)

    let fdsiCell = tr.insertCell(-1)
    fdsiCell.innerHTML = arr_system_case_unit[j].fdsi
    fdsiCell.dataset.id = pc._id

    let typeCell = tr.insertCell(-1)
    typeCell.innerHTML = arr_system_case_unit[j].type
    typeCell.dataset.id = pc._id
    typeCell.contentEditable = 'true'

    let nameCell = tr.insertCell(-1)
    nameCell.innerHTML = arr_system_case_unit[j].name
    nameCell.className = 'name'
    nameCell.dataset.id = pc._id
    nameCell.contentEditable = 'true'

    let quantityCell = tr.insertCell(-1)
    quantityCell.innerHTML = arr_system_case_unit[j].quantity
    quantityCell.dataset.id = pc._id

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
    serial_numberCell.contentEditable = "true"

    let notesCell = tr.insertCell(-1)
    notesCell.innerHTML = arr_system_case_unit[j].notes
    notesCell.dataset.id = pc._id
  }
  return table
}