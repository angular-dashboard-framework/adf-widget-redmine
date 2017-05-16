'use strict';

angular.module('adf.widget.redmine')
  .controller('editChartController', function (projects, config) {
    var vm = this;
    vm.config = config;

    if (angular.equals({}, config)) {
      config.project = "";
      config.showClosed = true;
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

  });
