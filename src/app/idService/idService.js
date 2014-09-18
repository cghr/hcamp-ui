angular.module('idService', [])
    .factory('IDService', function IDService($http, $location, $log) {

        IDService.nextID = ''

        IDService.getNextID = function () {


            return $http.get('api/IDService' + $location.url())
                .success(function (data) {
                    IDService.nextID = data.id
                })
                .error(function (err) {
                    $log.error('Failed to getNextID')
                })

        }
        return IDService

    })
