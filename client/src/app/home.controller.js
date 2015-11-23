var app;
(function (app) {
    'use strict';
    /**
     * Home view controller
     */
    var HomeController = (function () {
        function HomeController(storage) {
            this.storage = storage;
        }
        HomeController.$inject = ['$localStorage'];
        return HomeController;
    })();
    angular
        .module('app')
        .controller('HomeController', HomeController);
})(app || (app = {}));
