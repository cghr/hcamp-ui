angular.module('sideMenu', [])
    .directive('sideMenu', function () {

        return {
            restrict: 'E',
            scope: { config: '=' },
            templateUrl: 'sideMenu/sideMenu.html'
        }
    });
