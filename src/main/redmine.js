'use strict';

angular.module('adf.widget.redmine', ['adf.provider', 'chart.js', 'ui.bootstrap.datepicker'])
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
      .widget('redmine-custom-queries', {
        title: 'Redmine Custom Queries',
        description: 'Displays Issues from a Custom Query',
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
      .widget('redmine-my-issues', {
        title: 'My Redmine Issues',
        description: 'Displays all issues assigned to me',
        templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: function (redmineService) {
              return redmineService.getMyIssues();
          }
        }
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
