'use strict';

angular.module('adf.widget.redmine')
  .controller('ChartController', function (chartData, config) {

    var vm = this;
    vm.config = config;

    var generatedData = chartData;

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
      }
    };

    vm.chart = {
      labels: generatedData.dates,
      data: generatedData.values,
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

  });
