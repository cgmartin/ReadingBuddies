/// <reference path="../../../typings/tsd.d.ts" />

describe('Reader Module', () => {
    let element: angular.IAugmentedJQuery;
    let $scope: angular.IScope;
    let readerApiMock: any;

    beforeEach(angular.mock.module('app', ($provide: angular.auto.IProvideService) => {
        readerApiMock = {
            getReaderReviews: sinon.stub(),
            getReaderInfo: sinon.stub()
        };
        $provide.value('readerApi', readerApiMock);
    }));

    beforeEach(inject(($compile: angular.ICompileService,
                       $rootScope: angular.IRootScopeService) => {
        $scope = $rootScope.$new();
        element = angular.element('<latest-book-reviews reader-model="readerModel"></latest-book-reviews>');
        $compile(element)($scope);
        $scope.$digest();
    }));

    describe('latestBookReviews Directive', () => {
        it('should display no reviews when empty', inject(($q: angular.IQService) => {
            let readerInfo: any = {
                name: 'test',
                website: 'website'
            };
            let reviewData: any = {review: []};
            readerApiMock.getReaderReviews.withArgs(1).returns($q.when(reviewData));
            readerApiMock.getReaderInfo.withArgs(1).returns($q.when(readerInfo));
            $scope['readerModel'] = {id: 1};
            $scope.$apply();

            let parentDiv: angular.IAugmentedJQuery =
                angular.element(element[0].querySelector('.latest-book-reviews'));
            chai.expect(parentDiv.attr('id')).to.eql('1');
            chai.expect(parentDiv.find('h3').html()).to.eql(
                '<a ng-href="website" class="ng-binding" href="website">test</a>'
            );
            chai.expect(angular.element(parentDiv[0].querySelector('.reviews'))
                .children().length).to.eql(0);
        }));

        it('should display reviews that exist', inject(($q: angular.IQService) => {
            let readerInfo: any = {
                name: 'reviewsTest',
                website: 'website'
            };
            let reviewData: any = {
                review: [{
                    rating: 3, link: 'reviewLink',
                    book: { 'image_url': '/fake.png', title: 'bookTitle' }
                }]
            };
            readerApiMock.getReaderReviews.withArgs(2).returns($q.when(reviewData));
            readerApiMock.getReaderInfo.withArgs(2).returns($q.when(readerInfo));
            $scope['readerModel'] = {id: 2};
            $scope.$apply();

            let parentDiv: angular.IAugmentedJQuery =
                angular.element(element[0].querySelector('.latest-book-reviews'));
            chai.expect(parentDiv.attr('id')).to.eql('2');
            chai.expect(parentDiv.find('h3').html()).to.eql(
                '<a ng-href="website" class="ng-binding" href="website">reviewsTest</a>'
            );
            chai.expect(angular.element(parentDiv[0].querySelector('.reviews'))
                .children().length).to.eql(1);
        }));
    });
});
