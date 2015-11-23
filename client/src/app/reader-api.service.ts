namespace app {
    'use strict';

    export interface IReaderApi {
        getReaderReviews(readerId: string): angular.IPromise<any>;
        getReaderInfo(readerId: string): angular.IPromise<any>;
    }

    class ReaderApi implements IReaderApi {
        constructor(public $http: angular.IHttpService) {}

        public getReaderReviews(readerId: string): angular.IPromise<any> {
            return this.$http({
                method: 'get',
                url: `/api/readers/${readerId}/reviews`
            }).then((result: {data: any}) => result.data);
        }

        public getReaderInfo(readerId: string): angular.IPromise<any> {
            return this.$http({
                method: 'get',
                url: `/api/readers/${readerId}`
            }).then((result: {data: any}) => result.data);
        }
    }

    angular
        .module('app')
        .service('readerApi', ReaderApi);

}

