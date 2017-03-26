'use strict';

angular.module('adf.widget.redmine', ['adf.provider', 'smart-table'])
  .constant("redmineEndpoint", "http://www.redmine.org/")
  .config(function(dashboardProvider){

    var edit = {
      templateUrl: '{widgetsPath}/redmine/src/issues/edit/edit.html',
      controller: 'editController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        projects: function(redmineService){
          return redmineService.getProjects();
        }
      }
    };

    dashboardProvider
      .widget('redmineIssues', {
        title: 'Redmine Issues',
        description: 'Show Issues of an given Redmine Instance.',
        templateUrl: '{widgetsPath}/redmine/src/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: function(redmineService, config){
            return redmineService.getIssues(config);
          }
        },
        edit: edit
      });
  });
