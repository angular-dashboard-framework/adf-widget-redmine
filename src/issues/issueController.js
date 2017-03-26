'use strict';

angular.module('adf.widget.redmine')
  .controller('IssueController', function(issues, config){
    var vm = this;
    vm.config = config;
    vm.issues = issues.issues;
  });
