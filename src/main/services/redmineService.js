'use strict';

function RedmineApiService(){
  ApiService.apply(this, arguments);
}

RedmineApiService.prototype = new ApiService();
RedmineApiService.prototype.constructor = RedmineApiService;

angular.module('adf.widget.redmine')
  /*
  .config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + 'BASE64HERE';
  })
  */
  .factory('redmineService', function ($http, redmineEndpoint, redmineRedirectEndpoint, $q) {
    return new RedmineApiService($http, redmineEndpoint, redmineRedirectEndpoint, $q);
  });
