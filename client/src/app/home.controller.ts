namespace app {
    'use strict';

    /**
     * Home view controller
     */
    class HomeController {
        static $inject: Array<string> = ['$localStorage'];

        constructor(public storage: ngStorage.IStorageService) {}
    }

    angular
        .module('app')
        .controller('HomeController', HomeController);

}

