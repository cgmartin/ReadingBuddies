/// <reference path="../../../typings/tsd.d.ts" />

namespace app {

    /**
     * Home view controller
     */
    class HomeController {
        storage: any;

        // @ngInject
        constructor($localStorage) {
            this.storage = $localStorage;
        }
    }

    angular
        .module('app')
        .controller('HomeController', HomeController);
}
