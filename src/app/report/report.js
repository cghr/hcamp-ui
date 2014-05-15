angular.module('myApp.report', ['ui.router'])
    .config(function ($stateProvider) {

        $stateProvider.state('report', {
            url: '/report/:reportId',
            templateUrl: 'report/report.tpl.html',
            controller: 'ReportCtrl'
        });
    })
    .controller('ReportCtrl', function ($scope) {

        var gridWidth = window.innerWidth * 0.8 + 'px',
            gridHeight = window.innerHeight * 0.8 + 'px';
        $scope.reportOptions = {
            skin: 'dhx_skyblue',
            width: gridWidth,
            height: gridHeight
        };
        $scope.reportMenu = [
            {
                id: 1,
                label: 'Reports',
                items: [
                    {
                        id: 11,
                        label: 'WrkStn1'
                    },
                    {
                        id: 12,
                        label: 'WrkStn2'
                    },
                    {
                        id: 13,
                        label: 'WrkStn3'
                    },
                    {
                        id: 14,
                        label: 'WrkStn4'
                    },
                    {
                        id: 15,
                        label: 'WrkStn5'
                    }
                ]
            }
        ];


    });