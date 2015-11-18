/// <reference path="../../../typings/tsd.d.ts" />

namespace app {

    /**
     * Admin view controller
     */
    class AdminController {
        storage: any;

        // @ngInject
        constructor($localStorage) {
            this.storage = $localStorage;
        }

        addReader():void {
            this.storage.readers.push({id: null});
        }

        removeReader(index:number):void {
            this.storage.readers.splice(index, 1);
        }
    }

    angular
        .module('app')
        .controller('AdminController', AdminController);

}
