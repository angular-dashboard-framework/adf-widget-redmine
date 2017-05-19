'use strict';

angular.module('adf.widget.redmine')
  .factory('redmineService', function($http, redmineEndpoint, $q){

    function extractData(response){
      return response.data;
    }

    function request(param){
      return $http.get(redmineEndpoint+param).then(extractData);
    }

    function getProjects(){
      return request('projects.json').then(function(data){
        return data.projects;
      });
    }

    function getVersions(project){
      return request('projects/'+project+'/versions.json').then(function(data){
        return data.versions;
      });
    }

    function getIssues(config) {
      var allIssues = [];
      var params = generateIssuesParameter(config);
      var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
      return collectPageIssues(params, 0).then(function (issues) {
        angular.forEach(issues.issues, function (issue) {
          allIssues.push(issue);
        });
        var requests = [];
        for (var i = 100; i < issues.total_count && i < limit; i = i + 100) {
          requests.push(collectPageIssues(params, i));
        }
        if (params.length > 0) {
          return $q.all(requests).then(function (responses) {
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

      })
    }

    function collectPageIssues(params, offset){
      return request('issues.json'+params+'&offset='+offset).then(function(issues){
        return issues;
      });
    }

    function generateIssuesParameter(data) {
      var params = '?limit=100&sort=created_on';
      if (data.project && data.project !== "All") {
        params += '&project_id=' + angular.fromJson(data.project).id;
      }
      if (data.assigned_to_id) {
        params += '&assigned_to_id=' + data.assigned_to_id;
      }
      if (data.showClosed) {
        params += '&status_id=*';
      }
      if (data.timespan && data.timespan.fromDateTime && data.timespan.toDateTime) {
        var fromDate = new Date(data.timespan.fromDateTime);
        var toDate = new Date(data.timespan.toDateTime);

        params += '&created_on=<=' + dateToYMD(toDate);
      }
      if(data.filterWithVersion && data.version){
        params += '&fixed_version_id='+angular.fromJson(data.version).id;
      }
      return params;
    }

    function dateToYMD(date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    return {
      getIssues: getIssues,
      getProjects: getProjects,
      getVersions: getVersions
     };
  });
