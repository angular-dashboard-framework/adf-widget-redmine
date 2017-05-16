(function(window, undefined) {'use strict';


angular.module('adf.widget.redmine', ['adf.provider', 'smart-table', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant("redmineEndpoint", "http://www.redmine.org/")
  .config(["dashboardProvider", function (dashboardProvider) {

    var editIssues = {
      templateUrl: '{widgetsPath}/redmine/src/issues/edit/edit.html',
      controller: 'editController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        projects: ["redmineService", function (redmineService) {
          return redmineService.getProjects();
        }]
      }
    };

    var editChart = {
      templateUrl: '{widgetsPath}/redmine/src/chart/edit/edit.html',
      controller: 'editController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        projects: ["redmineService", function (redmineService) {
          return redmineService.getProjects();
        }]
      }
    };

    dashboardProvider
      .widget('redmine-issues', {
        title: 'Redmine Issues',
        description: 'Shows Issues of a given Redmine Instance',
        templateUrl: '{widgetsPath}/redmine/src/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: ["redmineService", "config", function (redmineService, config) {
            return redmineService.getIssues(config);
          }]
        },
        edit: editIssues
      });

    dashboardProvider
      .widget('redmine-chart', {
        title: 'Redmine Chart',
        description: 'Displays a burnup or burndown chart',
        templateUrl: '{widgetsPath}/redmine/src/chart/view.html',
        controller: 'ChartController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: ["redmineService", "config", function (redmineService, config) {
            return redmineService.getIssues(config);
          }]
        },
        edit: editChart
      });
  }]);

angular.module("adf.widget.redmine").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/redmine/src/chart/view.html","<div class=\"alert alert-info\" ng-if=!vm.chart>Please configure the widget</div><div ng-if=vm.chart><canvas id=line class=\"chart chart-line\" chart-data=vm.chart.data chart-labels=vm.chart.labels chart-series=vm.chart.series chart-options=vm.chart.options></canvas></div>");
$templateCache.put("{widgetsPath}/redmine/src/issues/view.html","<table st-table=rowCollection class=\"table table-striped\"><thead><tr><th ng-if=vm.config.columns.id.show>ID</th><th ng-if=vm.config.columns.tracker.show>Tracker</th><th ng-if=vm.config.columns.status.show>Status</th><th ng-if=vm.config.columns.subject.show>Subject</th></tr></thead><tbody><tr ng-repeat=\"issue in vm.issues\"><td ng-if=vm.config.columns.id.show><a href=\'{{\"http://www.redmine.org/issues/\"+issue.id}}\'>{{issue.id}}</a></td><td ng-if=vm.config.columns.tracker.show>{{issue.tracker.name}}</td><td ng-if=vm.config.columns.status.show>{{issue.status.name}}</td><td ng-if=vm.config.columns.subject.show>{{issue.subject}}</td></tr></tbody></table>");
$templateCache.put("{widgetsPath}/redmine/src/chart/edit/edit.html","<form role=form><div class=form-group><label for=project>Project</label><select name=project id=project class=form-control ng-model=config.project><option value=All>All</option><option ng-repeat=\"project in vm.projects | orderBy: \'name\'\" value={{project.id}}>{{project.name}}</option></select></div><div class=form-group><label for=assgined_to_id>Assigned To</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Get issues which are assigned to the given user ID. <me> can be used instead an ID to fetch all issues from the logged in user. Leave empty if you want to see all issues.\"></span> <input name=assigned_to_id id=assgined_to_id class=form-control ng-model=config.assigned_to_id></div><div><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup1.opened ng-model=vm.config.timespan.fromDateTime placeholder=from show-button-bar=false type=text uib-datepicker-popup={{format}}> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open1() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup2.opened ng-model=vm.config.timespan.toDateTime placeholder=to show-button-bar=false type=text uib-datepicker-popup={{format}}> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open2() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></form>");
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
  .controller('editController', ["projects", "config", function (projects, config) {
    var vm = this;
    vm.config = config;

    if (angular.equals({}, config)) {
      config.project = "";
      config.assigned_to_id = "me";
      config.showClosed = true;
    }

    if (!vm.config.timespan) {
      vm.config.timespan = {};
    }
    // convert strings to date objects
    if (vm.config.timespan.fromDateTime) {
      vm.config.timespan.fromDateTime = new Date(vm.config.timespan.fromDateTime);
      vm.config.timespan.toDateTime = new Date(vm.config.timespan.toDateTime);
    }

    vm.projects = projects;


    vm.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < vm.events.length; i++) {
          var currentDay = new Date(vm.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return vm.events[i].status;
          }
        }
      }
      return '';
    }
    if (!vm.dateOptions) {
      vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    }

    vm.toggleMin = function () {
      vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
      vm.dateOptions.minDate = vm.inlineOptions.minDate;
    };

    vm.toggleMin();

    vm.open1 = function () {
      vm.popup1.opened = true;
    };

    vm.open2 = function () {
      vm.popup2.opened = true;
    };

    vm.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.popup1 = {
      opened: false
    };

    vm.popup2 = {
      opened: false
    };

  }]);



angular.module('adf.widget.redmine')
  .controller('IssueController', ["issues", "config", function(issues, config){
    var vm = this;
    vm.config = config;
    vm.issues = issues.issues;
  }]);



angular.module('adf.widget.redmine')
  .controller('ChartController', ["issues", "config", function (issues, config) {
    //console.log("issues length: " + issues.length);
    var vm = this;
    vm.config = config;
    vm.issues = issues;

    var calculateOpenIssuesPerDay = function (from, to, issues) {
      // order issues by creation date
      var openIssues = []; // inv: ordered by "closed_on"
      var dates = [];// x-values
      var values = [];// y-values
      while (from.getTime() <= to.getTime()) {
        moveNewOpenIssues(issues, openIssues, from);
        removeNewClosedIssues(openIssues, from);
        dates.push(from.toDateString());
        values.push(openIssues.length)
        from.setDate(from.getDate() + 1); // next day
      }
      return {
        dates: dates,
        values: values
      }
    }
    var moveNewOpenIssues = function (allIssues, openIssues, date) {
      //console.log("allIssues.length "+allIssues.length);
      for (var i = 0; i < allIssues.length; i++) {
        var createDate = new Date(allIssues[i].created_on);
        //console.log("createDate: "+createDate.toDateString());
        if (createDate.getTime() <= date.getTime()) {
          openIssues.push(allIssues[i]);// should be still sorted
          allIssues.splice(i, 1);
          i--;
        } else {
          //break;
        }
      }
    }
    var removeNewClosedIssues = function (openIssues, date) {
      for (var i = 0; i < openIssues.length; i++) {
        if (openIssues[i].closed_on) {
          var closeDate = new Date(openIssues[i].closed_on);
          //console.log("closeDate: " + closeDate.toDateString());
          if (closeDate.getTime() <= date.getTime()) {
            openIssues.splice(i, 1);
            i--;
          } else {
            //break;
          }
        }
      }
    }

    var from = new Date(vm.config.timespan.fromDateTime);
    var to = new Date(vm.config.timespan.toDateTime);
    var generatedData = calculateOpenIssuesPerDay(from, to, issues);

    var options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            display: true,
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Open Issues'
            }
          }
        ]
      },
      legend: {
        display: true,
        position: "bottom"
      }
    };

    vm.chart = {
      labels: generatedData.dates,
      data: [generatedData.values],
      series: ["Project ..."],
      class: "chart-line",
      options: options
    };
  }]);



angular.module('adf.widget.redmine')
  .factory('redmineService', ["$http", "redmineEndpoint", function($http, redmineEndpoint){

    function extractData(response){
      return response.data;
    }

    function request(param){
      return $http.get(redmineEndpoint+param).then(extractData);
    }

    function getIssues(config){
      var allIssues = [];
      var params=generateIssuesParameter(config);
      var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
      return collectPageIssues(params, allIssues, 0, limit);
    }

    function collectPageIssues(params, allIssues, offset, limit){
      return request('issues.json'+params+'&offset='+offset).then(function(issues){
        angular.forEach(issues.issues, function(issue){
          allIssues.push(issue);
        });
        if(issues.total_count > allIssues.length && allIssues.length < limit) {
          return collectPageIssues(params, allIssues, offset+100, limit);
        }
        return allIssues;
      });
    }

    function generateIssuesParameter(data) {
      var params = '?limit=100';
      if (data.project && data.project !== "All") {
        params += '&project_id=' + data.project;
      }
      if (data.assigned_to_id) {
        params += '&assigned_to_id=' + data.assigned_to_id;
      }
      if (data.showClosed) {
        params += '&status_id=*';
      }
      if (data.timespan.fromDateTime && data.timespan.toDateTime) {
        var fromDate = new Date(data.timespan.fromDateTime);
        var toDate = new Date(data.timespan.toDateTime);

        params += '&created_on=%3E%3C' + dateToYMD(fromDate) + '|' + dateToYMD(toDate);
      }
      return params;
    }

    function dateToYMD(date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
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