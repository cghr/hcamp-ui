angular.module('navigation', ['auth'])
    .controller('NavCtrl', function ($location, Auth,$rootScope) {

        var vm = this
        vm.user = Auth.user;
        vm.userRoles = Auth.userRoles;
        vm.accessLevels = Auth.accessLevels;

        vm.logout = function () {

            Auth.logout(function () {
                $rootScope.user = { username: '', role: vm.userRoles.public }
                $location.path('/login')

            }, function () {
                $rootScope.error = "Failed to logout"
            })

        };
    });