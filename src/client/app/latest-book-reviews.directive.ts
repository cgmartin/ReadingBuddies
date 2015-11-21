/// <reference path="../tsd.d.ts" />
/// <reference path="reader-api.service.ts" />
/// <reference path="reader.class.ts" />

namespace app {
    'use strict';

    /**
     * The latest book reviews for a reader
     * <latest-book-reviews reader-model="reader"/>
     */
    // @ngInject
    function latestBookReviewsDirective(readerApi: IReaderApi): angular.IDirective {

        let link: Function = (scope: angular.IScope) => {
            scope.$watch('readerModel', fetchReaderData);

            function fetchReaderData(): void {
                scope['reader'] = null;
                scope['reviewData'] = null;

                if (!scope['readerModel']) { return; }

                readerApi
                    .getReaderReviews((<Reader>scope['readerModel']).id)
                    .then((data: {}) => {
                        console.log(data);
                        scope['reviewData'] = data;
                    });

                readerApi
                    .getReaderInfo((<Reader>scope['readerModel']).id)
                    .then((data: {}) => {
                        console.log(data);
                        scope['reader'] = data;
                    });
            }
        };

        return {
            restrict: 'EA',
            scope: {
                readerModel: '='
            },
            replace: false,
            templateUrl: 'app/latest-book-reviews.partial.html',
            link: link
        };
    }

    angular
        .module('app')
        .directive('latestBookReviews', latestBookReviewsDirective);

}
