'use strict';

angular.module('adf.widget.redmine')
  .factory('chartDataService', function ($q, redmineService) {

    function moveNewOpenIssues(allIssues, openIssues, date) {
      for (var i = 0; i < allIssues.length; i++) {
        var createDate = new Date(allIssues[i].created_on);
        if (createDate.getTime() <= date.getTime()) {
          openIssues.push(allIssues[i]);
          allIssues.splice(i, 1);
          i--;
        } else {
          // we can stop here, cause the issues are ordered by creation date
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
          }
        }
      }
    }

    function calculateOpenIssuesPerDay(from, to, issues, config) {
      var timeDiff = Math.abs(from.getTime() - to.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var pointThinningRate = diffDays / 10;
      var numberAllIssues = issues.length;
      var idealIssuesPerDay = numberAllIssues / diffDays;
      var idealData = [];
      var openIssues = [];
      var values = [];
      while ((from.getTime() <= to.getTime()) && (values.length < 5000)) {
        moveNewOpenIssues(issues, openIssues, from);
        removeNewClosedIssues(openIssues, from);
        var value = {x: from.toISOString(),y:openIssues.length};
        values.push(value);
        if (config.showIdeal) {
          var idealValue = Math.round((numberAllIssues - idealData.length * idealIssuesPerDay * pointThinningRate)*100) / 100;
          var ideal = {x: from.toISOString(),y:idealValue};
          idealData.push(ideal);
        }
        from.setDate(from.getDate() + pointThinningRate);
      }
      var valueSets = [values];
      if (config.showIdeal) {
        valueSets.push(idealData);
      }
      return valueSets;
    }

    function getChartData(config) {
      return redmineService.getIssuesForChart(config).then(function (issues) {
        //if (vm.config.timespan && vm.config.timespan.fromDateTime && vm.config.timespan.toDateTime)
        var from = new Date(config.timespan.fromDateTime);
        var to = new Date(config.timespan.toDateTime);
        return calculateOpenIssuesPerDay(from, to, issues, config);
      });
    }




    return {
      getChartData: getChartData
    };
  });
