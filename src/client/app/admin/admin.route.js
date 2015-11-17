(function() {
    'use strict';

    angular
        .module('app.admin')
        .config(initRoutes);

    /**
     * Initialize the routes for this module
     */
    // @ngInject
    function initRoutes($stateProvider) {
        $stateProvider
            // Example views
            .state('admin', {
                url: '/configuration',
                templateUrl: 'app/admin/admin.partial.html',
                controller: 'AdminController',
                controllerAs: 'vm'
            });
    }

})();
