/// <reference path="../tsd.d.ts" />

namespace app {
    'use strict';

    export interface IReaderApi {
        getReaderReviews(readerId: string): angular.IPromise<any>;
        getReaderInfo(readerId: string): angular.IPromise<any>;
    }

    class ReaderApi implements IReaderApi {
        // @ngInject
        constructor(public $http: angular.IHttpService) {}

        public getReaderReviews(readerId: string): angular.IPromise<any> {
            return this.$http
                .get('/api/readers/' + readerId + '/reviews')
                .then((result: {data: {}}) => {
                    return result.data;
                });
        }

        public getReaderInfo(readerId: string): angular.IPromise<any> {
            return this.$http
                .get('/api/readers/' + readerId)
                .then((result: {data: {}}) => {
                    return result.data;
                });
        }
    }

    angular
        .module('app')
        .service('readerApi', ReaderApi);
}

