(function () {
    'use strict';

    angular
        .module('app')
        .service('readerApi', ReaderApi);

    // @ngInject
    function ReaderApi($http) {
        this.getReaderReviews = function(readerId) {
            return $http({
                method: 'get',
                url:    '/api/readers/' + readerId + '/reviews'
            }).then(function (result) {
                return result.data;
            });
        };

        this.getReaderInfo = function(readerId) {
            return $http({
                method: 'get',
                url:    '/api/readers/' + readerId
            }).then(function (result) {
                return result.data;
            });
        };
    }
})();

