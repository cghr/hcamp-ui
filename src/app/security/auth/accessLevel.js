angular.module('accessLevel', ['authService'])
    .directive('accessLevel', function (Auth) {

        function postLink($scope, element, attrs) {

            var prevDisp = element.css('display'),
                userRole, accessLevel

            $scope.user = Auth.user
            $scope.$watch('user', function (user) {

                if (user.role)
                    userRole = user.role

                updateCSS()
            }, true)

            attrs.$observe('accessLevel', function (al) {
                if (al)
                    accessLevel = $scope.$eval(al)

                updateCSS()
            })

            function updateCSS() {

                if (userRole && accessLevel) {
                    var elmDisplay = !Auth.authorize(accessLevel, userRole) ? "none" : prevDisp
                    element.css('display', elmDisplay)
                }
            }
        }

        return {
            restrict: 'A',
            link: postLink
        }
    }
)