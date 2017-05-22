'use strict';

angular.module('adf.widget.redmine')
  .controller('ChartController', function (issues, config) {
    //console.log("issues length: " + issues.length);
    var vm = this;
    vm.config = config;
    vm.issues = issues;
    vm.numberAllIssues = issues.length;

    var calculateOpenIssuesPerDay = function (from, to, issues) {
      var timeDiff = Math.abs(from.getTime() - to.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var idealIssuesPerDay = vm.numberAllIssues / diffDays;
      var idealData = [];
      // order issues by creation date
      var openIssues = []; // inv: ordered by "closed_on"
      var dates = [];// x-values
      var values = [];// y-values
      while (from.getTime() <= to.getTime()) {
        moveNewOpenIssues(issues, openIssues, from);
        removeNewClosedIssues(openIssues, from);
        dates.push(from.toDateString());
        var value = openIssues.length;
        values.push(value);
        if(vm.config.showIdeal){
          var idealValue = vm.numberAllIssues - idealData.length*idealIssuesPerDay;
                          console.log(idealValue);
          idealData.push(idealValue);
        }
        from.setDate(from.getDate() + 1); // next day
      }
      var valueSets = [values];
      if(vm.config.showIdeal) {
        valueSets.push(idealData);
      }
      return {
        dates: dates,
        values: valueSets
      }
    }
    var moveNewOpenIssues = function (allIssues, openIssues, date) {
      //console.log("allIssues.length "+allIssues.length);
      for (var i = 0; i < allIssues.length; i++) {
        var createDate = new Date(allIssues[i].created_on);
        //console.log("createDate: "+createDate.toDateString());
        if (createDate.getTime() <= date.getTime()) {
          openIssues.push(allIssues[i]);
          allIssues.splice(i, 1);
          i--;
        } else {
          break;
        }
      }
    }

    var removeNewClosedIssues = function (openIssues, date) {
      for (var i = 0; i < openIssues.length; i++) {
        if (openIssues[i].closed_on) {
          var closeDate = new Date(openIssues[i].closed_on);
          if (closeDate.getTime() <= date.getTime()) {
            openIssues.splice(i, 1);
            i--;
          } else {
            //break;
          }
        }
      }
    }

    if (vm.config.timespan && vm.config.timespan.fromDateTime && vm.config.timespan.toDateTime) {
      var from = new Date(vm.config.timespan.fromDateTime);
      var to = new Date(vm.config.timespan.toDateTime);
      var generatedData = calculateOpenIssuesPerDay(from, to, issues);

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
        series: ["Project ..."],
        class: "chart-line",
        options: options
      };

      if (vm.config.showIdeal){
        vm.chart.series.push("Ideal");
      }

    }
  });
