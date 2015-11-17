(function () {
    'use strict';

    angular
        .module('app.core')
        .config(initRouter);

    /**
     * Initialize the router's default behaviors
     */
    // @ngInject
    function initRouter($locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
    }
})();
