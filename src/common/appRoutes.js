//Todo add routing config json for modules
angular.module('appRoutes', [])
    .constant('hcampRoutes', {
        name: 'hcamp',
        url: '/hcamp',
        tpl: 'hcamp/hcamp.tpl.html',
        children: [
            {
                name: 'wrkstn1',
                url: '/wrkstn/1',
                tpl: 'tpls/dataGrid.tpl.html',
                title: 'WorkStation1'

            },
            {
                name: 'wrkstn1Participant',
                url: '/wrkstn/1/participant/:memberId',
                tpl: 'tpls/registration.tpl.html',
                title: 'WorkStation1'

            },
            {
                name: 'wrkstn2',
                url: '/wrkstn/2',
                tpl: 'tpls/dataGrid.tpl.html',
                title: 'WorkStation2'

            },
            {
                name: 'wrkstn2Participant',
                url: '/wrkstn/2/participant/:memberId',
                tpl: 'tpls/participantSurvey.tpl.html',
                title: 'WorkStation2'

            },
            {
                name: 'wrkstn3',
                url: '/wrkstn/3',
                tpl: 'tpls/dataGrid.tpl.html',
                title: 'WorkStation3'

            },
            {
                name: 'wrkstn3Participant',
                url: '/wrkstn/3/participant/:memberId',
                tpl: 'tpls/participantSurvey.tpl.html',
                title: 'WorkStation3'

            },
            {
                name: 'wrkstn4',
                url: '/wrkstn/4',
                tpl: 'tpls/dataGrid.tpl.html',
                title: 'WorkStation4'

            },
            {
                name: 'wrkstn4Participant',
                url: '/wrkstn/4/participant/:memberId',
                tpl: 'tpls/participantSurvey.tpl.html',
                title: 'WorkStation4'

            },
            {
                name: 'wrkstn5',
                url: '/wrkstn/5',
                tpl: 'tpls/dataGrid.tpl.html',
                title: 'WorkStation5'

            },
            {
                name: 'wrkstn5Participant',
                url: '/wrkstn/5/participant/:memberId',
                tpl: 'tpls/participantSurvey.tpl.html',
                title: 'WorkStation5'

            },
            {
                name: 'wrkstn6',
                url: '/wrkstn/6',
                tpl: 'tpls/dataGrid.tpl.html',
                title: 'WorkStation6'

            },
            {
                name: 'wrkstn6Participant',
                url: '/wrkstn/6/participant/:memberId',
                tpl: 'tpls/participantSurvey.tpl.html',
                title: 'WorkStation6'

            },
            {
                name: 'wrkstn7',
                url: '/wrkstn/7',
                tpl: 'tpls/dataGrid.tpl.html',
                title: 'WorkStation7'

            },
            {
                name: 'wrkstn7Participant',
                url: '/wrkstn/7/participant/:memberId',
                tpl: 'tpls/reportCard.tpl.html',
                title: 'WorkStation7',
                ctrl: 'reportCardCtrl'

            }
        ]

    });
