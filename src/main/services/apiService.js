'use strict';

function ApiService($http, apiEndpoint, apiEndpointRedirect, $q) {
  this.http = $http;
  this.apiEndpoint = apiEndpoint;
  this.apiEndpointRedirect = apiEndpointRedirect;
  this.q = $q;
}

ApiService.prototype.request = function (param) {

  //auth = new Buffer(auth).toString('base64');
  //const auth = $base64.encode('foo:bar'),
  //  headers = {'Authorization': 'Basic ' + auth};

  return this.http.get(this.apiEndpoint + param).then(function (response) {
    return response.data;
  });
};

ApiService.prototype.getProjects = function () {
  return this.request('projects.json').then(function (data) {
    return data.projects;
  });
};

ApiService.prototype.getVersions = function (project) {
  return this.request('projects/' + project + '/versions.json').then(function (data) {
    return data.versions;
  });
};

ApiService.prototype.getIssues = function (config) {
  var params = this.generateGeneralIssuesParameters(config);
  var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
  return this.getIssuesWithParamsAndLimit(params, limit);

};

ApiService.prototype.getIssuesForChart = function (config) {
  var allIssues = [];
  var limit = config.limit ? config.limit : Number.MAX_SAFE_INTEGER;
  var params1 = this.generateParametersForIssuesOpenOnEnd(config);
  var params2 = this.generateParametersForIssuesClosedBetweenStartAndEnd(config);
  var params3 = this.generateParametersForIssuesOpen(config);
  return this.q.all([this.getIssuesWithParamsAndLimit(params1, limit), this.getIssuesWithParamsAndLimit(params2, limit),
    this.getIssuesWithParamsAndLimit(params3, limit)]).then(function (responses) {
    angular.forEach(responses, function (issues) {
      angular.forEach(issues, function (issue) {
        allIssues.push(issue);
      });
    });
    return allIssues;
  });
};

ApiService.prototype.getIssuesWithParamsAndLimit = function (params, limit) {
  var allIssues = [];
  return this.collectPageIssues(params, 0).then(function (issues) {
    angular.forEach(issues.issues, function (issue) {
      allIssues.push(issue);
    });
    var requests = [];
    for (var i = 100; i < issues.total_count && i < limit; i = i + 100) {
      requests.push(this.collectPageIssues(params, i));
    }

    if (params.length > 0) {
      return this.q.all(requests).then(function (responses) {
        angular.forEach(responses, function (response) {
          angular.forEach(response.issues, function (issue) {
            allIssues.push(issue);
          });
        });
        return allIssues;
      }).catch(function (error) {
        return {error: error};
      });
    } else {
      return allIssues;
    }
  }.bind(this));
};


ApiService.prototype.collectPageIssues = function (params, offset) {
  return this.request('issues.json' + params + '&offset=' + offset)
    .then(function (issues) {
      return issues;
    }).catch(function (error) {
      return {error: error};
    });
};

ApiService.prototype.generateParametersForIssuesOpenOnEnd = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&status_id=*';
  var toDate = new Date(data.timespan.toDateTime);
  params += '&created_on=<=' + this.dateToYMD(toDate);
  params += '&closed_on=>=' + this.dateToYMD(toDate);
  return params;
};

ApiService.prototype.generateParametersForIssuesOpen = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&status_id=open';
  var toDate = new Date(data.timespan.toDateTime);
  params += '&created_on=<=' + this.dateToYMD(toDate);
  return params;
};

ApiService.prototype.generateParametersForIssuesClosedBetweenStartAndEnd = function (data) {
  var params = this.generateGeneralIssuesParameters(data);
  params += '&status_id=*';
  var fromDate = new Date(data.timespan.fromDateTime);
  var toDate = new Date(data.timespan.toDateTime);
  params += '&closed_on=><' + this.dateToYMD(fromDate) + '|' + this.dateToYMD(toDate);
  return params;
};

ApiService.prototype.generateGeneralIssuesParameters = function (data) {
  var params = '?limit=100&sort=created_on';
  if (data.project && data.project !== 'All') {
    params += '&project_id=' + angular.fromJson(data.project).id;
  }
  if (data.filterWithAssigned && data.assigned_to_id) {
    params += '&assigned_to_id=' + data.assigned_to_id;
  }
  if (data.showClosed) {
    params += '&status_id=*';
  }
  if (data.filterWithVersion && data.version) {
    params += '&fixed_version_id=' + angular.fromJson(data.version).id;
  }
  if (data.filterWithTracker && data.tracker) {
    params += '&tracker_id=' + angular.fromJson(data.tracker).id;
  }
  return params;
};

ApiService.prototype.dateToYMD = function (date) {
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
};

ApiService.prototype.getCustomQueries = function () {
  return this.request('queries.json?limit=100');
};

ApiService.prototype.getIssuesByQueryId = function (queryId, projectId) {
  return this.request('issues.json?query_id=' + queryId + '&project_id=' + projectId).then(function (data) {
    return data.issues;
  });
};

ApiService.prototype.getRedmineEndpoint = function () {
  return this.apiEndpoint;
};

ApiService.prototype.getRedmineRedirectEndpoint = function () {
  return this.apiEndpointRedirect;
};

ApiService.prototype.getTrackers = function () {
  return this.request('trackers.json').then(function (data) {
    return data.trackers;
  });
};

ApiService.prototype.getMyIssues = function () {
  return this.request('issues.json?assigned_to_id=me').then(function (data) {
    return data;
  }).catch(function (error) {
    return {error: error};
  });
};
