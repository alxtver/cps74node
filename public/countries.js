document.addEventListener("DOMContentLoaded", function () {
  load_data()
})

function load_data() {
  getData('/countries/load')
    .then((data) => {
      CreateTableFromJSON(data.countries)
    })
}

function CreateTableFromJSON(data) {
  let col_rus = ["#", "Страна производитель"]
  // CREATE DYNAMIC TABLE.
  let table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover table-responsive table-striped"
  // TABLE ROW.
  let thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "table-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th") // TABLE HEADER.
    th.rowSpan = 2
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }
  let th = document.createElement("th")
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

    const buttonCell = tr.insertCell(-1)
    buttonCell.className = 'buttons'
    const id = data[i]._id
    const editBtn = document.createElement('button')
    editBtn.addEventListener('click', () => {
      location.href = "/countries/" + id + "/edit?allow=true"
    })
    editBtn.className = 'btn_f'
    const faEdit = document.createElement('i')
    faEdit.className = 'bi bi-pencil-fill'
    editBtn.appendChild(faEdit)
    buttonCell.appendChild(editBtn)
    const delBtn = document.createElement('button')
    delBtn.className = 'btn_d delBtn'
    delBtn.dataset.id = id
    delBtn.dataset.toggle = 'modal'
    delBtn.dataset.target = '#modalDel'
    const faDel = document.createElement('i')
    faDel.className = 'bi bi-trash-fill'
    delBtn.appendChild(faDel)
    delBtn.addEventListener('click', () => {
      document.getElementById('hidId').value = id
    })
    buttonCell.appendChild(delBtn)
  }
  const divContainer = document.getElementById("showData")
  divContainer.innerHTML = ""
  divContainer.className = "tableContent table-responsive"
  divContainer.appendChild(table)
}

function thisID(id) {
  document.getElementById('hidId').value = id
}

function delBtn() {
  let id = document.getElementById('hidId').value
  let data = {
    id: id
  }
  postData('/countries/del', data)
    .then(() => {
      load_data()
    })
}