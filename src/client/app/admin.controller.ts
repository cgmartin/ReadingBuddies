/// <reference path="../tsd.d.ts" />

namespace app {
    'use strict';

    /**
     * Admin view controller
     */
    class AdminController {
        public storage: ngStorage.IStorageService;

        // @ngInject
        constructor($localStorage: ngStorage.IStorageService) {
            this.storage = $localStorage;
        }

        public addReader(): void {
            this.storage['readers'].push({id: null});
        }

        public removeReader(index: number): void {
            this.storage['readers'].splice(index, 1);
        }
    }

    angular
        .module('app')
        .controller('AdminController', AdminController);

}