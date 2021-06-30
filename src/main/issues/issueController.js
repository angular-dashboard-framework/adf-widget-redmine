'use strict';

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

    if(issues.error){
      vm.error = issues.error;
      vm.issues = null;
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
  .controller('issueController', function (issues, config, redmineService) {
    return createIssueController(this, issues, config, redmineService);
  });

angular.module('adf.widget.easyredmine')
  .controller('easyIssueController', function (issues, config, easyRedmineService) {
    return createIssueController(this, issues, config, easyRedmineService);
  });
