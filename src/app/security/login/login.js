angular.module('login', ['ui.router', 'auth', 'toaster', 'angular-md5'])
    .config(function ($stateProvider, routingConfig) {

        var access = routingConfig.accessLevels()

        $stateProvider.state('login', {
            url: "/login",
            controller: "LoginCtrl",
            controllerAs: 'loginCtrl',
            templateUrl: "security/login/login.html",
            access: access.anon
        })
    })
    .controller('LoginCtrl', function ($scope, $rootScope, $location, $window, Auth, toaster, md5) {

        this.login = function (data) {
            var user = {username: data.username, password: md5.createHash(data.password)}
            Auth.login(user, done, fail)
        }

        function done(res) {
            $rootScope.user = res
            $location.path('/')
        }

        function fail() {
            toaster.pop('error', '', 'Invalid username/password')
        }

    })