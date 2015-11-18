/// <reference path="../../../typings/tsd.d.ts" />

namespace app {

    class ReaderApi {
        // @ngInject
        constructor(public $http) {}

        getReaderReviews(readerId:string) {
            return this.$http({
                method: 'get',
                url: '/api/readers/' + readerId + '/reviews'
            }).then(function(result) {
                return result.data;
            });
        }

        getReaderInfo(readerId:string) {
            return this.$http({
                method: 'get',
                url: '/api/readers/' + readerId
            }).then(function(result) {
                return result.data;
            });
        }
    }

    angular
        .module('app')
        .service('readerApi', ReaderApi);
}

