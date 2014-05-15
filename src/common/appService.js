angular.module('appService', ['appDefaultConfig'])
    .factory('AppService', function ($http, AppDefaultConfig) {

        var restUrl = AppDefaultConfig.serviceBaseUrl + 'api/rest';

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
                return $http.get(AppDefaultConfig.serviceBaseUrl + 'api/ValidationService/wrkstn/' + wrkstn + '/' + memberId);
            },
            updateReportCardStatus: function (memberId) {
                return $http.get(AppDefaultConfig.serviceBaseUrl + 'api/rest/reportCardStatus/' + memberId);
            },
            cleanup: function () {

                return $http.get(restUrl + '/cleanUp');
            },
            getVerificationDetails: function (memberId) {
                return $http.get(restUrl + '/verification/' + memberId);
            },
            generateInvitationPnhLinks: function (data) {
              return  $http.post(AppDefaultConfig.serviceBaseUrl+'api/generatePhnInvitationLinks/generate',data);
            }

        };

    });