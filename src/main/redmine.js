'use strict';

angular.module('adf.widget.redmine', ['adf.provider', 'chart.js', 'ui.bootstrap.datepicker','ngTable'])
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
        description: 'Shows Issues of a given Redmine Instance',
        templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: function (redmineService, config) {
            if(config.customQuery && config.project){
              return redmineService.getIssuesByQueryId(config.customQuery, config.project);
            }

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
          issues: function (redmineService, config) {
            if(config.project) {
                return redmineService.getIssuesForChart(config);
            }
          }
        },
        edit: editChart
      });
  });
