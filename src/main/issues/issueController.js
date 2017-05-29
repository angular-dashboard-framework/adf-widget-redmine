'use strict';

angular.module('adf.widget.redmine')
  .controller('IssueController', function (issues, config, NgTableParams, $filter, redmineService) {
    var vm = this;
    vm.config = config;
    vm.issues = issues;
    vm.issueUrl = redmineService.getRedmineEndpoint() + 'issues/';

    vm.order = 'id';

    vm.changeOrder = function(order){
      vm.order = order;
      vm.reverse = !vm.reverse;
    };


  });
