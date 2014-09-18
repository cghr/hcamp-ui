angular.module('myApp')
    .controller('AppController', function (toaster, $scope, $location, StateTransitions, $state, $stateParams, $rootScope, $log, AppService, $http, IDService) {

        //Generalised Add New Item Function
        $scope.addNew = function () {
            IDService.getNextID().then(function (data) {
                angular.forEach(StateTransitions, function (transition) {
                    if ($state.current.name === transition.from) {
                        $stateParams[transition.param] = data.id;
                        $state.go(transition.to, $stateParams);
                        return;
                    }
                });
            }, function (fail) {

                angular.forEach(StateTransitions, function (transition) {
                    if ($state.current.name === transition.from) {
                        $state.go(transition.to, $stateParams);
                        return;
                    }
                });
            });
        };
        $scope.cleanUp = function () {

            AppService.cleanup().then(function () {

                toaster.pop('success', '', 'Clean up success');
            });
        };
        $scope.trackParticipant = function (wristBand) {

            $location.url('/trackParticipant/' + wristBand);
        };
        $rootScope.gmonData = {};
        $scope.getData = function () {

            AppService.getGmonData($stateParams.memberId).then(function (resp) {
                console.log('gmon data');
                console.log(resp.data);

                $rootScope.gmonData = resp.data;
            }, function () {
                toaster.pop('error', '', 'Failed to get Gmon Data');
            });

        };


    })
    .controller('reportCardCtrl', function ($scope, AppService, $stateParams, $state) {

        var memberId = $stateParams.memberId;
        $scope.data = {};
        AppService.getReportCardData(memberId).then(function (resp) {
            console.log(resp.data);
            $scope.data = resp.data;
        });
        $scope.reportCardUpdate = function () {

            console.log('in report card update');
            AppService.updateReportCardStatus(memberId).then(function () {
                console.log('successful request');
                $state.go('hcamp.wrkstn7');
            });
        };

    })
    .controller('registrationCtrl', function (AppService, $stateParams, $scope) {

        console.log('registration ctrl');
        var memberId = $stateParams.memberId;
        $scope.verificationdata = {};
        AppService.getVerificationDetails(memberId).then(function (resp) {

            console.log(resp.data);
            $scope.verificationData = resp.data;

        });
    });
