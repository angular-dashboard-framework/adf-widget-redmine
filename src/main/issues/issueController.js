'use strict';

angular.module('adf.widget.redmine')
  .controller('IssueController', function (issues, config, redmineService) {
    var vm = this;

    if (config){
      vm.config = config;
    }

    if(issues){
      vm.issues = issues;
    }

    vm.issueUrl = redmineService.getRedmineEndpoint() + 'issues/';

    vm.order = 'id';

    vm.changeOrder = function(order){
      vm.order = order;
      vm.reverse = !vm.reverse;
    };

  });
