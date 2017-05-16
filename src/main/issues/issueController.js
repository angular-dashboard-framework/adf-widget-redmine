'use strict';

angular.module('adf.widget.redmine')
  .controller('IssueController', function(issues, config){
    var vm = this;
    vm.config = config;
    if(!vm.config.limit) {
      vm.config.limit = 25;
    }
    vm.issues = issues;
  });
