(function(window, undefined) {'use strict';


angular.module('adf.widget.redmine', ['adf.provider', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant('redmineEndpoint', 'http://www.redmine.org/')
  .config(["dashboardProvider", function (dashboardProvider) {
    var category = 'Redmine';

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
      .widget('redmine-custom-queries', {
        title: 'Redmine Custom Queries',
        description: 'Displays Issues from a Custom Query',
        category: category,
        templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: ["redmineService", "config", function (redmineService, config) {
            if(config.customQuery){
              return redmineService.getIssuesByQueryId(config.customQuery.id, config.customQuery.project_id);
            }

          }]
        },
        edit: editIssues
      });

    dashboardProvider
      .widget('redmine-my-issues', {
        title: 'My Redmine Issues',
        description: 'Displays all issues assigned to me',
        category: category,
        templateUrl: '{widgetsPath}/redmine/src/main/issues/view.html',
        controller: 'IssueController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/
          issues: ["redmineService", function (redmineService) {
              return redmineService.getMyIssues();
          }]
        }
      });
    // widget is currently broken
    /* dashboardProvider
      .widget('redmine-chart', {
        title: 'Redmine Chart',
        description: 'Displays a burnup or burndown chart',
        category: category,
        templateUrl: '{widgetsPath}/redmine/src/main/chart/view.html',
        controller: 'ChartController',
        controllerAs: 'vm',
        resolve: {
          /** @ngInject **/ /*
          chartData: function (chartDataService, config) {
            if(config.project) {
                return chartDataService.getChartData(config);
            }
          }
        },
        edit: editChart
      });
      */
  }]);

angular.module("adf.widget.redmine").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/redmine/src/chart/view.html","<div class=\"alert alert-info\" ng-if=!vm.config.project>Please configure the widget</div><div ng-if=\"vm.chart && vm.config.project\"><canvas id=line class=\"chart chart-line\" chart-data=vm.chart.data chart-series=vm.chart.series chart-options=vm.chart.options></canvas></div>");
$templateCache.put("{widgetsPath}/redmine/src/issues/view.html","<style type=text/css>\n  td>a{\n    font-weight: bold;\n    padding: 2px;\n    color: white;\n    border-radius: 2px 6px 6px 2px;\n    background-color: #409ae3;\n  }\n  td>a:hover{\n    color: white;\n    background-color: #4183c4;\n  }\n  th{\n    cursor: pointer;\n  }\n  .x-scrollable {\n    width: 100%;\n    max-height: 800px;\n    overflow-x: auto;\n  }\n\n\n</style><div class=\"alert alert-info\" ng-if=!vm.issues>Please configure the widget</div><div class=\"alert alert-info\" ng-if=\"vm.issues && !vm.issues[0].id\">No issues found</div><div ng-if=\"vm.issues && vm.issues[0].id\" class=x-scrollable><table class=\"table table-fixed\"><thead><tr><th ng-if=vm.config.columns.id.show ng-click=\"vm.changeOrder(\'id\')\">ID ↓</th><th ng-if=vm.config.columns.tracker.show ng-click=\"vm.changeOrder(\'tracker.name\')\">Tracker</th><th ng-if=vm.config.columns.status.show ng-click=\"vm.changeOrder(\'status.name\')\">Status</th><th ng-if=vm.config.columns.priority.show ng-click=\"vm.changeOrder(\'priority.name\')\">Priority</th><th ng-if=vm.config.columns.subject.show ng-click=\"vm.changeOrder(\'subject\')\">Subject</th><th ng-if=vm.config.columns.assignee.show ng-click=\"vm.changeOrder(\'author.name\')\">Assignee</th></tr></thead><tr ng-repeat=\"issue in vm.issues | orderBy: vm.order : vm.reverse\"><td ng-if=vm.config.columns.id.show title=\"\'ID\'\"><a href={{vm.issueUrl}}{{issue.id}}>#{{issue.id}}</a></td><td ng-if=vm.config.columns.tracker.show title=\"\'Tracker\'\">{{issue.tracker.name}}</td><td ng-if=vm.config.columns.status.show title=\"\'Status\'\">{{issue.status.name}}</td><td ng-if=vm.config.columns.priority.show title=\"\'Priority\'\">{{issue.priority.name}}</td><td ng-if=vm.config.columns.subject.show title=\"\'Subject\'\">{{issue.subject}}</td><td ng-if=vm.config.columns.assignee.show title=\"\'Assignee\'\">{{issue.author.name}}</td></tr></table></div>");
$templateCache.put("{widgetsPath}/redmine/src/chart/edit/edit.html","<form role=form><div class=form-group><label for=project>Project</label><select name=project id=project class=form-control ng-model=vm.config.project ng-change=vm.checkUpdates() ng-required=true><option value=All>All</option><option ng-repeat=\"project in vm.projects | orderBy: \'name\'\" value={{project}}>{{project.name}}</option></select></div><p class=input-group>Add Filter<select name=filter id=filter class=form-control ng-model=vm.filterToAdd ng-change=vm.addFilter(vm.filterToAdd)><option ng-repeat=\"filter in vm.filters | orderBy: \'name\'\" value={{filter.id}}>{{filter.name}}</option></select></p><div ng-if=vm.config.filterWithVersion><label for=version>Fixed Version</label><p class=input-group ng-init=vm.updateVersions()><select name=version id=version class=form-control ng-model=vm.config.version ng-change=vm.updateVersionEnd()><option ng-repeat=\"version in vm.versions | orderBy: \'name\'\" value={{version}}>{{version.name}}</option></select><span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithVersion=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></p></div><div ng-if=vm.config.filterWithAssigned><label for=assgined_to_id>Assigned To</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Get issues which are assigned to the given user ID. <me> can be used instead an ID to fetch all issues from the logged in user. Leave empty if you want to see all issues.\"></span><div class=input-group><input name=assigned_to_id id=assgined_to_id class=form-control ng-model=config.assigned_to_id> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithAssigned=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></div></div><div ng-if=vm.config.filterWithTracker><label for=tacker>Tracker</label><div class=input-group ng-init=vm.updateTracker()><select name=tracker id=tracker class=form-control ng-model=vm.config.tracker><option ng-repeat=\"tracker in vm.trackers | orderBy: \'name\'\" value={{tracker}}>{{tracker.name}}</option></select><span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithTracker=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></div></div><div class=form-group><input type=checkbox name=showIdeal ng-model=config.showIdeal> Show ideal line</div><div><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup1.opened ng-model=vm.config.timespan.fromDateTime placeholder=from show-button-bar=false type=text uib-datepicker-popup={{format}} ng-required=true> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open1() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup2.opened ng-model=vm.config.timespan.toDateTime placeholder=to show-button-bar=false type=text uib-datepicker-popup={{format}} ng-required=true> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open2() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></form>");
$templateCache.put("{widgetsPath}/redmine/src/issues/edit/edit.html","<form role=form><div class=form-group><label>My Custom-Queries</label><select name=customQuery ng-options=\"customQuery as customQuery.name for customQuery in vm.customQueries track by customQuery.name\" required class=form-control ng-model=config.customQuery><option disabled>Select your query</option></select></div><div class=form-group><input type=checkbox name=showClosed ng-model=config.showClosed> Show closed issues</div><div class=form-group><label>Columns to show</label><li class=list-group-item ng-repeat=\"(key, entry) in vm.possibleColumns\"><input type=checkbox name={{key}} ng-model=config.columns[key].show> {{entry.name}}</li></div></form>");}]);


angular.module('adf.widget.redmine')
  .controller('editIssuesController', ["projects", "config", "redmineService", function(projects, config, redmineService){
    var vm = this;

    vm.possibleColumns = {
      'id':{'name':'ID', 'show': true},
      'tracker':{'name':'Tracker','show': true},
      'status':{'name':'Status','show': true},
      'subject':{'name':'Subject','show': true},
      'assignee':{'name':'Assignee','show': true},
      'priority':{'name':'Priority','show': true}
    };

    redmineService.getCustomQueries().then(function(data){
      if (data && data.queries){
        vm.customQueries = data.queries;
      }else{
        vm.customQueries = null;
      }
    });


    if(angular.equals({},config)) {
      config.columns=vm.possibleColumns;
      config.project='';
      config.assigned_to_id='me';
      config.showClosed=false;
    }

    vm.projects = projects;
  }]);



angular.module('adf.widget.redmine')
  .controller('editChartController', ["projects", "config", "chartDataService", "redmineService", function (projects, config, chartDataService, redmineService) {
    var vm = this;
    vm.config = config;
    vm.projects = projects;
    // functions
    vm.addFilter = addFilter;
    vm.converStringsToDateObjects = converStringsToDateObjects;
    vm.toggleMin = toggleMin;
    vm.open1 = function () {
      vm.popup1.opened = true;
    };

    vm.open2 = function () {
      vm.popup2.opened = true;
    };
    vm.updateVersions = updateVersions;
    vm.checkUpdates = checkUpdates;
    vm.updateVersionEnd = updateVersionEnd;
    vm.updateTracker = updateTracker;

    // init stuff
    vm.filters = [
      { id: 'version', name: 'Fixed Version' },
      { id: 'assigned', name: 'Assigned to' },
      { id: 'tracker', name: 'Tracker' }
    ]

    if (!vm.config.timespan) {
      vm.config.timespan = {};
    }


    vm.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    if (!vm.dateOptions) {
      vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    }


    vm.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.popup1 = {
      opened: false
    };

    vm.popup2 = {
      opened: false
    };

    // calls
    vm.toggleMin();
    vm.converStringsToDateObjects();

    function addFilter(filter) {
      if (filter === 'version') {
        vm.config.filterWithVersion = true;
      } else if (filter === 'assigned') {
        vm.config.filterWithAssigned = true;
      } else if (filter === 'tracker') {
        vm.config.filterWithTracker = true;
      }
      vm.filterToAdd = 'none';
    }

    function converStringsToDateObjects() {
      if (vm.config.timespan.fromDateTime) {
        vm.config.timespan.fromDateTime = new Date(vm.config.timespan.fromDateTime);
        vm.config.timespan.toDateTime = new Date(vm.config.timespan.toDateTime);
      }
    }

    function toggleMin() {
      vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
      vm.dateOptions.minDate = vm.inlineOptions.minDate;
    }

    function updateVersions() {
      if (vm.config.project) {
        if (vm.config.project === 'All') {
          vm.versions = [];
          return;
        }
        redmineService.getVersions(angular.fromJson(vm.config.project).identifier).then(function (versions) {
          vm.versions = versions;
        });
      }
    }

    function checkUpdates() {
      if (vm.config.filterWithVersion) {
        vm.updateVersions();
      }
    }

    function updateVersionEnd() {
      vm.config.timespan.toDateTime = new Date(angular.fromJson(vm.config.version).due_date);
      var date = new Date(vm.config.timespan.toDateTime);
      vm.config.timespan.fromDateTime = date.setDate(date.getDate() - 14);
    }

    function updateTracker() {
      redmineService.getTrackers().then(function (trackers) {
        vm.trackers = trackers;
      });
    }

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

  }]);




angular.module('adf.widget.redmine')
  .controller('IssueController', ["issues", "config", "redmineService", function (issues, config, redmineService) {
    var vm = this;

    if (config){
      vm.config = config;
    }

    if (!config.columns){
      vm.config = {
        columns: {
          'id':{'name':'ID', 'show': true},
          'tracker':{'name':'Tracker','show': true},
          'status':{'name':'Status','show': true},
          'subject':{'name':'Subject','show': true},
          'assignee':{'name':'Assignee','show': false},
          'priority':{'name':'Priority','show': true}
        },
        assigned_to_id: 'me'
      };
    }

    if (issues){
      vm.issues = issues;
      if (issues.issues){
        vm.issues = vm.issues.issues;
      }
    }

    vm.issueUrl = redmineService.getRedmineEndpoint() + 'issues/';

    vm.order = 'id';

    vm.changeOrder = function(order){
      vm.order = order;
      vm.reverse = !vm.reverse;
    };

  }]);



angular.module('adf.widget.redmine')
  .factory('chartDataService', ["$q", "redmineService", function ($q, redmineService) {

    function getChartData(config) {
    config.numberPoints = 50;
      return redmineService.getIssuesForChart(config).then(function (issues) {
        //if (vm.config.timespan && vm.config.timespan.fromDateTime && vm.config.timespan.toDateTime)
        var from = new Date(config.timespan.fromDateTime);
        var to = new Date(config.timespan.toDateTime);
        return calculateOpenIssuesPerDay(from, to, issues, config);
      });
    }

    function calculateOpenIssuesPerDay(from, to, issues, config) {
      var timeDiff = Math.abs(from.getTime() - to.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var pointThinningRate = diffDays / config.numberPoints;
      var numberAllIssues = issues.length;
      var idealIssuesPerDay = numberAllIssues / diffDays;
      var idealData = [];
      var openIssues = [];
      var values = [];
      while (from.getTime() <= to.getTime()) {
        moveNewOpenIssues(issues, openIssues, from);
        removeNewClosedIssues(openIssues, from);
        var value = {x: from.toISOString(),y:openIssues.length};
        values.push(value);
        if (config.showIdeal) {
          var idealValue = Math.round((numberAllIssues - idealData.length * idealIssuesPerDay * pointThinningRate)*100) / 100;
          var ideal = {x: from.toISOString(),y:idealValue};
          idealData.push(ideal);
        }
        from.setDate(from.getDate() + pointThinningRate);
      }
      var valueSets = [values];
      if (config.showIdeal) {
        valueSets.push(idealData);
      }
      return valueSets;
    }

    function moveNewOpenIssues(allIssues, openIssues, date) {
      for (var i = 0; i < allIssues.length; i++) {
        var createDate = new Date(allIssues[i].created_on);
        if (createDate.getTime() <= date.getTime()) {
          openIssues.push(allIssues[i]);
          allIssues.splice(i, 1);
          i--;
        } else {
          // we can stop here, cause the issues are ordered by creation date
          break;
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

    return {
      getChartData: getChartData
    };
  }]);



angular.module('adf.widget.redmine')
  .controller('ChartController', ["chartData", "config", function (chartData, config) {

    var vm = this;
    vm.config = config;
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
        ],
        xAxes: [
          {
            id: 'x-axis-1',
            type: 'time', time: {
              displayFormats: {
                day: 'D.MMM',
                week: 'D.MMM',
                month: 'MMM/YY',
                quarter: '[Q]Q - YYYY',
                year: 'YYYY'
              }
            }
          }
        ]
      },
      legend: {
        display: true,
        position: "bottom"
      },
      responsive: true
    };

    vm.chart = {
      data: chartData,
      series: [],
      class: "chart-line",
      options: options
    };

    if (vm.config.project && vm.config.project !== 'All') {
      vm.chart.series.push(angular.fromJson(vm.config.project).name);
    } else {
      vm.chart.series.push("All Projects");
    }

    if (vm.config.showIdeal) {
      vm.chart.series.push("Ideal");
    }

  }]);



angular.module('adf.widget.redmine')
  .factory('redmineService', ["$http", "redmineEndpoint", "$q", function ($http, redmineEndpoint, $q) {

    function extractData(response) {
      return response.data;
    }

    function request(param) {
      return $http.get(redmineEndpoint + param).then(extractData);
    }

    function getProjects() {
      return request('projects.json').then(function (data) {
        return data.projects;
      });
    }

    function getVersions(project) {
      return request('projects/' + project + '/versions.json').then(function (data) {
        return data.versions;
      });
    }

    function getIssues(config) {
      var params = generateGeneralIssuesParameters(config);
      var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
      return getIssuesWithParamsAndLimit(params, limit);
    }

    function getIssuesForChart(config) {
      var allIssues = [];
      var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
      var params1 = generateParametersForIssuesOpenOnEnd(config);
      var params2 = generateParametersForIssuesClosedBetweenStartAndEnd(config);
      var params3 = generateParametersForIssuesOpen(config);
      return $q.all([getIssuesWithParamsAndLimit(params1, limit), getIssuesWithParamsAndLimit(params2, limit),
        getIssuesWithParamsAndLimit(params3, limit)]).then(function(responses){
        angular.forEach(responses, function (issues) {
          angular.forEach(issues, function (issue) {
            allIssues.push(issue);
          });
        });
        return allIssues;
      });
    }

    function getIssuesWithParamsAndLimit(params, limit){
      var allIssues = [];
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

    function collectPageIssues(params, offset) {
      return request('issues.json' + params + '&offset=' + offset).then(function (issues) {
        return issues;
      });
    }

    function generateParametersForIssuesOpenOnEnd(data) {
      var params = generateGeneralIssuesParameters(data);
      params += '&status_id=*';
      var toDate = new Date(data.timespan.toDateTime);
      params += '&created_on=<=' + dateToYMD(toDate);
      params += '&closed_on=>=' + dateToYMD(toDate);
      return params;
    }

    function generateParametersForIssuesOpen(data) {
      var params = generateGeneralIssuesParameters(data);
      params += '&status_id=open';
      var toDate = new Date(data.timespan.toDateTime);
      params += '&created_on=<=' + dateToYMD(toDate);
      return params;
    }

    function generateParametersForIssuesClosedBetweenStartAndEnd(data) {
      var params = generateGeneralIssuesParameters(data);
      params += '&status_id=*';
      var fromDate = new Date(data.timespan.fromDateTime);
      var toDate = new Date(data.timespan.toDateTime);
      params += '&closed_on=><' + dateToYMD(fromDate) + '|' + dateToYMD(toDate);
      return params;
    }

    function generateGeneralIssuesParameters(data) {
      var params = '?limit=100&sort=created_on';
      if (data.project && data.project !== "All") {
        params += '&project_id=' + angular.fromJson(data.project).id;
      }
      if (data.filterWithAssigned && data.assigned_to_id) {
        params += '&assigned_to_id=' + data.assigned_to_id;
      }
      if (data.showClosed) {
        params += '&status_id=*';
      }
      if (data.filterWithVersion && data.version) {
        params += '&fixed_version_id=' + angular.fromJson(data.version).id;
      }
      if (data.filterWithTracker && data.tracker) {
        params += '&tracker_id='+angular.fromJson(data.tracker).id;
      }
      return params;
    }

    function dateToYMD(date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    function getCustomQueries() {
      return request('queries.json?limit=100');
    }

    function getIssuesByQueryId(queryId, projectId) {
      return request('issues.json?query_id=' + queryId + '&project_id=' + projectId).then(function(data){
        return data.issues;
      });
    }

    function getRedmineEndpoint(){
      return redmineEndpoint;
    }

    function getTrackers() {
      return request('trackers.json').then(function (data) {
        return data.trackers;
      });
    }

    function getMyIssues(){
      return request('issues.json?assigned_to_id=me').then(function(data){
        return data;
      });
    }

    return {
      getIssues: getIssues,
      getIssuesForChart: getIssuesForChart,
      getProjects: getProjects,
      getVersions: getVersions,
      getCustomQueries: getCustomQueries,
      getIssuesByQueryId: getIssuesByQueryId,
      getRedmineEndpoint: getRedmineEndpoint,
      getTrackers: getTrackers,
      getMyIssues : getMyIssues
    };
  }]);
})(window);