'use strict';

angular.module('adf.widget.redmine')
  .factory('redmineService', function($http, redmineEndpoint){

    function data(response){
      return response.data;
    }

    function request(param){
      return $http.get(redmineEndpoint+param).then(data);
    }

    function getIssues(config){
      var params=generateIssuesParameter(config);
      return request('issues.json'+params);
    }

    function generateIssuesParameter(data) {
      var params='?';
      if(data.project && data.project !== "All") {
        params+='&project_id='+data.project;
      }
      if(data.assigned_to_id) {
        params+='&assigned_to_id='+data.assigned_to_id;
      }
      if(data.showClosed) {
        params+='&status_id=*';
      }
      return params;
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
