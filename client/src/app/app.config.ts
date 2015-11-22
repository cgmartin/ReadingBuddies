/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="reader.class.ts" />

namespace app {
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
    function initDebug($compileProvider: angular.ICompileProvider): void {
        $compileProvider.debugInfoEnabled(true);
    }

    /**
     * Initialize the router's default behaviors
     */
    // @ngInject
    function initRouter($locationProvider: angular.ILocationProvider,
                        $urlRouterProvider: angular.ui.IUrlRouterProvider,
                        $stateProvider: angular.ui.IStateProvider): void {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeController',
                controllerAs: 'vm',
                templateUrl: '/app/home.partial.html',
            })
            .state('admin', {
                url: '/configuration',
                controller: 'AdminController',
                controllerAs: 'vm',
                templateUrl: '/app/admin.partial.html',
            });
    }

    /**
     * Initialize localStorage default values
     */
    // @ngInject
    function initStorage($localStorageProvider: ngStorage.ILocalStorageProvider): void {
        $localStorageProvider.setKeyPrefix('ReadingFriends_');

        let readers: Array<IReader> = <Array<IReader>>$localStorageProvider.get('readers');
        if (!readers || !angular.isArray(readers) || readers.length === 0) {
            $localStorageProvider.set('readers', [
                new Reader('93524-tom-merritt'),
                new Reader('895115-veronica-belmont'),
                new Reader('2040005-wil-wheaton'),
                new Reader('666892-felicia'),
                new Reader('922495-patrick'),
                new Reader('10915830-sasha-alsberg'),
                new Reader('8114361-jesse-jessethereader'),
            ]);
        }
    }
}
