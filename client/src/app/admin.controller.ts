namespace app {
    'use strict';

    /**
     * Admin view controller
     */
    class AdminController {
        static $inject: Array<string> = ['$localStorage'];

        constructor(public storage: ngStorage.IStorageService) {}

        public addReader(): void {
            this.storage['readers'].push({id: null});
        }

        public removeReader(index: number|string): void {
            this.storage['readers'].splice(index, 1);
        }
    }

    angular
        .module('app')
        .controller('AdminController', AdminController);

}
