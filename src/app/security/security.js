angular.module('security', [
        'ui.router',
        'ngCookies',
        'auth',
        'login',
        'forgotPassword',
        'register',
        'navigation'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {


        var authInterceptor = ['$location', '$q',
            function ($location, $q) {

                function done(response) {
                    return response
                }

                function fail(response) {

                    if (response.status === 401)
                        $location.path('/login')

                    return $q.reject(response)

                }

                return function (promise) {
                    return promise.then(done, fail)
                }
            }
        ]


        $httpProvider.responseInterceptors.push(authInterceptor)

    })
    .run(function ($rootScope, $location, Auth, $cookieStore, $timeout, routingConfig) {

        $rootScope.accessLevels = routingConfig.accessLevels()

        $rootScope.$on("$stateChangeStart", function (event, next, current) {
            next.access = next.access || routingConfig.accessLevels().user

            $rootScope.error = null
            if (!Auth.authorize(next.access)) {

                var redirectPath = Auth.isLoggedIn() ? '/' : '/login'
                $location.path(redirectPath)

            }
        })
    })
