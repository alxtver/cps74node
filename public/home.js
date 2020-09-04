google.charts.load("current", {
  packages: ["corechart"]
})

var array
request()

function request() {
  getData('/diagram')
    .then((arr) => {
      array = arr
      google.charts.setOnLoadCallback(drawChart)
    })
}

function drawChart() {
  var data = google.visualization.arrayToDataTable(array)
  var options = {
    title: 'Проекты',
    pieHole: 0.4
  }
  var chart = new google.visualization.PieChart(document.getElementById('partChart'))
  chart.draw(data, options)
}

window.onresize = drawChart