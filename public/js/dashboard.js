/* globals Chart:false, feather:false */

(function () {
  'use strict'
  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        '01/09',
        '02/09',
        '03/09',
        '04/09',
        '05/09',
        '06/09'
      ],
      datasets: [{
        data: [
          15339,
          21345,
          18483,
          24003,
          23489,
          24092,
          12034,
          34534,
          5455,
          676,
          7879,
          809,
        ],
        label:"Autorizadas",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },{
        data:[
          13978,
          2345,
          1483,
          2003,
          2389,
          242,
          12,
          612,
          812,
          192,
          102,
          0
        ],
        label:"Pendentes",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#ffff40', 
        borderWidth: 4,
        pointBackgroundColor: '#ffff40'
      },{
        data:[
          13,
          234,
          13,
          203,
          289,
          42,
          12,
          5151,
          554,
          4444,
          0
        ],
        label:"Canceladas",
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#f34336', 
        borderWidth: 4,
        pointBackgroundColor: '#f34336'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })

})()
