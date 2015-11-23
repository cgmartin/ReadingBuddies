namespace app {
    'use strict';

    /**
     * The latest book reviews for a readers
     * <latest-book-reviews reader-model="reader"/>
     */
    function latestBookReviewsDirective(readerApi: IReaderApi): angular.IDirective {

        // @ngInject
        let link: Function = (scope: any) => {

            scope.$watch('readerModel', fetchReaderData);

            function fetchReaderData(): void {
                scope.reader = null;
                scope.reviewData = null;

                if (scope.readerModel) {
                    readerApi
                        .getReaderReviews(scope.readerModel.id)
                        .then((data: any) => {
                            console.log(data);
                            scope.reviewData = data;
                        });

                    readerApi
                        .getReaderInfo(scope.readerModel.id)
                        .then((data: any) => {
                            console.log(data);
                            scope.reader = data;
                        });
                }
            }
        };

        return {
            restrict: 'EA',
            scope: {
                readerModel: '='
            },
            replace: false,
            templateUrl: '/app/latest-book-reviews.partial.html',
            link: link
        };
    }

    angular
        .module('app')
        .directive('latestBookReviews', latestBookReviewsDirective);

}
