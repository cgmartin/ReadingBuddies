/// <reference path="../tsd.d.ts" />

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
                    .getReaderReviews(scope['readerModel'].id)
                    .then((data: {}) => {
                        console.log(data);
                        scope['reviewData'] = data;
                    });

                readerApi
                    .getReaderInfo(scope['readerModel'].id)
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
