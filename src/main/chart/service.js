'use strict';

function createChartDataService($q, apiService) {
  function moveNewOpenIssues(allIssues, openIssues, date) {
    for (var i = 0; i < allIssues.length; i++) {
      var createDate = new Date(allIssues[i].created_on);
      if (createDate.getTime() <= date.getTime()) {
        openIssues.push(allIssues[i]);
        allIssues.splice(i, 1);
        i--;
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
    var pointThinningRate = timeDiff / config.numberPoints;
    var numberAllIssues = issues.length;
    var idealIssuesPerInterval = numberAllIssues / timeDiff;
    var idealData = [];
    var openIssues = [];
    var values = [];
    while ((from.getTime() <= to.getTime())) {
      moveNewOpenIssues(issues, openIssues, from);
      removeNewClosedIssues(openIssues, from);
      var value = {x: from.toISOString(), y: openIssues.length};
      values.push(value);
      if (config.showIdeal) {
        var idealValue = Math.round((numberAllIssues - idealData.length * idealIssuesPerInterval * pointThinningRate) * 100) / 100;
        var ideal = {x: from.toISOString(), y: idealValue};
        idealData.push(ideal);
      }
      from.setTime(from.getTime() + pointThinningRate);
    }
    var valueSets = [values];
    if (config.showIdeal) {
      valueSets.push(idealData);
    }
    return valueSets;
  }

  function getChartData(config) {
    return apiService.getIssuesForChart(config).then(function (issues) {
      config.numberPoints = 50;
      var from = new Date(config.timespan.fromDateTime);
      var to = new Date(config.timespan.toDateTime);
      return calculateOpenIssuesPerDay(from, to, issues, config);
    });
  }

  return {
    getChartData: getChartData
  };
}

angular.module('adf.widget.redmine')
  .factory('chartDataService', function ($q, redmineService) {
    return createChartDataService($q, redmineService);
  });

angular.module('adf.widget.easyredmine')
  .factory('easyChartDataService', function ($q, easyRedmineService) {
    return createChartDataService($q, easyRedmineService);
  });
