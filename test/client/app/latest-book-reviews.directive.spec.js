describe('Reader Module', function() {
    var element;
    var $scope;
    var readerApiMock;

    beforeEach(module('app', function($provide) {
        readerApiMock = {
            getReaderReviews: sinon.stub(),
            getReaderInfo: sinon.stub()
        };
        $provide.value('readerApi', readerApiMock);
    }));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        element = angular.element('<latest-book-reviews reader-model="readerModel"></latest-book-reviews>');
        $compile(element)($scope);
        $scope.$digest();
    }));

    describe('latestBookReviews Directive', function() {
        it('should display no reviews when empty', inject(function($q) {
            var readerInfo = {
                name: 'test',
                website: 'website'
            };
            var reviewData = {review: []};
            readerApiMock.getReaderReviews.withArgs(1).returns($q.when(reviewData));
            readerApiMock.getReaderInfo.withArgs(1).returns($q.when(readerInfo));
            $scope.readerModel = {id: 1};
            $scope.$apply();

            var parentDiv = angular.element(element[0].querySelector('.latest-book-reviews'));
            expect(parentDiv.attr('id')).to.eql('1');
            expect(parentDiv.find('h3').html()).to.eql(
                '<a ng-href="website" class="ng-binding" href="website">test</a>'
            );
            expect(angular.element(parentDiv[0].querySelector('.reviews'))
                .children().length).to.eql(0);
        }));

        it('should display reviews that exist', inject(function($q) {
            var readerInfo = {
                name: 'reviewsTest',
                website: 'website'
            };
            var reviewData = {
                review: [{
                    rating: 3, link: 'reviewLink',
                    book: { 'image_url': '/fake.png', title: 'bookTitle' }
                }]
            };
            readerApiMock.getReaderReviews.withArgs(2).returns($q.when(reviewData));
            readerApiMock.getReaderInfo.withArgs(2).returns($q.when(readerInfo));
            $scope.readerModel = {id: 2};
            $scope.$apply();

            var parentDiv = angular.element(element[0].querySelector('.latest-book-reviews'));
            expect(parentDiv.attr('id')).to.eql('2');
            expect(parentDiv.find('h3').html()).to.eql(
                '<a ng-href="website" class="ng-binding" href="website">reviewsTest</a>'
            );
            expect(angular.element(parentDiv[0].querySelector('.reviews'))
                .children().length).to.eql(1);
        }));
    });
});
