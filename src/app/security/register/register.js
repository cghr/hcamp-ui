angular.module('register', ['ui.router', 'auth', 'toaster'])
    .config(function ($stateProvider, routingConfig) {

        var access = routingConfig.accessLevels();
        $stateProvider.state('register', {
            url: "/register",
            controller: "RegisterCtrl",
            templateUrl: "security/register/register.tpl.html",
            access: access.anon
        });
    })
    .controller('RegisterCtrl', function ($rootScope, $scope, $location, Auth, toaster) {

        $scope.role = Auth.userRoles.user;
        $scope.userRoles = Auth.userRoles;

        $scope.register = function (user) {

            toaster.pop('info', "Alert", "Registration successful !");
            Auth.register(user, done, fail);

            function done() {
                $location.path('/');
            }

            function fail(err) {
                $rootScope.error = err;
            }

        };
    });