google.charts.load("current", {packages: ["corechart"]})
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  $.ajax({
    url: "/diagram",
    type: "POST",
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    success: function (arr) {
      var data = google.visualization.arrayToDataTable(arr)
      var options = {
        title: 'Проекты',
        pieHole: 0.4
      }
      var chart = new google.visualization.PieChart(document.getElementById('partChart'))
      chart.draw(data, options)
    }
  })
}

$(window).resize(function () {
  drawChart()
})