angular.module("myApp", [
        'myApp.hcamp',
        'chieffancypants.loadingBar',
        'ui.bootstrap',
        'cgForm',
        'cgGrid',
        'appRoutes',
        'idService',
        'appService',
        'stateTransitions',
        'templates-app',
        'templates-common',
        'ui.router.state',
        'ui.router',
        'security',
        'report',
        'toaster',
        'sync',
        'angularjs.media.directives',
        'myApp.trackParticipant',
        'phnInvitation',
        'schemaLoader'
    ])
    .config(function ($urlRouterProvider, $httpProvider) {

        var reqInterceptor = function () {
            return {
                'request': function (config) {
                    var url = config.url
                    if (url.indexOf("api/") !== -1)
                        config.url = 'http://localhost:8080/' + url
                    return config;
                }
            };

        }
        //$httpProvider.interceptors.push(reqInterceptor);

        $urlRouterProvider.otherwise('/hcamp/wrkstn/1')
    })