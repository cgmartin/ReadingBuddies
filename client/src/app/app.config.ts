(function () {
    'use strict';

    angular
        .module('app')
        .config(initDebug)
        .config(initRouter)
        .config(initStorage);

    /**
     * Toggle debug info data (better disabled in production environments)
     * https://docs.angularjs.org/guide/production
     */
    // @ngInject
    function initDebug($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }

    /**
     * Initialize the router's default behaviors
     */
    // @ngInject
    function initRouter($locationProvider, $urlRouterProvider, $stateProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/app/home.partial.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            })
            .state('admin', {
                url: '/configuration',
                templateUrl: '/app/admin.partial.html',
                controller: 'AdminController',
                controllerAs: 'vm'
            });
    }

    /**
     * Initialize localStorage default values
     */
    // @ngInject
    function initStorage($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('ReadingFriends_');

        var readers = $localStorageProvider.get('readers');
        if (!readers || !angular.isArray(readers) || readers.length === 0) {
            $localStorageProvider.set('readers', [
                {id: '93524-tom-merritt'},
                {id: '895115-veronica-belmont'},
                {id: '2040005-wil-wheaton'},
                {id: '666892-felicia'},
                {id: '922495-patrick'},
                {id: '10915830-sasha-alsberg'},
                {id: '8114361-jesse-jessethereader'}
            ]);
        }
    }

})();
