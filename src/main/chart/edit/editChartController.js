'use strict';

angular.module('adf.widget.redmine')
  .controller('editChartController', function (projects, config, chartDataService, redmineService) {
    var vm = this;
    vm.config = config;
    vm.projects = projects;
    // functions
    vm.addFilter = addFilter;
    vm.converStringsToDateObjects = converStringsToDateObjects;
    vm.toggleMin = toggleMin;
    vm.open1 = function () {
      vm.popup1.opened = true;
    };

    vm.open2 = function () {
      vm.popup2.opened = true;
    };
    vm.updateVersions = updateVersions;
    vm.checkUpdates = checkUpdates;
    vm.updateVersionEnd = updateVersionEnd;
    vm.updateTracker = updateTracker;

    // init stuff
    vm.filters = [
      { id: 'version', name: 'Fixed Version' },
      { id: 'assigned', name: 'Assigned to' },
      { id: 'tracker', name: 'Tracker' }
    ]

    if (!vm.config.timespan) {
      vm.config.timespan = {};
    }


    vm.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    if (!vm.dateOptions) {
      vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    }


    vm.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.popup1 = {
      opened: false
    };

    vm.popup2 = {
      opened: false
    };

    // calls
    vm.toggleMin();
    vm.converStringsToDateObjects();

    function addFilter(filter) {
      if (filter === 'version') {
        vm.config.filterWithVersion = true;
      } else if (filter === 'assigned') {
        vm.config.filterWithAssigned = true;
      } else if (filter === 'tracker') {
        vm.config.filterWithTracker = true;
      }
      vm.filterToAdd = 'none';
    }

    function converStringsToDateObjects() {
      if (vm.config.timespan.fromDateTime) {
        vm.config.timespan.fromDateTime = new Date(vm.config.timespan.fromDateTime);
        vm.config.timespan.toDateTime = new Date(vm.config.timespan.toDateTime);
      }
    }

    function toggleMin() {
      vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
      vm.dateOptions.minDate = vm.inlineOptions.minDate;
    };

    function updateVersions() {
      if (vm.config.project) {
        if (vm.config.project === 'All') {
          vm.versions = [];
          return;
        }
        redmineService.getVersions(angular.fromJson(vm.config.project).identifier).then(function (versions) {
          vm.versions = versions;
        });
      }
    };

    function checkUpdates() {
      if (vm.config.filterWithVersion) {
        vm.updateVersions();
      }
    };

    function updateVersionEnd() {
      vm.config.timespan.toDateTime = new Date(angular.fromJson(vm.config.version).due_date);
      var date = new Date(vm.config.timespan.toDateTime);
      vm.config.timespan.fromDateTime = date.setDate(date.getDate() - 14);
    };

    function updateTracker() {
      redmineService.getTrackers().then(function (trackers) {
        vm.trackers = trackers;
      });
    }

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < vm.events.length; i++) {
          var currentDay = new Date(vm.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return vm.events[i].status;
          }
        }
      }
      return '';
    }

  });

