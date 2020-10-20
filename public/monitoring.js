function loadSN() {
  document.getElementById('overlay').style.display = 'block'
  postData('/assembly/serialNumbers')
    .then((data) => {
      createGrid(data)
      document.getElementById('overlay').style.display = 'none'
      paintingAllItem(data)
    })
}

function createGrid(data) {
  const container = document.getElementById("grid")
  const len = data.length
  if (len > 200) {
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))'
    container.style.fontSize = '1rem'
  } else if (len > 100) {
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'
    container.style.fontSize = '1.5rem'
  } else if (len > 50) {
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))'
    container.style.fontSize = '1.8rem'
  } else if (len > 10) {
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(400px, 1fr))'
    container.style.fontSize = '2rem'
  } else {
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(500px, 1fr))'
    container.style.fontSize = '3rem'
  }
  for (const i of data) {
    const div = document.createElement('div')
    div.className = 'divGrid'
    div.innerHTML = i.serial_number
    div.id = i._id
    container.appendChild(div)
  }
}

function paintingAllItem(data) {
  for (const pc of data) {
    paintingOneItem(pc)
  }
}

function paintingOneItem(pc) {
  const item = document.getElementById(pc._id)
  item.className = 'divGrid'
  let isAllPCUnit = true
  let isAllSystemCaseUnit = true
  for (const unit of pc.pc_unit) {
    if (pc.pc_unit.length > 0) {
      if (unit.name == '' && unit.type != 'Системный блок' || unit.name == 'Н/Д' || unit.serial_number == '') {
        isAllPCUnit = false
        break
      }
    }
    if (pc.system_case_unit.length > 0) {
      for (const unit of pc.system_case_unit) {
        if (unit.type == '' || unit.name == '' || unit.name == 'Н/Д' || unit.serial_number == '') {
          isAllSystemCaseUnit = false
          break
        }
      }
    }
  }
  if (isAllPCUnit && isAllSystemCaseUnit) {
    item.classList.add('divGridAllOk')
  } else if (isAllSystemCaseUnit) {
    item.classList.add('divGridSystemOk')
  } else {
    item.classList.add('divGridNotOk')
  }
}

function websocketUpdate(id, userName) {
  const user = document.getElementById('userName').value
  if (userName != user) {
    const data = {
      id: id
    }
    postData('/assembly/getPCById', data)
      .then((data) => {
        paintingOneItem(data)
        const item = document.getElementById(data._id)
        item.classList.add('pcCardAssemblyUpdate')
      })
  }
}