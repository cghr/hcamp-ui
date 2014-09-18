/*
 * cgGrid
 * 

 * Version: 0.1.0 - 2014-08-11
 * License: MIT
 */
angular.module('cgGrid', [
    'cgGrid.tpls',
    'cgGrid.lodash',
    'cgGrid.config',
    'cgGrid.gridFactory',
    'cgGrid.autoUpdateRunner',
    'cgGrid.jsonUtil',
    'cgGrid.gridUtil',
    'cgGrid.dhtmlxGrid'
]);
angular.module('cgGrid.tpls', []);
angular.module('cgGrid.lodash', []).constant('_', window._);
angular.module('cgGrid.config', ['cgGrid.lodash']).factory('GridConfig', function () {
    return {
        width: '600px',
        height: '300px',
        autoUpdate: false,
        autoUpdateInterval: 5000,
        imagePath: 'assets/dhtmlx/imgs/',
        skin: 'modern',
        pagingSkin: 'bricks',
        paging: true,
        recordsPerPage: 500,
        getGridServiceBaseUrl: 'api/GridService'
    };
});
angular.module('cgGrid.gridFactory', ['cgGrid.config']).factory('GridFactory', [
    'GridConfig',
    '$http',
    '$location',
    '$log',
    function GridFactory(GridConfig, $http, $location, $log) {
        GridFactory.data = {};
        GridFactory.getData = function () {
            var dataUrl = GridConfig.getGridServiceBaseUrl + $location.url();
            function success(data) {
                GridFactory.data = data;
            }
            function err() {
                $log.error('Failed to fetch data for ' + dataUrl);
            }
            return $http.get(dataUrl).success(success).error(err);
        };
        return GridFactory;
    }
]);
angular.module('cgGrid.autoUpdateRunner', ['cgGrid.gridFactory']).factory('AutoUpdateRunner', [
    '$log',
    '$interval',
    'GridFactory',
    function ($log, $interval, GridFactory) {
        function startAutoUpdate(scope, config) {
            $log.info('started auto update');
            var self = this;
            var updateInterval = config.autoUpdateInterval;
            scope.intervalPromise = $interval(function () {
                self.checkForUpdates(scope);
            }, updateInterval);
        }
        function checkForUpdates(scope) {
            $log.info('checking for updates');
            GridFactory.getData().then(success);
            function success() {
                scope.gridRows = GridFactory.data.data.rows.length;
            }
        }
        function killAutoUpdate(scope) {
            $log.info('killed auto update');
            if (!$interval.cancel(scope.intervalPromise))
                $log.error('Failed to cancel interval');
        }
        return {
            startAutoUpdate: startAutoUpdate,
            checkForUpdates: checkForUpdates,
            killAutoUpdate: killAutoUpdate
        };
    }
]);
angular.module('cgGrid.jsonUtil', ['cgGrid.lodash']).factory('JsonUtil', [
    '_',
    function (_) {
        function transformJsonArray(jsonArray) {
            return _.map(jsonArray, function (obj, index) {
                return {
                    id: index++,
                    data: _.values(obj)
                };
            });
        }
        return { jsonToArray: transformJsonArray };
    }
]);
angular.module('cgGrid.gridUtil', [
        'cgGrid.gridFactory',
        'cgGrid.jsonUtil'
    ]).factory('GridUtil', [
        'GridFactory',
        '$compile',
        'JsonUtil',
        function (GridFactory, $compile, JsonUtil) {
            function renderGrid(config, scope) {
                config.gridElement.style.height = config.height;
                config.gridElement.style.width = config.width;
                config.pagingElement.style.width = config.width;
                var grid = new dhtmlXGridObject(config.gridElement);
                grid.setImagePath(config.imagePath);
                grid.enablePaging(config.paging, config.recordsPerPage, 5, config.pagingElement, true);
                grid.setPagingSkin(config.pagingSkin);
                grid.setSkin(config.skin);
                grid.setHeader(config.headings);
                grid.attachHeader(config.filters);
                grid.setColSorting(config.sortings || '');
                grid.init();
                grid.parse(config.data, 'json');
                $compile(angular.element(config.gridElement).contents())(scope);
            }
            function remoteInitialize(config, scope) {
                var self = this;
                var success = function () {
                    _.extend(config, GridFactory.data);
                    self.renderGrid(config, scope);
                };
                GridFactory.getData().then(success);
            }
            function resolveLocalInitialize(config, scope) {
                _.extend(config, scope.options);
                _.isUndefined(scope.options.data) ? this.remoteInitialize(config, scope) : this.resolveDataFormatAndRenderGrid(config, scope);
            }
            function resolveDataFormatAndRenderGrid(config, scope) {
                if (_.isArray(config.data))
                    config.data = { rows: JsonUtil.jsonToArray(config.data) };
                this.renderGrid(config, scope);
            }
            return {
                renderGrid: renderGrid,
                remoteInitialize: remoteInitialize,
                resolveLocalInitialize: resolveLocalInitialize,
                resolveDataFormatAndRenderGrid: resolveDataFormatAndRenderGrid
            };
        }
    ]);
angular.module('cgGrid.dhtmlxGrid', [
        'cgGrid.config',
        'cgGrid.jsonUtil',
        'cgGrid.gridUtil',
        'cgGrid.lodash',
        'cgGrid.autoUpdateRunner'
    ]).directive('dhtmlxGrid', [
        'GridConfig',
        '$compile',
        'JsonUtil',
        '$interval',
        '$log',
        'GridUtil',
        'AutoUpdateRunner',
        '_',
        function (GridConfig, $compile, JsonUtil, $interval, $log, GridUtil, AutoUpdateRunner, _) {
            function postLink(scope, element) {
                var childNodes = element.children();
                var config = {
                    gridElement: childNodes[0],
                    pagingElement: childNodes[1]
                };
                _.extend(config, GridConfig);
                _.isUndefined(scope.options) ? GridUtil.remoteInitialize(config, scope) : GridUtil.resolveLocalInitialize(config, scope);
                if (config.autoUpdate)
                    AutoUpdateRunner.startAutoUpdate(scope, config);
                /*
                 Watch for Changes in Grid Rows
                 */
                scope.$watch('gridRows', function () {
                    if (config.autoUpdate && _.isUndefined(scope.options))
                        GridUtil.remoteInitialize(config, scope);
                });
                /*
                 Kill Auto Update when View is destroyed
                 */
                scope.$on('$destroy', function () {
                    if (config.autoUpdate)
                        AutoUpdateRunner.killAutoUpdate(scope);
                    $log.info('killed auto update');
                });
            }
            return {
                template: '<div></div><div></div>',
                scope: { options: '=' },
                restrict: 'E',
                link: postLink
            };
        }
    ]);