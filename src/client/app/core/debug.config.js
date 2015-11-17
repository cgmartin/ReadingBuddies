(function () {
    'use strict';

    angular
        .module('app.core')
        .config(initDebug);

    /**
     * Toggle debug info data (better disabled in production environments)
     * https://docs.angularjs.org/guide/production
     */
    // @ngInject
    function initDebug($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }
})();
