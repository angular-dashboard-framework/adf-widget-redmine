(function(window, undefined) {'use strict';


function createCustomQueriesEditController(isEasy) {
  return {
    templateUrl:  isEasy ? '{widgetsPath}/redmine/src/main/issues/edit/easyedit.html' : '{widgetsPath}/redmine/src/main/issues/edit/edit.html',
    controller: isEasy ? 'easyEditIssuesController' : 'editIssuesController',
    controllerAs: 'vm',
    resolve: {
      /** @ngInject **/
      projects: ["redmineService", "easyRedmineService", function (redmineService, easyRedmineService) {
        if (isEasy) {
          return easyRedmineService.getProjects();
        } else {
          return redmineService.getProjects();
        }
      }],
      /** @ngInject **/
      customQueries: ["redmineService", "easyRedmineService", function (redmineService, easyRedmineService) {
        if (isEasy) {
          return easyRedmineService.getCustomQueries().then(function (data){
            return data.easy_queries;
          });
        } else {
          return redmineService.getCustomQueries().then(function (data){
            return data.queries;
          });
        }
      }]
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
      projects: ["redmineService", "easyRedmineService", function (redmineService, easyRedmineService) {
        if (isEasy) {
          return easyRedmineService.getProjects();
        } else {
          return redmineService.getProjects();
        }
      }]
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
        issues: ["redmineService", "easyRedmineService", "config", function (redmineService, easyRedmineService, config) {
          if (config.customQuery) {
            if (isEasy) {
              return easyRedmineService.getIssuesByQueryId(config.customQuery.id, config.project.id);
            } else {
              return redmineService.getIssuesByQueryId(config.customQuery.id, config.customQuery.project_id);
            }
          }
        }]
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
        issues: ["redmineService", "easyRedmineService", function (redmineService, easyRedmineService) {
          if (isEasy) {
            return easyRedmineService.getMyIssues();
          } else {
            return redmineService.getMyIssues();
          }
        }]
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
        chartData: ["chartDataService", "easyChartDataService", "config", function (chartDataService, easyChartDataService, config) {
          if (config.project) {
            if (isEasy) {
              try {
                return easyChartDataService.getChartData(config);
              }
              catch (e) {
                config.failState = 'EasyRedmine failed to deliver the requested issues on time';
                return null;
              }
            } else {
              try {
                return chartDataService.getChartData(config);
              }
              catch (e) {
                config.failState = 'Redmine failed to deliver the requested issues on time';
                return null;
              }
            }
          }
        }]
      },
      edit: createChartEditController(isEasy)
    });

}

angular.module('adf.widget.redmine', ['adf.provider', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant('redmineEndpoint', 'http://192.168.56.2/redmine/')
  .constant('redmineRedirectEndpoint', null)
  .config(["dashboardProvider", function (dashboardProvider) {
    var category = 'Redmine';

    // Create widgets
    createMyIssuesWidget(dashboardProvider, 'redmine-my-issues', 'My Issues', category, false);
    createCustomQueriesWidget(dashboardProvider, 'redmine-custom-queries', 'Custom Queries', category, false);
    createChartWidget(dashboardProvider, 'redmine-chart', 'Chart', category, false);
  }]);

angular.module('adf.widget.easyredmine', ['adf.provider', 'chart.js', 'ui.bootstrap.datepicker'])
  .constant('easyRedmineEndpoint', 'http://192.168.56.2/easyredmine/')
  .constant('easyRedmineRedirectEndpoint', null)
  .config(["dashboardProvider", function (dashboardProvider) {
    var category = 'EasyRedmine';

    // Create widgets
    createMyIssuesWidget(dashboardProvider, 'easyredmine-my-issues', 'My Issues', category, true);
    createCustomQueriesWidget(dashboardProvider, 'easyredmine-custom-queries', 'Custom Queries', category, true);
    createChartWidget(dashboardProvider, 'easyredmine-chart', 'Chart', category, true);
  }]);

angular.module("adf.widget.easyredmine").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/redmine/src/main/chart/view.html","<div class=\"alert alert-info\" ng-if=vm.config.failState>Please reload the widget. Reason: {{vm.config.failState}}</div><div class=\"alert alert-info\" ng-if=\"!vm.config.project && !vm.config.failState\">Please configure the widget</div><div ng-if=\"vm.chart && vm.config.project && !vm.config.failState\"><canvas id=line class=\"chart chart-line\" chart-data=vm.chart.data chart-series=vm.chart.series chart-options=vm.chart.options></canvas></div>");
$templateCache.put("{widgetsPath}/redmine/src/main/issues/view.html","<style type=text/css>\n  td>a{\n    font-weight: bold;\n    padding: 2px;\n    color: white;\n    border-radius: 2px 6px 6px 2px;\n    background-color: #409ae3;\n  }\n  td>a:hover{\n    color: white;\n    background-color: #4183c4;\n  }\n  th{\n    cursor: pointer;\n  }\n  .x-scrollable {\n    width: 100%;\n    max-height: 800px;\n    overflow-x: auto;\n  }\n\n\n</style><div class=\"alert alert-info\" ng-if=!vm.issues>Please configure the widget</div><div class=\"alert alert-info\" ng-if=\"vm.issues && !vm.issues[0].id\">No issues found</div><div ng-if=\"vm.issues && vm.issues[0].id\" class=x-scrollable><table class=\"table table-fixed\"><thead><tr><th ng-if=vm.config.columns.id.show ng-click=\"vm.changeOrder(\'id\')\">ID ↓</th><th ng-if=vm.config.columns.tracker.show ng-click=\"vm.changeOrder(\'tracker.name\')\">Tracker</th><th ng-if=vm.config.columns.status.show ng-click=\"vm.changeOrder(\'status.name\')\">Status</th><th ng-if=vm.config.columns.priority.show ng-click=\"vm.changeOrder(\'priority.name\')\">Priority</th><th ng-if=vm.config.columns.subject.show ng-click=\"vm.changeOrder(\'subject\')\">Subject</th><th ng-if=vm.config.columns.assignee.show ng-click=\"vm.changeOrder(\'assignee.name\')\">Assignee</th></tr></thead><tr ng-repeat=\"issue in vm.issues | orderBy: vm.order : vm.reverse\"><td ng-if=vm.config.columns.id.show title=\"\'ID\'\"><a href={{vm.issueUrl}}{{issue.id}}>#{{issue.id}}</a></td><td ng-if=vm.config.columns.tracker.show title=\"\'Tracker\'\">{{issue.tracker.name}}</td><td ng-if=vm.config.columns.status.show title=\"\'Status\'\">{{issue.status.name}}</td><td ng-if=vm.config.columns.priority.show title=\"\'Priority\'\">{{issue.priority.name}}</td><td ng-if=vm.config.columns.subject.show title=\"\'Subject\'\">{{issue.subject}}</td><td ng-if=vm.config.columns.assignee.show title=\"\'Assignee\'\">{{issue.assigned_to.name}}</td></tr></table></div>");
$templateCache.put("{widgetsPath}/redmine/src/main/chart/edit/edit.html","<form role=form><div class=form-group><label for=project>Project</label><select name=project id=project class=form-control ng-model=vm.config.project ng-change=vm.checkUpdates() ng-required=true><option value=All>All</option><option ng-repeat=\"project in vm.projects | orderBy: \'name\'\" value={{project}}>{{project.name}}</option></select></div><p class=input-group><label for=Filter>Add Filter</label><select name=filter id=filter class=form-control ng-model=vm.filterToAdd ng-change=vm.addFilter(vm.filterToAdd)><option ng-repeat=\"filter in vm.filters | orderBy: \'name\'\" value={{filter.id}}>{{filter.name}}</option></select></p><div ng-if=vm.config.filterWithVersion><label for=version>Fixed Version</label><p class=input-group ng-init=vm.updateVersions()><select name=version id=version class=form-control ng-model=vm.config.version ng-change=vm.updateVersionEnd()><option ng-repeat=\"version in vm.versions | orderBy: \'name\'\" value={{version}}>{{version.name}}</option></select><span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithVersion=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></p></div><div ng-if=vm.config.filterWithAssigned><label for=assgined_to_id>Assigned To</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Get issues which are assigned to the given user ID. <me> can be used instead an ID to fetch all issues from the logged in user. Leave empty if you want to see all issues.\"></span><div class=input-group><input name=assigned_to_id id=assgined_to_id class=form-control ng-model=config.assigned_to_id> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithAssigned=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></div></div><div ng-if=vm.config.filterWithTracker><label for=tacker>Tracker</label><div class=input-group ng-init=vm.updateTracker()><select name=tracker id=tracker class=form-control ng-model=vm.config.tracker><option ng-repeat=\"tracker in vm.trackers | orderBy: \'name\'\" value={{tracker}}>{{tracker.name}}</option></select><span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithTracker=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></div></div><div class=form-group><input type=checkbox name=showIdeal ng-model=config.showIdeal> Show ideal line</div><div><label for=period>Period</label><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup1.opened ng-model=vm.config.timespan.fromDateTime placeholder=from show-button-bar=false type=text uib-datepicker-popup={{format}} ng-required=true> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open1() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup2.opened ng-model=vm.config.timespan.toDateTime placeholder=to show-button-bar=false type=text uib-datepicker-popup={{format}} ng-required=true> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open2() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></form>");
$templateCache.put("{widgetsPath}/redmine/src/main/issues/edit/easyedit.html","<form role=form><div class=form-group><label>Project</label><select name=project ng-options=\"project as project.name for project in vm.projects track by project.name\" required class=form-control ng-model=config.project><option disabled>Select your project</option></select></div><div class=form-group ng-if=config.project><label>My Custom-Queries</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"EasyRedmine only supports custom queries that are not restricted to a specific project. This can be achieved in the configuration for a custom query by enabling \'for all projects\' instead of a specific project.\"></span><select name=customQuery ng-options=\"customQuery as customQuery.name for customQuery in vm.customQueries track by customQuery.name\" required class=form-control ng-model=config.customQuery><option disabled>Select your query</option></select></div><div class=form-group><input type=checkbox name=showClosed ng-model=config.showClosed> Show closed issues</div><div class=form-group><label>Columns to show</label><li class=list-group-item ng-repeat=\"(key, entry) in vm.possibleColumns\"><input type=checkbox name={{key}} ng-model=config.columns[key].show> {{entry.name}}</li></div></form>");
$templateCache.put("{widgetsPath}/redmine/src/main/issues/edit/edit.html","<form role=form><div class=form-group><label>My Custom-Queries</label><select name=customQuery ng-options=\"customQuery as customQuery.name for customQuery in vm.customQueries track by customQuery.name\" required class=form-control ng-model=config.customQuery><option disabled>Select your query</option></select></div><div class=form-group><input type=checkbox name=showClosed ng-model=config.showClosed> Show closed issues</div><div class=form-group><label>Columns to show</label><li class=list-group-item ng-repeat=\"(key, entry) in vm.possibleColumns\"><input type=checkbox name={{key}} ng-model=config.columns[key].show> {{entry.name}}</li></div></form>");}]);
angular.module("adf.widget.redmine").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/redmine/src/main/chart/view.html","<div class=\"alert alert-info\" ng-if=vm.config.failState>Please reload the widget. Reason: {{vm.config.failState}}</div><div class=\"alert alert-info\" ng-if=\"!vm.config.project && !vm.config.failState\">Please configure the widget</div><div ng-if=\"vm.chart && vm.config.project && !vm.config.failState\"><canvas id=line class=\"chart chart-line\" chart-data=vm.chart.data chart-series=vm.chart.series chart-options=vm.chart.options></canvas></div>");
$templateCache.put("{widgetsPath}/redmine/src/main/issues/view.html","<style type=text/css>\n  td>a{\n    font-weight: bold;\n    padding: 2px;\n    color: white;\n    border-radius: 2px 6px 6px 2px;\n    background-color: #409ae3;\n  }\n  td>a:hover{\n    color: white;\n    background-color: #4183c4;\n  }\n  th{\n    cursor: pointer;\n  }\n  .x-scrollable {\n    width: 100%;\n    max-height: 800px;\n    overflow-x: auto;\n  }\n\n\n</style><div class=\"alert alert-info\" ng-if=!vm.issues>Please configure the widget</div><div class=\"alert alert-info\" ng-if=\"vm.issues && !vm.issues[0].id\">No issues found</div><div ng-if=\"vm.issues && vm.issues[0].id\" class=x-scrollable><table class=\"table table-fixed\"><thead><tr><th ng-if=vm.config.columns.id.show ng-click=\"vm.changeOrder(\'id\')\">ID ↓</th><th ng-if=vm.config.columns.tracker.show ng-click=\"vm.changeOrder(\'tracker.name\')\">Tracker</th><th ng-if=vm.config.columns.status.show ng-click=\"vm.changeOrder(\'status.name\')\">Status</th><th ng-if=vm.config.columns.priority.show ng-click=\"vm.changeOrder(\'priority.name\')\">Priority</th><th ng-if=vm.config.columns.subject.show ng-click=\"vm.changeOrder(\'subject\')\">Subject</th><th ng-if=vm.config.columns.assignee.show ng-click=\"vm.changeOrder(\'assignee.name\')\">Assignee</th></tr></thead><tr ng-repeat=\"issue in vm.issues | orderBy: vm.order : vm.reverse\"><td ng-if=vm.config.columns.id.show title=\"\'ID\'\"><a href={{vm.issueUrl}}{{issue.id}}>#{{issue.id}}</a></td><td ng-if=vm.config.columns.tracker.show title=\"\'Tracker\'\">{{issue.tracker.name}}</td><td ng-if=vm.config.columns.status.show title=\"\'Status\'\">{{issue.status.name}}</td><td ng-if=vm.config.columns.priority.show title=\"\'Priority\'\">{{issue.priority.name}}</td><td ng-if=vm.config.columns.subject.show title=\"\'Subject\'\">{{issue.subject}}</td><td ng-if=vm.config.columns.assignee.show title=\"\'Assignee\'\">{{issue.assigned_to.name}}</td></tr></table></div>");
$templateCache.put("{widgetsPath}/redmine/src/main/chart/edit/edit.html","<form role=form><div class=form-group><label for=project>Project</label><select name=project id=project class=form-control ng-model=vm.config.project ng-change=vm.checkUpdates() ng-required=true><option value=All>All</option><option ng-repeat=\"project in vm.projects | orderBy: \'name\'\" value={{project}}>{{project.name}}</option></select></div><p class=input-group><label for=Filter>Add Filter</label><select name=filter id=filter class=form-control ng-model=vm.filterToAdd ng-change=vm.addFilter(vm.filterToAdd)><option ng-repeat=\"filter in vm.filters | orderBy: \'name\'\" value={{filter.id}}>{{filter.name}}</option></select></p><div ng-if=vm.config.filterWithVersion><label for=version>Fixed Version</label><p class=input-group ng-init=vm.updateVersions()><select name=version id=version class=form-control ng-model=vm.config.version ng-change=vm.updateVersionEnd()><option ng-repeat=\"version in vm.versions | orderBy: \'name\'\" value={{version}}>{{version.name}}</option></select><span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithVersion=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></p></div><div ng-if=vm.config.filterWithAssigned><label for=assgined_to_id>Assigned To</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Get issues which are assigned to the given user ID. <me> can be used instead an ID to fetch all issues from the logged in user. Leave empty if you want to see all issues.\"></span><div class=input-group><input name=assigned_to_id id=assgined_to_id class=form-control ng-model=config.assigned_to_id> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithAssigned=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></div></div><div ng-if=vm.config.filterWithTracker><label for=tacker>Tracker</label><div class=input-group ng-init=vm.updateTracker()><select name=tracker id=tracker class=form-control ng-model=vm.config.tracker><option ng-repeat=\"tracker in vm.trackers | orderBy: \'name\'\" value={{tracker}}>{{tracker.name}}</option></select><span class=input-group-btn><button class=\"btn btn-default\" ng-click=\"vm.config.filterWithTracker=false\" type=button><i class=\"glyphicon glyphicon-remove\"></i></button></span></div></div><div class=form-group><input type=checkbox name=showIdeal ng-model=config.showIdeal> Show ideal line</div><div><label for=period>Period</label><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup1.opened ng-model=vm.config.timespan.fromDateTime placeholder=from show-button-bar=false type=text uib-datepicker-popup={{format}} ng-required=true> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open1() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p><p class=input-group><input class=form-control datepicker-options=vm.dateOptions is-open=vm.popup2.opened ng-model=vm.config.timespan.toDateTime placeholder=to show-button-bar=false type=text uib-datepicker-popup={{format}} ng-required=true> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=vm.open2() type=button><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></form>");
$templateCache.put("{widgetsPath}/redmine/src/main/issues/edit/easyedit.html","<form role=form><div class=form-group><label>Project</label><select name=project ng-options=\"project as project.name for project in vm.projects track by project.name\" required class=form-control ng-model=config.project><option disabled>Select your project</option></select></div><div class=form-group ng-if=config.project><label>My Custom-Queries</label> <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"EasyRedmine only supports custom queries that are not restricted to a specific project. This can be achieved in the configuration for a custom query by enabling \'for all projects\' instead of a specific project.\"></span><select name=customQuery ng-options=\"customQuery as customQuery.name for customQuery in vm.customQueries track by customQuery.name\" required class=form-control ng-model=config.customQuery><option disabled>Select your query</option></select></div><div class=form-group><input type=checkbox name=showClosed ng-model=config.showClosed> Show closed issues</div><div class=form-group><label>Columns to show</label><li class=list-group-item ng-repeat=\"(key, entry) in vm.possibleColumns\"><input type=checkbox name={{key}} ng-model=config.columns[key].show> {{entry.name}}</li></div></form>");
$templateCache.put("{widgetsPath}/redmine/src/main/issues/edit/edit.html","<form role=form><div class=form-group><label>My Custom-Queries</label><select name=customQuery ng-options=\"customQuery as customQuery.name for customQuery in vm.customQueries track by customQuery.name\" required class=form-control ng-model=config.customQuery><option disabled>Select your query</option></select></div><div class=form-group><input type=checkbox name=showClosed ng-model=config.showClosed> Show closed issues</div><div class=form-group><label>Columns to show</label><li class=list-group-item ng-repeat=\"(key, entry) in vm.possibleColumns\"><input type=checkbox name={{key}} ng-model=config.columns[key].show> {{entry.name}}</li></div></form>");}]);


function createEditIssueController(vm, projects, customQueries, config){
  vm.possibleColumns = {
    'id':{'name':'ID', 'show': true},
    'tracker':{'name':'Tracker','show': true},
    'status':{'name':'Status','show': true},
    'subject':{'name':'Subject','show': true},
    'assignee':{'name':'Assignee','show': true},
    'priority':{'name':'Priority','show': true}
  };

  if(angular.equals({},config)) {
    config.columns=vm.possibleColumns;
    config.customQuery='';
    config.project='';
    config.assigned_to_id='me';
    config.showClosed=false;
  }

  vm.projects = projects;
  vm.customQueries = customQueries;
}

angular.module('adf.widget.redmine')
  .controller('editIssuesController', ["projects", "customQueries", "config", function (projects, customQueries, config) {
    return createEditIssueController(this, projects, customQueries, config);
  }]);

angular.module('adf.widget.easyredmine')
  .controller('easyEditIssuesController', ["projects", "customQueries", "config", function (projects, customQueries, config) {
    return createEditIssueController(this, projects, customQueries, config);
  }]);



function createEditChartController(vm, projects, config, chartDataService, apiService) {
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
    {id: 'version', name: 'Fixed Version'},
    {id: 'assigned', name: 'Assigned to'},
    {id: 'tracker', name: 'Tracker'}
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
      apiService.getVersions(angular.fromJson(vm.config.project).identifier).then(function (versions) {
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
    apiService.getTrackers().then(function (trackers) {
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
}

angular.module('adf.widget.redmine').controller('editChartController', ["projects", "config", "chartDataService", "redmineService", function (projects, config, chartDataService, redmineService) {
  return createEditChartController(this, projects, config, chartDataService, redmineService);
}]);

angular.module('adf.widget.easyredmine').controller('easyEditChartController', ["projects", "config", "easyChartDataService", "easyRedmineService", function (projects, config, easyChartDataService, easyRedmineService) {
  return createEditChartController(this, projects, config, easyChartDataService, easyRedmineService);
}]);



function RedmineApiService(){
  ApiService.apply(this, arguments);
}

RedmineApiService.prototype = new ApiService();
RedmineApiService.prototype.constructor = RedmineApiService;

angular.module('adf.widget.redmine')
  .factory('redmineService', ["$http", "redmineEndpoint", "redmineRedirectEndpoint", "$q", function ($http, redmineEndpoint, redmineRedirectEndpoint, $q) {
    return new RedmineApiService($http, redmineEndpoint, redmineRedirectEndpoint, $q);
  }]);



function EasyRedmineApiService(){
  ApiService.apply(this, arguments);
}

EasyRedmineApiService.prototype = new ApiService();
EasyRedmineApiService.prototype.constructor = EasyRedmineApiService;

EasyRedmineApiService.prototype.generateParametersForIssuesOpen = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&closed_on=null';
  var toDate = new Date(data.timespan.toDateTime);
  params += '&created_on=<=' + this.dateToYMD(toDate);
  return params;
};

angular.module('adf.widget.easyredmine')
  .factory('easyRedmineService', ["$http", "easyRedmineEndpoint", "easyRedmineRedirectEndpoint", "$q", function ($http, easyRedmineEndpoint, easyRedmineRedirectEndpoint, $q) {
    return new EasyRedmineApiService($http, easyRedmineEndpoint, easyRedmineRedirectEndpoint, $q);
  }]);



function ApiService($http, apiEndpoint, apiEndpointRedirect, $q) {
  this.http = $http;
  this.apiEndpoint = apiEndpoint;
  this.apiEndpointRedirect = apiEndpointRedirect;
  this.q = $q;
}

ApiService.prototype.request = function (param) {
  return this.http.get(this.apiEndpoint + param).then(function (response) {
    return response.data;
  });
};

ApiService.prototype.getProjects = function(){
  return this.request('projects.json').then(function (data) {
    return data.projects;
  });
};

ApiService.prototype.getVersions = function (project) {
  return this.request('projects/' + project + '/versions.json').then(function (data) {
    return data.versions;
  });
};

ApiService.prototype.getIssues = function (config) {
  var params = this.generateGeneralIssuesParameters(config);
  var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
  return this.getIssuesWithParamsAndLimit(params, limit);
};

ApiService.prototype.getIssuesForChart = function(config) {
  var allIssues = [];
  var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
  var params1 = this.generateParametersForIssuesOpenOnEnd(config);
  var params2 = this.generateParametersForIssuesClosedBetweenStartAndEnd(config);
  var params3 = this.generateParametersForIssuesOpen(config);
  return this.q.all([this.getIssuesWithParamsAndLimit(params1, limit), this.getIssuesWithParamsAndLimit(params2, limit),
    this.getIssuesWithParamsAndLimit(params3, limit)]).then(function (responses) {
    angular.forEach(responses, function (issues) {
      angular.forEach(issues, function (issue) {
        allIssues.push(issue);
      });
    });
    return allIssues;
  });
};

ApiService.prototype.getIssuesWithParamsAndLimit = function (params, limit) {
  var allIssues = [];
  return this.collectPageIssues(params, 0).then(function (issues) {
    angular.forEach(issues.issues, function (issue) {
      allIssues.push(issue);
    });
    var requests = [];
    for (var i = 100; i < issues.total_count && i < limit; i = i + 100) {
      requests.push(this.collectPageIssues(params, i));
    }
    if (params.length > 0) {
      return this.q.all(requests).then(function (responses) {
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
  }.bind(this));
};


ApiService.prototype.collectPageIssues = function (params, offset) {
  return this.request('issues.json' + params + '&offset=' + offset).then(function (issues) {
    return issues;
  });
};

ApiService.prototype.generateParametersForIssuesOpenOnEnd = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&status_id=*';
  var toDate = new Date(data.timespan.toDateTime);
  params += '&created_on=<=' + this.dateToYMD(toDate);
  params += '&closed_on=>=' + this.dateToYMD(toDate);
  return params;
};

ApiService.prototype.generateParametersForIssuesOpen = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&status_id=open';
  var toDate = new Date(data.timespan.toDateTime);
  params += '&created_on=<=' + this.dateToYMD(toDate);
  return params;
};

ApiService.prototype.generateParametersForIssuesClosedBetweenStartAndEnd = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&status_id=*';
  var fromDate = new Date(data.timespan.fromDateTime);
  var toDate = new Date(data.timespan.toDateTime);
  params += '&closed_on=><' + this.dateToYMD(fromDate) + '|' + this.dateToYMD(toDate);
  return params;
};

ApiService.prototype.generateGeneralIssuesParameters = function (data) {
  var params = '?limit=100&sort=created_on';
  if (data.project && data.project !== 'All') {
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
    params += '&tracker_id=' + angular.fromJson(data.tracker).id;
  }
  return params;
};

ApiService.prototype.dateToYMD = function (date) {
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
};

ApiService.prototype.getCustomQueries = function () {
  return this.request('queries.json?limit=100');
};

ApiService.prototype.getIssuesByQueryId = function (queryId, projectId) {
  return this.request('issues.json?query_id=' + queryId + '&project_id=' + projectId).then(function (data) {
    return data.issues;
  });
};

ApiService.prototype.getRedmineEndpoint = function () {
  return this.apiEndpoint;
};

ApiService.prototype.getRedmineRedirectEndpoint = function () {
  return this.apiEndpointRedirect;
};

ApiService.prototype.getTrackers = function () {
  return this.request('trackers.json').then(function (data) {
    return data.trackers;
  });
};

ApiService.prototype.getMyIssues = function () {
  return this.request('issues.json?assigned_to_id=me').then(function (data) {
    return data;
  });
};



function createIssueController(vm, issues, config, apiService) {
  if (config) {
    vm.config = config;
  }

  if (!config.columns) {
    vm.config = {
      columns: {
        'id': {'name': 'ID', 'show': true},
        'tracker': {'name': 'Tracker', 'show': true},
        'status': {'name': 'Status', 'show': true},
        'subject': {'name': 'Subject', 'show': true},
        'assignee': {'name': 'Assignee', 'show': false},
        'priority': {'name': 'Priority', 'show': true}
      },
      assigned_to_id: 'me'
    };
  }

  if (issues) {
    vm.issues = issues;
    if (issues.issues) {
      vm.issues = vm.issues.issues;
    }
  }

  var redirectEndpoint = apiService.getRedmineRedirectEndpoint();
  if (!redirectEndpoint) {
    redirectEndpoint = apiService.getRedmineEndpoint();
  }
  vm.issueUrl = redirectEndpoint + 'issues/';

  vm.order = 'id';

  vm.changeOrder = function (order) {
    vm.order = order;
    vm.reverse = !vm.reverse;
  };

}

angular.module('adf.widget.redmine')
  .controller('issueController', ["issues", "config", "redmineService", function (issues, config, redmineService) {
    return createIssueController(this, issues, config, redmineService);
  }]);

angular.module('adf.widget.easyredmine')
  .controller('easyIssueController', ["issues", "config", "easyRedmineService", function (issues, config, easyRedmineService) {
    return createIssueController(this, issues, config, easyRedmineService);
  }]);



function createChartDataService($q, apiService) {
  function moveNewOpenIssues(allIssues, openIssues, date) {
    for (var i = 0; i < allIssues.length; i++) {
      var createDate = new Date(allIssues[i].created_on);
      if (createDate.getTime() <= date.getTime()) {
        openIssues.push(allIssues[i]);
        allIssues.splice(i, 1);
        i--;
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

  function calculateOpenIssuesPerDay(from, to, issues, config) {
    var timeDiff = Math.abs(from.getTime() - to.getTime());
    var pointThinningRate = timeDiff / config.numberPoints;
    var numberAllIssues = issues.length;
    var idealIssuesPerInterval = numberAllIssues / timeDiff;
    var idealData = [];
    var openIssues = [];
    var values = [];
    while ((from.getTime() <= to.getTime())) {
      moveNewOpenIssues(issues, openIssues, from);
      removeNewClosedIssues(openIssues, from);
      var value = {x: from.toISOString(), y: openIssues.length};
      values.push(value);
      if (config.showIdeal) {
        var idealValue = Math.round((numberAllIssues - idealData.length * idealIssuesPerInterval * pointThinningRate) * 100) / 100;
        var ideal = {x: from.toISOString(), y: idealValue};
        idealData.push(ideal);
      }
      from.setTime(from.getTime() + pointThinningRate);
    }
    var valueSets = [values];
    if (config.showIdeal) {
      valueSets.push(idealData);
    }
    return valueSets;
  }

  function getChartData(config) {
    return apiService.getIssuesForChart(config).then(function (issues) {
      config.numberPoints = 50;
      var from = new Date(config.timespan.fromDateTime);
      var to = new Date(config.timespan.toDateTime);
      return calculateOpenIssuesPerDay(from, to, issues, config);
    });
  }

  return {
    getChartData: getChartData
  };
}

angular.module('adf.widget.redmine')
  .factory('chartDataService', ["$q", "redmineService", function ($q, redmineService) {
    return createChartDataService($q, redmineService);
  }]);

angular.module('adf.widget.easyredmine')
  .factory('easyChartDataService', ["$q", "easyRedmineService", function ($q, easyRedmineService) {
    return createChartDataService($q, easyRedmineService);
  }]);



function createChartController(vm, chartData, config) {
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
}

angular.module('adf.widget.redmine')
  .controller('chartController', ["chartData", "config", function (chartData, config) {
    return createChartController(this, chartData, config);
  }]);

angular.module('adf.widget.easyredmine')
  .controller('easyChartController', ["chartData", "config", function (chartData, config) {
    return createChartController(this, chartData, config);
  }]);
})(window);