angular.module('appService', [])
    .factory('AppService', function ($http) {

        var restUrl = 'api/rest';

        return {

            getMemberIdFromWristBand: function (wristBand) {
                return $http.get(restUrl + '/wristBand/' + wristBand);
            },
            getMemberIdFromInvitationCard: function (invitationCard) {
                return $http.get(restUrl + '/invitationCard/' + invitationCard);
            },
            getReportCardData: function (participantId) {
                return $http.get(restUrl + '/reportCard/' + participantId);
            },
            getPatientStatus: function (wristBand) {
                return $http.get(restUrl + '/participant/status/' + wristBand);
            },
            isValidParticipant: function (wrkstn, memberId) {
                return $http.get('api/ValidationService/wrkstn/' + wrkstn + '/' + memberId);
            },
            updateReportCardStatus: function (memberId) {
                return $http.get('api/rest/reportCardStatus/' + memberId);
            },
            cleanup: function () {

                return $http.get(restUrl + '/cleanUp');
            },
            getVerificationDetails: function (memberId) {
                return $http.get(restUrl + '/verification/' + memberId);
            },
            generateInvitationPnhLinks: function (data) {
                return  $http.post('api/generatePhnInvitationLinks/generate', data);
            },
            getBasicInfo: function (memberId) {
                console.log('memberId basic Info ' + memberId);
                return $http.get(restUrl + '/basicInfo/' + memberId);
            },
            getGmonData: function (memberId) {

                return $http.get('http://localhost:9000/gmon-util/api/bodyImp/' + memberId);
            }

        };

    });