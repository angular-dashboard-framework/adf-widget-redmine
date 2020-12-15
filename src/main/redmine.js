'use strict';

function createCustomQueriesEditController(isEasy) {
  return {
    templateUrl:  isEasy ? '{widgetsPath}/redmine/src/main/issues/edit/easyedit.html' : '{widgetsPath}/redmine/src/main/issues/edit/edit.html',
    controller: isEasy ? 'easyEditIssuesController' : 'editIssuesController',
    controllerAs: 'vm',
    resolve: {
      /** @ngInject **/
      projects: function (redmineService, easyRedmineService) {
        if (isEasy) {
          return easyRedmineService.getProjects();
        } else {
          return redmineService.getProjects();
        }
      },
      /** @ngInject **/
      customQueries: function (redmineService, easyRedmineService) {
        if (isEasy) {
          return easyRedmineService.getCustomQueries().then(function (data){
            return data.easy_queries;
          });
        } else {
          return redmineService.getCustomQueries().then(function (data){
            return data.queries;
          });
        }
      }
    }
  };
}

function createChartEditController(isEasy) {
  return {
    templateUrl: '{widgetsPath}/redmine/src/main/chart/edit/edit.html',
    controller: isEasy ? 'easyEditChartController' : 'editChartController',
    controllerAs: 'vm',
    resolve: {
      /** @ngInject **/
      projects: function (redmineService, easyRedmineService) {
        if (isEasy) {
          return easyRedmineService.getProjects();
        } else {
          return redmineService.getProjects();
        }
      }
    }
  };
}

function createCustomQueriesWidget(dashboardProvider, widgetID, title, category, isEasy) {
  dashboardProvider
    .widget(widgetID, {
      title: title,
      description: 'Displays issues from a custom query',
      category: category,
      templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
      controller: isEasy ? 'easyIssueController' : 'issueController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        issues: function (redmineService, easyRedmineService, config) {
          if (config.customQuery) {
            if (isEasy) {
              return easyRedmineService.getIssuesByQueryId(config.customQuery.id, config.project.id);
            } else {
              return redmineService.getIssuesByQueryId(config.customQuery.id, config.customQuery.project_id);
            }
          }
        }
      },
      edit: createCustomQueriesEditController(isEasy)
    });
}

function createMyIssuesWidget(dashboardProvider, widgetID, title, category, isEasy) {
  dashboardProvider
    .widget(widgetID, {
      title: title,
      description: 'Displays all issues assigned to me',
      category: category,
      templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
      controller: isEasy ? 'easyIssueController' : 'issueController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        issues: function (redmineService, easyRedmineService) {
          if (isEasy) {
            return easyRedmineService.getMyIssues();
          } else {
            return redmineService.getMyIssues();
          }
        }
      }
    });
}

function createChartWidget(dashboardProvider, widgetID, title, category, isEasy) {
  dashboardProvider
    .widget(widgetID, {
      title: title,
      description: 'Displays a burnup or burndown chart',
      category: category,
      templateUrl: '{widgetsPath}/redmine/src/main/chart/view.html',
      controller: isEasy ? 'easyChartController' : 'chartController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        chartData: function (chartDataService, easyChartDataService, config) {
          if (config.project) {
            if (isEasy) {
              return easyChartDataService.getChartData(config);
            } else {
              return chartDataService.getChartData(config);
            }
          }
        }
      },
      edit: createChartEditController(isEasy)
    });

}

angular.module('adf.widget.redmine', ['adf.provider', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant('redmineEndpoint', 'http://192.168.56.2/redmine/')
  .constant('redmineRedirectEndpoint', null)
  .config(function (dashboardProvider) {
    var category = 'Redmine';

    // Create widgets
    createMyIssuesWidget(dashboardProvider, 'redmine-my-issues', 'My Issues', category, false);
    createCustomQueriesWidget(dashboardProvider, 'redmine-custom-queries', 'Custom Queries', category, false);
    createChartWidget(dashboardProvider, 'redmine-chart', 'Chart', category, false);
  });

angular.module('adf.widget.easyredmine', ['adf.provider', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant('easyRedmineEndpoint', 'http://192.168.56.2/easyredmine/')
  .constant('easyRedmineRedirectEndpoint', null)
  .config(function (dashboardProvider) {
    var category = 'EasyRedmine';

    // Create widgets
    createMyIssuesWidget(dashboardProvider, 'easyredmine-my-issues', 'My Issues', category, true);
    createCustomQueriesWidget(dashboardProvider, 'easyredmine-custom-queries', 'Custom Queries', category, true);
    //createChartWidget(dashboardProvider, 'easyredmine-chart', 'Chart', category, true);
  });
