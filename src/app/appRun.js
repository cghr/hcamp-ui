angular.module('myApp')
    .run(function ($rootScope, AppDefaultConfig, $state, $stateParams, $http, $q, SchemaFactory, GridConfig) {

        $rootScope.serviceBaseUrl = AppDefaultConfig.serviceBaseUrl;

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // Enable Grid auto Update
        GridConfig.autoUpdate = true;
        GridConfig.autoUpdateInterval = 5000;
        
        //Todo all the states with forms
        var states = [
            'hcamp.wrkstn3Participant',
            'hcamp.wrkstn5Participant',
            'hcamp.wrkstn4Participant',
            'hcamp.wrkstn2Participant',
            'hcamp.wrkstn1Participant'];
        var promises = [];


        /* Construct Promises for states which have forms */
        angular.forEach(states, function (state) {
            promises.push($http.get('assets/jsonSchema/' + state + '.json'));
        });

        /* Fire XHR requests and store schemas in JsonSchema Object */
        $q.all(promises).then(function (responses) {
            var i = 0;
            angular.forEach(responses, function (response) {
                SchemaFactory.put(states[i], response.data);
                i++;
            });
        });


    });
