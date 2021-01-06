'use strict';

function RedmineApiService(){
  ApiService.apply(this, arguments);
}

RedmineApiService.prototype = new ApiService();
RedmineApiService.prototype.constructor = RedmineApiService;

angular.module('adf.widget.redmine')
  .factory('redmineService', function ($http, redmineEndpoint, redmineRedirectEndpoint, $q) {
    return new RedmineApiService($http, redmineEndpoint, redmineRedirectEndpoint, $q);
  });
