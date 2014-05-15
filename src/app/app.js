angular.module("myApp", [
        'myApp.hcamp',
        'chieffancypants.loadingBar',
        'ui.bootstrap',
        'cgForm',
        'cgGrid',
        'appDefaultConfig',
        'appRoutes',
        'idService',
        'appService',
        'stateTransitions',
        'templates-app',
        'templates-common',
        'ui.router.state',
        'ui.router',
        'myApp.security',
        'myApp.report',
        'toaster',
        'sync',
        'angularjs.media.directives',
        'myApp.trackParticipant',
        'phnInvitation'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {

        //Todo add default landing page
        $urlRouterProvider.otherwise('/hcamp/wrkstn/1');

    });