'use strict';

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
  .controller('editIssuesController', function (projects, customQueries, config, $scope, $sce) {
    $scope.customQueryTooltip = $sce.trustAsHtml('Select a custom query. Querys can be defined in Redmine.');
    return createEditIssueController(this, projects, customQueries, config);
  });

angular.module('adf.widget.easyredmine')
  .controller('easyEditIssuesController', function (projects, customQueries, config, $scope, $sce) {
    $scope.customQueryTooltip = $sce.trustAsHtml('Select a custom query. Querys can be defined in EasyRedmine.');
    return createEditIssueController(this, projects, customQueries, config);
  });
