var app;
(function (app) {
    'use strict';
    var Reader = (function () {
        function Reader(id) {
            this.id = id;
        }
        return Reader;
    })();
    app.Reader = Reader;
})(app || (app = {}));
