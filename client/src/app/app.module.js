/// <reference path="../tsd.d.ts" />
var app;
(function (app) {
    'use strict';
    angular.module('app', [
        'ngSanitize',
        'ui.router',
        'ngStorage'
    ]);
})(app || (app = {}));
