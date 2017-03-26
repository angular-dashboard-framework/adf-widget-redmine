(function(window, undefined) {'use strict';


angular.module('adf.widget.redmine', ['adf.provider', 'smart-table'])
  .constant("redmineEndpoint", "http://www.redmine.org/")
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('redmineIssues', {
        title: 'Redmine Issues',
        description: 'Show Issues of an given Redmine Instance.',
        templateUrl: '{widgetsPath}/redmine/src/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: ["redmineService", function(redmineService){
            return redmineService.getIssues();
          }]
        },
        edit: {
          templateUrl: '{widgetsPath}/redmine/src/issues/edit/edit.html'
        }
      });
  }]);

angular.module("adf.widget.redmine").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/redmine/src/issues/view.html","<table st-table=rowCollection class=\"table table-striped\"><thead><tr><th>ID</th><th>Tracker</th><th>Status</th><th>Thema</th></tr></thead><tbody><tr ng-repeat=\"issue in vm.issues\"><td><a href=\'{{\"http://www.redmine.org/issues/\"+issue.id}}\'>{{issue.id}}</a></td><td>{{issue.tracker.name}}</td><td>{{issue.status.name}}</td><td>{{issue.subject}}</td></tr></tbody></table>");
$templateCache.put("{widgetsPath}/redmine/src/issues/edit/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");}]);


angular.module('adf.widget.redmine')
  .controller('IssueController', ["issues", "config", function(issues, config){
    var vm = this;

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

    function getIssues(){
      return request('issues.json?limit=2');
    }
    return {
      getIssues: getIssues
     };
  }]);
})(window);