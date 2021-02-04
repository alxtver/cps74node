document.addEventListener("DOMContentLoaded", function () {
  const checkBox = document.querySelector('#checkbox')
  checkBox.addEventListener('change', () => {
    changeSNSelect()
  })
  postData('/spec/getSerials')
    .then((data) => {
      createSelect('#from-select', data.serials)
      createSelect('#to-select', data.serials)
      const count = document.getElementById('count')
      count.innerHTML = '1 из ' + data.serials.length
      changeSNSelect()
      document.querySelector('#overlay').style.display = 'none'
    })
})

function createSelect(selector, data) {
  const select = document.querySelector(selector)
  select.innerHTML = ''
  for (let i = 0; i < data.length; i++) {
    const option = document.createElement("option")
    option.text = data[i].serial_number
    option.value = i
    select.add(option)
  }
  select.addEventListener('change', () => {
    changeSNSelect()
  })
}

function changeSNSelect() {
  const fromSelect = document.querySelector('#from-select')
  const toSelect = document.querySelector('#to-select')
  let fromValue = fromSelect.value
  let toValue = toSelect.value
  const checkBox = document.querySelector('#checkbox')
  if (Number(fromValue) > Number(toValue)) {
    toSelect.value = fromValue
    toValue = fromValue
  }
  data = {
    fromValue: fromValue,
    toValue: toValue,
    checkBox: checkBox.checked
  }
  postData('/spec/getSpec', data)
    .then((data) => {
      const dataDiv = document.querySelector('#data')
      const count = document.getElementById('count')
      const countInner = count.innerHTML.split(' из ')
      if (data.message === 'wrong range!!!') {
        dataDiv.innerHTML = 'wrong range!!!'
        count.innerHTML = '0 из ' + countInner[1]
        dataDiv.classList.remove('tableContent')
      } else {
        dataDiv.innerHTML = ''
        CreateTableFromJSON(data)
        count.innerHTML = data.countPC + ' из ' + countInner[1]
      }
    })
}

function CreateTableFromJSON(data) {
  const col_rus = ["ПКИ", "Количество"]
  const table = document.createElement("table")
  table.className = "table table-bordered table-hover table-striped"
  const thead = table.createTHead()
  let tr = thead.insertRow(-1)
  thead.className = "table-dark"
  for (let i = 0; i < col_rus.length; i++) {
    let th = document.createElement("th")
    th.innerHTML = col_rus[i];
    tr.appendChild(th);
    thead.appendChild(tr)
  }
  // Заполнение таблицы
  let tbody = table.createTBody()
  let sortedData = {}
  if (!data.checkBox) {
    Object.keys(data.spec).sort().forEach(function (key) {
      sortedData[key] = data.spec[key];
    })
  } else {
    sortedData = data.spec
  }

  for (const [key, value] of Object.entries(sortedData)) {
    tr = tbody.insertRow(-1)
    const pki = tr.insertCell(-1)
    pki.style.textAlign = 'center'
    pki.innerHTML = key
    const count = tr.insertCell(-1)
    count.style.textAlign = 'center'
    count.innerHTML = value
  }
  const divContainer = document.getElementById("data")
  divContainer.innerHTML = ""
  divContainer.classList.add("tableContent")
  divContainer.appendChild(table)
}