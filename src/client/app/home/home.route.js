(function() {
    'use strict';

    angular
        .module('app.home')
        .config(initRoutes);

    /**
     * Initialize the routes for this module
     */
    // @ngInject
    function initRoutes($stateProvider) {
        $stateProvider
            // Example views
            .state('home', {
                url: '/',
                templateUrl: 'app/home/home.partial.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            });
    }

})();
