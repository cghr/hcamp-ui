angular.module('phnInvitation', ['ui.router', 'toaster', 'appService'])
    .config(function ($stateProvider) {

        $stateProvider.state('phnInvitation', {
            url: '/phnInvitation',
            templateUrl: 'phnInvitationCard/phnInvitationCard.tpl.html',
            controller: 'phnInvitationCtrl'
        });

    })
    .controller('phnInvitationCtrl', function ($scope, toaster, AppService) {

        console.log('staring to generate');
        $scope.generatePhnInvitationLinks = function (data) {

            AppService.generateInvitationPnhLinks(data).then(function (resp) {

                toaster.pop('success','','Generate Succesfully');
            });


        };
    });