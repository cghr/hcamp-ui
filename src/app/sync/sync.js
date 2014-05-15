angular.module('sync', ['appDefaultConfig', 'ui.bootstrap', 'toaster'])
    .config(function ($stateProvider) {

        $stateProvider.state('sync', {
            url: '/sync',
            templateUrl: 'sync/sync.tpl.html'
        });
    })
    .controller('syncCtrl', function ($scope, progressService, $interval, toaster, $timeout) {

        progressService.startSync().then(function (resp) {

            $timeout(function () {
                $interval.cancel($scope.ajaxPooling);
                toaster.pop('success', '', 'Sync Completed');
            }, 2000);

        });

        progressService.downloadStatus().then(function (resp) {

            $scope.totalDownloads = resp.data;
        });
        progressService.uploadStatus().then(function (resp) {

            $scope.totalUploads = parseInt(resp.data);
            $scope.downloadPooling = $interval(function () {
                progressService.uploadStatus().then(function (resp) {
                    $scope.uploadProgress = ($scope.totalUploads - parseInt(resp.data)) / $scope.totalUploads * 100;
                    if ($scope.downloadPooling == 100) {
                        $interval.cancel($scope.downloadPooling);
                    }

                });

            }, 1000);
        });
        progressService.fileuploadStatus().then(function (resp) {

            $scope.totalFileUploads = parseInt(resp.data);
            $scope.fileUploadPooling = $interval(function () {
                progressService.fileuploadStatus().then(function (resp) {
                    $scope.fileUploadProgress = ($scope.totalFileUploads - parseInt(resp.data)) / $scope.totalFileUploads * 100;
                    if ($scope.fileUploadProgress == 100) {
                        $interval.cancel($scope.fileUploadPooling);

                    }

                });
            }, 1000);

        });

        $scope.gotTotalDownloads = false;
        $scope.ajaxPooling = $interval(function () {

            progressService.downloadStatus().then(function (resp) {
                var downloadCount = parseInt(resp.data);
                if (downloadCount > 0 && !$scope.gotTotalDownloads) {
                    $scope.totalDownloads = downloadCount;
                    $scope.gotTotalDownloads = true;

                }
                $scope.downloadProgress = ($scope.totalDownloads - parseInt(resp.data)) / $scope.totalDownloads * 100;
            });


        }, 1000);

    })
    .service('progressService', function ($http, AppDefaultConfig) {

        var config = {
            sync: 'api/sync/dataSync',
            downloadPath: 'api/sync/status/download',
            uploadPath: 'api/sync/status/upload',
            fileuploadPath: 'api/sync/status/fileupload'
        };
        var serverUrl = AppDefaultConfig.serviceBaseUrl;
        return {
            startSync: function () {
                return $http.get(serverUrl + config.sync);
            },
            downloadStatus: function downloadStatus() {

                return $http.get(serverUrl + config.downloadPath);
            },
            uploadStatus: function uploadStatus() {
                return $http.get(serverUrl + config.uploadPath);
            },
            fileuploadStatus: function fileuploadStatus() {
                return $http.get(serverUrl + config.fileuploadPath);
            }
        };

    });
