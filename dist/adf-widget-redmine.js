(function(window, undefined) {'use strict';


angular.module('adf.widget.redmine', ['adf.provider', 'smart-table', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant('redmineEndpoint', 'http://www.redmine.org/')
  .config(["dashboardProvider", function (dashboardProvider) {

    var editIssues = {
      templateUrl: '{widgetsPath}/redmine/src/main/issues/edit/edit.html',
      controller: 'editIssuesController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        projects: ["redmineService", function (redmineService) {
          return redmineService.getProjects();
        }]
      }
    };

    var editChart = {
      templateUrl: '{widgetsPath}/redmine/src/main/chart/edit/edit.html',
      controller: 'editChartController',
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
        templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
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
        templateUrl: '{widgetsPath}/redmine/src/main/chart/view.html',
        controller: 'ChartController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: ["redmineService", "config", function (redmineService, config) {
            if(config.project) {
                return redmineService.getIssues(config);
            }
          }]
        },
        edit: editChart
      });
  }]);

angular.module("adf.widget.redmine").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/redmine/src/chart/view.html","<div class=\"alert alert-info\" ng-if=!vm.chart>Please configure the widget</div><div ng-if=vm.chart><canvas id=line class=\"chart chart-line\" chart-data=vm.chart.data chart-labels=vm.chart.labels chart-series=vm.chart.series chart-options=vm.chart.options></canvas></div>");
$templateCache.put("{widgetsPath}/redmine/src/issues/view.html","<div class=\"alert alert-info\" ng-if=!vm.config.columns>Please configure the widget</div><div ng-if=vm.config.columns><table st-table=rowCollection class=\"table table-striped\"><thead><tr><th ng-if=vm.config.columns.id.show>ID</th><th ng-if=vm.config.columns.tracker.show>Tracker</th><th ng-if=vm.config.columns.status.show>Status</th><th ng-if=vm.config.columns.subject.show>Subject</th></tr></thead><tbody><tr ng-repeat=\"issue in vm.issues\"><td ng-if=vm.config.columns.id.show><a href=http://www.redmine.org/issues/{{issue.id}}>{{issue.id}}</a></td><td ng-if=vm.config.columns.tracker.show>{{issue.tracker.name}}</td><td ng-if=vm.config.columns.status.show>{{issue.status.name}}</td><td ng-if=vm.config.columns.subject.show>{{issue.subject}}</td></tr></tbody></table></div>");
$templateCache.put("{widgetsPath}/redmine/src/chart/edit/edit.html","<form role=form><div class=form-group><label for=project>Filter</label></div><div class=form-group><label for=project>Project</label><select name=project id=project class=form-control ng-model=vm.config.project ng-change=vm.checkUpdates()><option value=All>All</option><option ng-repeat=\"project in vm.projects | orderBy: \'name\'\" value={{project}}>{{project.name}}</option></select></div><p class=input-group>Add Filter<select name=filter id=filter class=form-control ng-model=vm.filterToAdd ng-change=vm.addFilter(vm.filterToAdd)><option ng-repeat=\"filter in vm.filters | orderBy: \'name\'\" value={{filter.id}}>{{filter.name}}</option></select></p><div class=form-group ng-if=vm.config.filterWithVersion ng-init=vm.updateVersions() \"><label for=version>Fixed Version</label><select name=version id=version class=form-control ng-model=vm.config.version ng-change=vm.updateVersionEnd()><option ng-repeat=\"version in vm.versions | orderBy: \'name\'\" value={{version}}>{{version.name}}</option></select></div><div class=form-group><label for=assgined_to_id>Assigned To</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Get issues which are assigned to the given user ID. <me> can be used instead an ID to fetch all issues from the logged in user. Leave empty if you want to see all issues.\"></span> <input name=assigned_to_id id=assgined_to_id class=form-control ng-model=config.assigned_to_id></div><div class=form-group><input type=checkbox name=showIdeal ng-model=config.showIdeal> Show ideal line</div><div><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup1.opened ng-model=vm.config.timespan.fromDateTime placeholder=from show-button-bar=false type=text uib-datepicker-popup={{format}}> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open1() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup2.opened ng-model=vm.config.timespan.toDateTime placeholder=to show-button-bar=false type=text uib-datepicker-popup={{format}}> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open2() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></form>");
$templateCache.put("{widgetsPath}/redmine/src/issues/edit/edit.html","<form role=form><div class=form-group><label for=project>Project</label><select name=project id=project class=form-control ng-model=config.project><option value=All>All</option><option ng-repeat=\"project in vm.projects | orderBy: \'name\'\" value={{project.id}}>{{project.name}}</option></select></div><div class=form-group><label for=assgined_to_id>Assigned To</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Get issues which are assigned to the given user ID. <me> can be used instead an ID to fetch all issues from the logged in user. Leave empty if you want to see all issues.\"></span> <input name=assigned_to_id id=assgined_to_id class=form-control ng-model=config.assigned_to_id></div><div class=form-group><input type=checkbox name=showClosed ng-model=config.showClosed> Show closed issues</div><div class=form-group><label for=project>Columns to show:</label><li class=list-group-item ng-repeat=\"(key, entry) in vm.possibleColumns\"><input type=checkbox name={{key}} ng-model=config.columns[key].show> {{entry.name}}</li></div></form>");}]);


angular.module('adf.widget.redmine')
  .controller('editIssuesController', ["projects", "config", function(projects, config){
    var vm = this;
    console.log('config: '+config);
    vm.possibleColumns = {
      'id':{'name':'ID', 'show': true},
      'tracker':{'name':'Tracker','show': true},
      'status':{'name':'Status','show': true},
      'subject':{'name':'Subject','show': true}
    };

    if(angular.equals({},config)) {
      config.columns=vm.possibleColumns;
      config.project='';
      config.assigned_to_id='me';
      config.showClosed=false;
    }

    vm.projects = projects;
  }]);



angular.module('adf.widget.redmine')
  .controller('editChartController', ["projects", "config", "redmineService", function (projects, config, redmineService) {
    var vm = this;
    vm.config = config;
    vm.filters = [
      {id:'version',name:'Fixed Version'}
    ]


    if (angular.equals({}, config)) {
      vm.config.project = "";
      vm.config.showClosed = true;
    }

    vm.addFilter = function(filter){
      if(filter === 'version'){
        vm.config.filterWithVersion = true;
      }
      vm.filterToAdd = 'none';
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

    vm.updateVersions = function(){
      if (vm.config.project) {
        if (vm.config.project === 'All'){
          vm.versions = [];
          return;
        }
        redmineService.getVersions(angular.fromJson(vm.config.project).identifier).then(function (versions) {
          console.log(versions);
          vm.versions = versions;
        });
      }
    };

    vm.checkUpdates = function(){
      if (vm.config.filterWithVersion) {
        vm.updateVersions();
      }
    };

    vm.updateVersionEnd =function(){
      vm.config.timespan.toDateTime = new Date(angular.fromJson(vm.config.version).due_date);
      var date = new Date(vm.config.timespan.toDateTime);
      vm.config.timespan.fromDateTime = date.setDate(date.getDate()-14);
    };

  }]);



angular.module('adf.widget.redmine')
  .controller('IssueController', ["issues", "config", function(issues, config){
    var vm = this;
    vm.config = config;
    if(!vm.config.limit) {
      vm.config.limit = 25;
    }
    vm.issues = issues;
  }]);



angular.module('adf.widget.redmine')
  .controller('ChartController', ["issues", "config", function (issues, config) {
    //console.log("issues length: " + issues.length);
    var vm = this;
    vm.config = config;
    vm.issues = issues;
    vm.numberAllIssues = issues.length;

    var calculateOpenIssuesPerDay = function (from, to, issues) {
      var timeDiff = Math.abs(from.getTime() - to.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var idealIssuesPerDay = vm.numberAllIssues / diffDays;
      var idealData = [];
      // order issues by creation date
      var openIssues = []; // inv: ordered by "closed_on"
      var dates = [];// x-values
      var values = [];// y-values
      while (from.getTime() <= to.getTime()) {
        moveNewOpenIssues(issues, openIssues, from);
        removeNewClosedIssues(openIssues, from);
        dates.push(from.toDateString());
        var value = openIssues.length;
        values.push(value);
        if(vm.config.showIdeal){
          var idealValue = vm.numberAllIssues - idealData.length*idealIssuesPerDay;
                          console.log(idealValue);
          idealData.push(idealValue);
        }
        from.setDate(from.getDate() + 1); // next day
      }
      var valueSets = [values];
      if(vm.config.showIdeal) {
        valueSets.push(idealData);
      }
      return {
        dates: dates,
        values: valueSets
      }
    }
    var moveNewOpenIssues = function (allIssues, openIssues, date) {
      //console.log("allIssues.length "+allIssues.length);
      for (var i = 0; i < allIssues.length; i++) {
        var createDate = new Date(allIssues[i].created_on);
        //console.log("createDate: "+createDate.toDateString());
        if (createDate.getTime() <= date.getTime()) {
          openIssues.push(allIssues[i]);
          allIssues.splice(i, 1);
          i--;
        } else {
          break;
        }
      }
    }

    var removeNewClosedIssues = function (openIssues, date) {
      for (var i = 0; i < openIssues.length; i++) {
        if (openIssues[i].closed_on) {
          var closeDate = new Date(openIssues[i].closed_on);
          if (closeDate.getTime() <= date.getTime()) {
            openIssues.splice(i, 1);
            i--;
          } else {
            //break;
          }
        }
      }
    }

    if (vm.config.timespan && vm.config.timespan.fromDateTime && vm.config.timespan.toDateTime) {
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
        data: generatedData.values,
        series: ["Project ..."],
        class: "chart-line",
        options: options
      };

      if (vm.config.showIdeal){
        vm.chart.series.push("Ideal");
      }

    }
  }]);



angular.module('adf.widget.redmine')
  .factory('redmineService', ["$http", "redmineEndpoint", "$q", function($http, redmineEndpoint, $q){

    function extractData(response){
      return response.data;
    }

    function request(param){
      return $http.get(redmineEndpoint+param).then(extractData);
    }

    function getProjects(){
      return request('projects.json').then(function(data){
        return data.projects;
      });
    }

    function getVersions(project){
      return request('projects/'+project+'/versions.json').then(function(data){
        return data.versions;
      });
    }

    function getIssues(config) {
      var allIssues = [];
      var params = generateIssuesParameter(config);
      var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
      return collectPageIssues(params, 0).then(function (issues) {
        angular.forEach(issues.issues, function (issue) {
          allIssues.push(issue);
        });
        var requests = [];
        for (var i = 100; i < issues.total_count && i < limit; i = i + 100) {
          requests.push(collectPageIssues(params, i));
        }
        if (params.length > 0) {
          return $q.all(requests).then(function (responses) {
            angular.forEach(responses, function (response) {
              angular.forEach(response.issues, function (issue) {
                allIssues.push(issue);
              });
            });
            return allIssues;
          });
        } else {
          return allIssues;
        }

      });
    }

    function collectPageIssues(params, offset){
      return request('issues.json'+params+'&offset='+offset).then(function(issues){
        return issues;
      });
    }

    function generateIssuesParameter(data) {
      var params = '?limit=100&sort=created_on';
      if (data.project && data.project !== "All") {
        params += '&project_id=' + angular.fromJson(data.project).id;
      }
      if (data.assigned_to_id) {
        params += '&assigned_to_id=' + data.assigned_to_id;
      }
      if (data.showClosed) {
        params += '&status_id=*';
      }
      if (data.timespan && data.timespan.fromDateTime && data.timespan.toDateTime) {
        var fromDate = new Date(data.timespan.fromDateTime);
        var toDate = new Date(data.timespan.toDateTime);

        params += '&created_on=<=' + dateToYMD(toDate);
      }
      if(data.filterWithVersion && data.version){
        params += '&fixed_version_id='+angular.fromJson(data.version).id;
      }
      return params;
    }

    function dateToYMD(date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    return {
      getIssues: getIssues,
      getProjects: getProjects,
      getVersions: getVersions
     };
  }]);
})(window);