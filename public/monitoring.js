function loadSN() {
  postData('/assembly/serialNumbers')
    .then((data) => {
      createGrid(data)
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
    div.innerHTML = i
    container.appendChild(div)
  }
}