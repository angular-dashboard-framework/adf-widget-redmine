'use strict';

angular.module('adf.widget.redmine')
  .controller('editChartController', function (projects, config, redmineService) {
    var vm = this;
    vm.config = config;
    vm.filters = [
      {id:'version',name:'Fixed Version'},
      {id:'assigned',name:'Assigned to'},
      {id:'tracker',name:'Tracker'}
    ]


    if (angular.equals({}, config)) {
      vm.config.project = "";
      vm.config.showClosed = true;
    }

    vm.addFilter = function(filter){
      if(filter === 'version'){
        vm.config.filterWithVersion = true;
      } else if (filter === 'assigned'){
        vm.config.filterWithAssigned = true;
      } else if (filter === 'tracker'){
        vm.config.filterWithTracker = true;
      }
      vm.filterToAdd = 'none';
    }

    if (!vm.config.timespan) {
      vm.config.timespan = {};
    }
    // convert strings to date objects
    if (vm.config.timespan.fromDateTime) {
      vm.config.timespan.fromDateTime = new Date(vm.config.timespan.fromDateTime);
      vm.config.timespan.toDateTime = new Date(vm.config.timespan.toDateTime);
    }

    vm.projects = projects;


    vm.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

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
    if (!vm.dateOptions) {
      vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    }

    vm.toggleMin = function () {
      vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
      vm.dateOptions.minDate = vm.inlineOptions.minDate;
    };

    vm.toggleMin();

    vm.open1 = function () {
      vm.popup1.opened = true;
    };

    vm.open2 = function () {
      vm.popup2.opened = true;
    };

    vm.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.popup1 = {
      opened: false
    };

    vm.popup2 = {
      opened: false
    };

    vm.updateVersions = function(){
      if (vm.config.project) {
        if (vm.config.project === 'All'){
          vm.versions = [];
          return;
        }
        redmineService.getVersions(angular.fromJson(vm.config.project).identifier).then(function (versions) {
          vm.versions = versions;
        });
      }
    };

    vm.checkUpdates = function(){
      if (vm.config.filterWithVersion) {
        vm.updateVersions();
      }
    };

    vm.updateVersionEnd =function(){
      vm.config.timespan.toDateTime = new Date(angular.fromJson(vm.config.version).due_date);
      var date = new Date(vm.config.timespan.toDateTime);
      vm.config.timespan.fromDateTime = date.setDate(date.getDate()-14);
    };

    vm.updateTracker = function(){
      redmineService.getTrackers().then(function (trackers) {
          vm.trackers = trackers;
        });
    }

  });
