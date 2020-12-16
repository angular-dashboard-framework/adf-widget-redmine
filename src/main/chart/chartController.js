'use strict';

function createChartController(vm, chartData, config) {
  vm.config = config;
  var options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          display: true,
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Open Issues'
          }
        }
      ],
      xAxes: [
        {
          id: 'x-axis-1',
          type: 'time', time: {
            displayFormats: {
              day: 'D.MMM',
              week: 'D.MMM',
              month: 'MMM/YY',
              quarter: '[Q]Q - YYYY',
              year: 'YYYY'
            }
          }
        }
      ]
    },
    legend: {
      display: true,
      position: "bottom"
    },
    responsive: true
  };

  vm.chart = {
    data: chartData,
    series: [],
    class: "chart-line",
    options: options
  };

  if (vm.config.project && vm.config.project !== 'All') {
    vm.chart.series.push(angular.fromJson(vm.config.project).name);
  } else {
    vm.chart.series.push("All Projects");
  }

  if (vm.config.showIdeal) {
    vm.chart.series.push("Ideal");
  }
}

angular.module('adf.widget.redmine')
  .controller('chartController', function (chartData, config) {
    return createChartController(this, chartData, config);
  });

angular.module('adf.widget.easyredmine')
  .controller('easyChartController', function (chartData, config) {
    return createChartController(this, chartData, config);
  });
