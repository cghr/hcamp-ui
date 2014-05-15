angular.module('appDefaultConfig', [])
    .factory('AppDefaultConfig', function ($window) {

        var baseUrl = 'http://localhost:8080/hcamp/';
        var serviceUrl = '';
        var windowUrl = $window.location.href;
        if (windowUrl.indexOf(baseUrl) == -1) {
            serviceUrl = 'http://localhost:8080/';
        }

        return { serviceBaseUrl: serviceUrl };

    });
