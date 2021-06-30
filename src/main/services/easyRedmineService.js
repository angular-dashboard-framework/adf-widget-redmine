'use strict';

function EasyRedmineApiService(){
  ApiService.apply(this, arguments);
}

EasyRedmineApiService.prototype = new ApiService();
EasyRedmineApiService.prototype.constructor = EasyRedmineApiService;

EasyRedmineApiService.prototype.generateParametersForIssuesOpen = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&closed_on=null';
  var toDate = new Date(data.timespan.toDateTime);
  params += '&created_on=<=' + this.dateToYMD(toDate);
  return params;
};

angular.module('adf.widget.easyredmine')
  /*
  .config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + 'BASE64HERE=';
  })
  */
  .factory('easyRedmineService', function ($http, easyRedmineEndpoint, easyRedmineRedirectEndpoint, $q) {
    return new EasyRedmineApiService($http, easyRedmineEndpoint, easyRedmineRedirectEndpoint, $q);
  });
