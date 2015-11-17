(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    /**
     * Home view controller
     */
    // @ngInject
    function HomeController($localStorage) {
        var vm = this;
        vm.$storage = $localStorage;
    }
})();
