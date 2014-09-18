angular.module('myApp.hcamp', ['ui.router', 'routeConfigHandler', 'appRoutes', 'toaster', 'appService', 'stateTransitions'])
    .config(function ($stateProvider, hcampRoutes, RouteConfigHandler) {

        $stateProvider.state(hcampRoutes.name, {
            url: hcampRoutes.url,
            templateUrl: hcampRoutes.tpl
        });

        RouteConfigHandler.configureRoutesForChildren($stateProvider, hcampRoutes.name, hcampRoutes.children);

    })
    .controller('hcampCtrl', function ($scope, $location, StateTransitions, $state, $stateParams, $rootScope, $log, AppService, $http, toaster) {

        //Scan Barcode for identifying participant either invitation card or wrist band
        $scope.scanBarcode = function (barcode) {


            var fulFill = function (resp) {
                console.log(resp);
                var memberId = resp.data.memberId;
                var str = $state.current.name;
                var wrkstn = str.substring(12, 14);
                AppService.isValidParticipant(wrkstn, memberId).then(function () {

                    if (!$state.includes('hcamp.wrkstn1')) {
                        $location.path($location.url() + '/participant/' + memberId);
                        AppService.getBasicInfo(memberId).then(function (resp) {
                            console.log(resp.data);
                            $rootScope.person = resp.data;
                        });
                    } else {
                        $location.path($location.url() + '/participant/' + memberId);
                        AppService.getBasicInfo(memberId).then(function (resp) {
                            console.log(resp.data);
                            $rootScope.person = resp.data;
                        });
                    }

                }, function () {
                    toaster.pop('error', '', 'Invalid Participant');
                });


            };
            var reject = function (err) {
                console.log(err);
            };
            if (!$state.includes('hcamp.wrkstn1')) {
                console.log('wrkstn 1 ');
                AppService.getMemberIdFromWristBand(barcode).then(fulFill, reject);
            } else {
                AppService.getMemberIdFromInvitationCard(barcode).then(fulFill, reject);
            }

        };

        // Clean up all workstations data for dev purpose
        $scope.cleanUp = function () {

            var cleanUp = confirm("Hey ! Are you sure ?");
            angular.noop = (cleanUp === true) ? cleanUpData() : angular.noop;

            function cleanUpData() {
                $http.get('api/rest/cleanUp').then(function () {
                    toaster.pop('info', '', 'Cleanup Successful !');
                });
            }
        };

        // Tracking participant
        $scope.trackParticipant = function (wristBand) {

            $location.path('/trackParticipant/' + wristBand);
            $scope.trackParticipantId = '';


        };
    });


