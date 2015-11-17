(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminController', AdminController);

    /**
     * Admin view controller
     */
    // @ngInject
    function AdminController($localStorage) {
        var vm = this;
        vm.$storage = $localStorage;

        vm.addReader = function() {
            vm.$storage.readers.push({id: null});
        };

        vm.removeReader = function(index) {
            vm.$storage.readers.splice(index, 1);
        };
    }
})();
