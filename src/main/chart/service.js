'use strict';

angular.module('adf.widget.redmine')
  .factory('chartDataService', function ($q, redmineService) {

    function getChartData(config) {
      return redmineService.getIssuesForChart(config).then(function (issues) {
        //if (vm.config.timespan && vm.config.timespan.fromDateTime && vm.config.timespan.toDateTime)
        var from = new Date(config.timespan.fromDateTime);
        var to = new Date(config.timespan.toDateTime);
        return calculateOpenIssuesPerDay(from, to, issues, config);
      });
    }

    function calculateOpenIssuesPerDay(from, to, issues, config) {
      var timeDiff = Math.abs(from.getTime() - to.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var numberAllIssues = issues.length;
      var idealIssuesPerDay = numberAllIssues / diffDays;
      var idealData = [];
      // order issues by creation date
      var openIssues = []; // inv: ordered by "closed_on"
      var dates = [];// x-values
      var values = [];// y-values
      while (from.getTime() <= to.getTime()) {
        moveNewOpenIssues(issues, openIssues, from);
        removeNewClosedIssues(openIssues, from);
        var value = {x: from.toISOString(),y:openIssues.length};
        values.push(value);
        if (config.showIdeal) {
          var idealValue = numberAllIssues - idealData.length * idealIssuesPerDay;
          var ideal = {x: from.toISOString(),y:idealValue};
          idealData.push(ideal);
        }
        from.setDate(from.getDate() + 1); // next day
      }
      var valueSets = [values];
      if (config.showIdeal) {
        valueSets.push(idealData);
      }
      return {
        values: valueSets
      }
    }

    function moveNewOpenIssues(allIssues, openIssues, date) {
      for (var i = 0; i < allIssues.length; i++) {
        var createDate = new Date(allIssues[i].created_on);
        if (createDate.getTime() <= date.getTime()) {
          openIssues.push(allIssues[i]);
          allIssues.splice(i, 1);
          i--;
        } else {
          break;
        }
      }
    }

    function removeNewClosedIssues(openIssues, date) {
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

    return {
      getChartData: getChartData
    };
  });
