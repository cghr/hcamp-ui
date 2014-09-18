angular.module('schemaLoader', ['lodash'])
    .factory('SchemaLoader', function SchemaLoader(_, $http, $q, $log) {


        SchemaLoader.allSchemas = []

        SchemaLoader.loadAllSchemas = function (schemaNames, schemaPath) {

            var promises = _.map(schemaNames, function (schema) {
                return $http.get(schemaPath + schema + '.json')
            })

            return $q.all(promises)
                .then(function (responses) {
                    _.each(responses, function (response, index) {
                        SchemaLoader.allSchemas.push(response.data)
                    })

                }, function () {
                    $log.error('Failed to load json schemas')
                    $log.error(e)

                })
        }
        return SchemaLoader

    })