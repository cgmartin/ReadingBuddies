/// <reference path="../tsd.d.ts" />
var app;
(function (app) {
    'use strict';
    /**
     * Home view controller
     */
    var HomeController = (function () {
        // @ngInject
        function HomeController($localStorage) {
            this.storage = $localStorage;
        }
        return HomeController;
    })();
    angular
        .module('app')
        .controller('HomeController', HomeController);
})(app || (app = {}));
