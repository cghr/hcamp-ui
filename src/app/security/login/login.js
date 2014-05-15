angular.module('login', ['ui.router', 'auth', 'toaster','angular-md5'])
    .config(function ($stateProvider, routingConfig) {

        var access = routingConfig.accessLevels();
        $stateProvider.state('login', {
            url: "/login",
            controller: "LoginCtrl",
            templateUrl: "security/login/login.tpl.html",
            access: access.anon
        });
    })
    .controller('LoginCtrl', function ($rootScope, $scope, $location, $window, Auth, toaster,md5) {

        $scope.login = function (user) {
            Auth.login({
                    username: user.username,
                    password: md5.createHash(user.password)
                },
                function (res) {
                    $rootScope.user=res;
                    $location.path('/');
                },
                function (err) {
                    toaster.pop('error', "", "Invalid Username/Password");
                });
        };

    });