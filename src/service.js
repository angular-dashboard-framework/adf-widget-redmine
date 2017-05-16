'use strict';

angular.module('adf.widget.redmine')
  .factory('redmineService', function($http, redmineEndpoint){

    function extractData(response){
      return response.data;
    }

    function request(param){
      return $http.get(redmineEndpoint+param).then(extractData);
    }

    function getIssues(config){
      var allIssues = [];
      var params=generateIssuesParameter(config);
      var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
      return collectPageIssues(params, allIssues, 0, limit);
    }

    function collectPageIssues(params, allIssues, offset, limit){
      return request('issues.json'+params+'&offset='+offset).then(function(issues){
        angular.forEach(issues.issues, function(issue){
          allIssues.push(issue);
        });
        if(issues.total_count > allIssues.length && allIssues.length < limit) {
          return collectPageIssues(params, allIssues, offset+100, limit);
        }
        return allIssues;
      });
    }

    function generateIssuesParameter(data) {
      var params = '?limit=100';
      if (data.project && data.project !== "All") {
        params += '&project_id=' + data.project;
      }
      if (data.assigned_to_id) {
        params += '&assigned_to_id=' + data.assigned_to_id;
      }
      if (data.showClosed) {
        params += '&status_id=*';
      }
      if (data.timespan.fromDateTime && data.timespan.toDateTime) {
        var fromDate = new Date(data.timespan.fromDateTime);
        var toDate = new Date(data.timespan.toDateTime);

        params += '&created_on=%3E%3C' + dateToYMD(fromDate) + '|' + dateToYMD(toDate);
      }
      return params;
    }

    function dateToYMD(date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    function getProjects(){
      return request('projects.json').then(function(data){
        return data.projects;
      });
    }

    return {
      getIssues: getIssues,
      getProjects: getProjects
     };
  });
