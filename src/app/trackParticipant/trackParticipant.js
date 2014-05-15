angular.module('myApp.trackParticipant', ['ui.router','appService'])
    .config(function($stateProvider) {

        $stateProvider.state('trackParticipant', {
            url: '/trackParticipant/:wristBand',
            templateUrl: 'trackParticipant/trackParticipant.tpl.html',
            controller: 'TrackParticipantCtrl'
        });
    })
    .controller('TrackParticipantCtrl', function($scope, AppService, $stateParams) {

        $scope.wrkstns = [{
            id: 'wrkstn1',
            label: 'Registration',
            status: 'error'
        }, {
            id: 'wrkstn2',
            label: 'Peak Flow - BP1',
            status: 'error'
        }, {
            id: 'wrkstn3',
            label: 'Hand Grip-Body Impedance',
            status: 'error'
        }, {
            id: 'wrkstn4',
            label: 'Blood Collection - BP2',
            status: 'error'
        }, {
            id: 'wrkstn5',
            label: 'Report Card',
            status: 'error'
        }];


        AppService.getPatientStatus($stateParams.wristBand).then(function(resp) {

            $scope.data = resp.data;
            console.log(resp.data);

            angular.forEach($scope.wrkstns, function(wrkstn) {

                wrkstn.status = $scope.data[(wrkstn.id)];
            });
            //$scope.trackParticipantId='';
        });


    });