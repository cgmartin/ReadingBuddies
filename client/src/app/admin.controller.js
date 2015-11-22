/// <reference path="../tsd.d.ts" />
/// <reference path="reader.class.ts" />
var app;
(function (app) {
    'use strict';
    /**
     * Admin view controller
     */
    var AdminController = (function () {
        // @ngInject
        function AdminController($localStorage) {
            this.storage = $localStorage;
        }
        AdminController.prototype.addReader = function () {
            this.storage['readers'].push(new app.Reader(null));
        };
        AdminController.prototype.removeReader = function (index) {
            this.storage['readers'].splice(index, 1);
        };
        return AdminController;
    })();
    angular
        .module('app')
        .controller('AdminController', AdminController);
})(app || (app = {}));
