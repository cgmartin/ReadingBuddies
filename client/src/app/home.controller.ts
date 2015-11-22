/// <reference path="../tsd.d.ts" />

namespace app {
    'use strict';

    /**
     * Home view controller
     */
    class HomeController {
        public storage: ngStorage.IStorageService;

        // @ngInject
        constructor($localStorage: ngStorage.IStorageService) {
            this.storage = $localStorage;
        }
    }

    angular
        .module('app')
        .controller('HomeController', HomeController);
}
