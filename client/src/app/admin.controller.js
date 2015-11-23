var app;
(function (app) {
    'use strict';
    /**
     * Admin view controller
     */
    var AdminController = (function () {
        function AdminController(storage) {
            this.storage = storage;
        }
        AdminController.prototype.addReader = function () {
            this.storage['readers'].push({ id: null });
        };
        AdminController.prototype.removeReader = function (index) {
            this.storage['readers'].splice(index, 1);
        };
        AdminController.$inject = ['$localStorage'];
        return AdminController;
    })();
    angular
        .module('app')
        .controller('AdminController', AdminController);
})(app || (app = {}));
