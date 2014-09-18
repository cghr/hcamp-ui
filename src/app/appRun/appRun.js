angular.module('myApp')
    .run(function ($rootScope, $state, $stateParams, SchemaFactory, _, SchemaLoader, toaster,GridConfig) {

        $rootScope.$state = $state
        $rootScope.$stateParams = $stateParams

        // Enable Grid auto Update
        GridConfig.autoUpdate = true;
        GridConfig.autoUpdateInterval = 5000;

        $rootScope.$on("$stateChangeSuccess", function (event, next, current) {

            if ($rootScope.$state.current.msg)
                toaster.pop('info', '', $rootScope.$state.current.msg)

        });

        $rootScope.$on("$stateChangeStart", function (event, next, current) {

            if ($rootScope.$state.current.stateChangeStartMsg)
                toaster.pop('info', '', $rootScope.$state.current.stateChangeStartMsg)

        });
        //Todo all the states with forms
        var states = [
            'hcamp.wrkstn3Participant',
            'hcamp.wrkstn5Participant',
            'hcamp.wrkstn4Participant',
            'hcamp.wrkstn2Participant',
            'hcamp.wrkstn1Participant',
            'hcamp.wrkstn6Participant'
        ];

        SchemaLoader
            .loadAllSchemas(states, 'assets/jsonSchema/')
            .then(function () {
                _.each(SchemaLoader.allSchemas, function (schema, index) {
                    SchemaFactory.put(states[index], schema)
                })

            })

    })


