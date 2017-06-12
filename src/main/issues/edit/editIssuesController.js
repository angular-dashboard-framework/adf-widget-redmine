'use strict';

angular.module('adf.widget.redmine')
  .controller('editIssuesController', function(projects, config, redmineService){
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
  });
