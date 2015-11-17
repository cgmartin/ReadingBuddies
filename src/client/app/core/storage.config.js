(function () {
    'use strict';

    angular
        .module('app.core')
        .config(initStorage);

    /**
     * Initialize localStorage default values
     */
    // @ngInject
    function initStorage($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('ReadingFriends_');

        var readers = $localStorageProvider.get('readers');
        if (!readers || !angular.isArray(readers) || readers.length === 0) {
            $localStorageProvider.set('readers', [
                {id: '93524-tom-merritt'},
                {id: '895115-veronica-belmont'},
                {id: '2040005-wil-wheaton'},
                {id: '666892-felicia'},
                {id: '922495-patrick'},
                {id: '10915830-sasha-alsberg'},
                {id: '8114361-jesse-jessethereader'}
            ]);
        }
    }
})();
