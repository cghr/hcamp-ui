angular.module('report', ['ui.router', 'sideMenu'])
    .config(function ($stateProvider) {

        $stateProvider.state('report', {

            url: '/report/:reportId',
            templateUrl: 'report/report.html',
            controller: 'ReportCtrl',
            controllerAs: 'vm'

        })
    })
    .controller('ReportCtrl', function ($window) {

        var vm = this
        vm.reportOptions = {
            skin: 'dhx_skyblue',
            width: $window.innerWidth * 0.8 + 'px',
            height: $window.innerHeight * 0.8 + 'px'
        }

        vm.reportMenu = [
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
        ]
    })