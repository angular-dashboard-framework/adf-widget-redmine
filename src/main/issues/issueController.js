'use strict';

angular.module('adf.widget.redmine')
  .controller('IssueController', function (issues, config, redmineService) {
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

    var redirectEndpoint = redmineService.getRedmineRedirectEndpoint();
    if (!redirectEndpoint) {
      redirectEndpoint = redmineService.getRedmineEndpoint();
    }
    vm.issueUrl = redirectEndpoint + 'issues/';

    vm.order = 'id';

    vm.changeOrder = function(order){
      vm.order = order;
      vm.reverse = !vm.reverse;
    };

  });
