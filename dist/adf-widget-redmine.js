(function(window, undefined) {'use strict';


angular.module('adf.widget.redmine', ['adf.provider', 'smart-table'])
  .constant("redmineEndpoint", "http://www.redmine.org/")
  .config(["dashboardProvider", function(dashboardProvider){

    var edit = {
      templateUrl: '{widgetsPath}/redmine/src/issues/edit/edit.html',
      controller: 'editController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        projects: ["redmineService", function(redmineService){
          return redmineService.getProjects();
        }]
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
          issues: ["redmineService", "config", function(redmineService, config){
            return redmineService.getIssues(config);
          }]
        },
        edit: edit
      });
  }]);

angular.module("adf.widget.redmine").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/redmine/src/issues/view.html","<table st-table=rowCollection class=\"table table-striped\"><thead><tr><th ng-if=vm.config.columns.id.show>ID</th><th ng-if=vm.config.columns.tracker.show>Tracker</th><th ng-if=vm.config.columns.status.show>Status</th><th ng-if=vm.config.columns.subject.show>Subject</th></tr></thead><tbody><tr ng-repeat=\"issue in vm.issues\"><td ng-if=vm.config.columns.id.show><a href=\'{{\"http://www.redmine.org/issues/\"+issue.id}}\'>{{issue.id}}</a></td><td ng-if=vm.config.columns.tracker.show>{{issue.tracker.name}}</td><td ng-if=vm.config.columns.status.show>{{issue.status.name}}</td><td ng-if=vm.config.columns.subject.show>{{issue.subject}}</td></tr></tbody></table>");
$templateCache.put("{widgetsPath}/redmine/src/issues/edit/edit.html","<form role=form><div class=form-group><label for=project>Project</label><select name=project id=project class=form-control ng-model=config.project><option value=All>All</option><option ng-repeat=\"project in vm.projects | orderBy: \'name\'\" value={{project.id}}>{{project.name}}</option></select></div><div class=form-group><label for=assgined_to_id>Assigned To</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Get issues which are assigned to the given user ID. <me> can be used instead an ID to fetch all issues from the logged in user. Leave empty if you want to see all issues.\"></span> <input name=assigned_to_id id=assgined_to_id class=form-control ng-model=config.assigned_to_id></div><div class=form-group><input type=checkbox name=showClosed ng-model=config.showClosed> Show closed issues</div><div class=form-group><label for=project>Columns to show:</label><li class=list-group-item ng-repeat=\"(key, entry) in vm.possibleColumns\"><input type=checkbox name={{key}} ng-model=config.columns[key].show> {{entry.name}}</li></div></form>");}]);


angular.module('adf.widget.redmine')
  .controller('editController', ["projects", "config", function(projects, config){
    var vm = this;
    vm.possibleColumns = {
      "id":{"name":"ID", "show": true},
      "tracker":{"name":"Tracker","show": true},
      "status":{"name":"Status","show": true},
      "subject":{"name":"Subject","show": true}
    };

    if(angular.equals({},config)) {
      config.columns=vm.possibleColumns;
      config.project="";
      config.assigned_to_id="me";
      config.showClosed=false;
    }

    vm.projects = projects;
  }]);



angular.module('adf.widget.redmine')
  .controller('IssueController', ["issues", "config", function(issues, config){
    var vm = this;
    vm.config = config;
    vm.issues = issues.issues;
  }]);



angular.module('adf.widget.redmine')
  .factory('redmineService', ["$http", "redmineEndpoint", function($http, redmineEndpoint){

    function data(response){
      return response.data;
    }

    function request(param){
      return $http.get(redmineEndpoint+param).then(data);
    }

    function getIssues(config){
      var params=generateIssuesParameter(config);
      return request('issues.json'+params);
    }

    function generateIssuesParameter(data) {
      var params='?';
      if(data.project && data.project !== "All") {
        params+='&project_id='+data.project;
      }
      if(data.assigned_to_id) {
        params+='&assigned_to_id='+data.assigned_to_id;
      }
      if(data.showClosed) {
        params+='&status_id=*';
      }
      return params;
    }

    function getProjects(){
      return request('projects.json').then(function(data){
        return data.projects;
      });
    }

    return {
      getIssues: getIssues,
      getProjects: getProjects
     };
  }]);
})(window);