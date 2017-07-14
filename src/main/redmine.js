'use strict';

angular.module('adf.widget.redmine', ['adf.provider', 'smart-table', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant('redmineEndpoint', 'http://www.redmine.org/')
  .config(function (dashboardProvider) {

    var editIssues = {
      templateUrl: '{widgetsPath}/redmine/src/main/issues/edit/edit.html',
      controller: 'editIssuesController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        projects: function (redmineService) {
          return redmineService.getProjects();
        }
      }
    };

    var editChart = {
      templateUrl: '{widgetsPath}/redmine/src/main/chart/edit/edit.html',
      controller: 'editChartController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        projects: function (redmineService) {
          return redmineService.getProjects();
        }
      }
    };

    dashboardProvider
      .widget('redmine-issues', {
        title: 'Redmine Issues',
        description: 'Shows issues of a given Redmine instance',
        templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: function (redmineService, config) {
            return redmineService.getIssues(config);
          }
        },
        edit: editIssues
      });

    dashboardProvider
      .widget('redmine-chart', {
        title: 'Redmine Chart',
        description: 'Displays a burnup or burndown chart',
        templateUrl: '{widgetsPath}/redmine/src/main/chart/view.html',
        controller: 'ChartController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          chartData: function (chartDataService, config) {
            if(config.project) {
                return chartDataService.getChartData(config);
            }
          }
        },
        edit: editChart
      });
  });
