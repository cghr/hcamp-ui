angular.module('sync', [ 'ui.bootstrap', 'toaster', 'progressService'])
    .config(function ($stateProvider) {

        $stateProvider
            .state('sync', {
                url: '/sync',
                templateUrl: 'sync/sync.html'
            });
    })
    .controller('syncCtrl', function ($scope, ProgressService, $interval, toaster, $timeout) {

        $scope.hasTotal = {
            downloads: false,
            uploads: false,
            fileUploads: false
        }
        $scope.total = {
            downloads: undefined,
            uploads: undefined,
            fileUploads: undefined
        }

        $scope.pending = {
            downloads: undefined,
            uploads: undefined,
            fileUploads: undefined
        }


        ProgressService.startSync()
            .then(function () {
                $timeout.cancel($scope.progressUpdater)
                toaster.pop('success', '', 'Sync Completed')

            }, function () {
                $timeout.cancel($scope.progressUpdater)
                toaster.pop('error', '', 'Failed to Synchronize')

            });

        $scope.progressUpdater = $interval(function () {
            updateProgress()
        }, 1500)

        function updateProgress() {

            updateDownloadStatus()
            updateUploadStatus()
            updateFileUploadStatus()

        }

        function updateDownloadStatus() {

            ProgressService.getDownloadStatus()
                .then(function () {

                    if (!$scope.hasTotal.downloads)
                        updateTotalDownloads()
                    else
                        $scope.pending.downloads = ($scope.total.downloads) - (ProgressService.downloadStatus)

                })
        }

        function updateTotalDownloads() {
            $scope.total.downlodas = ProgressService.downloadStatus
            $scope.hasTotal.downloads = true
        }


        function updateUploadStatus() {

            ProgressService.getUploadStatus()
                .then(function () {
                    if (!$scope.total.uploads)
                        updateTotalUploads()
                    else
                        $scope.pending.uplodas = ($scope.total.uploads) - (ProgressService.uploadStatus)
                })
        }

        function updateTotalUploads() {
            $scope.total.uploads = ProgressService.uploadStatus
            $scope.hasTotal.uploads = true
        }

        function updateFileUploadStatus() {

            ProgressService.getFileUploadStatus()
                .then(function () {
                    if (!$scope.total.fileUploads)
                        updateTotalFileUploads()
                    else
                        $scope.pending.FileUploads = ($scope.total.fileUploads) - (ProgressService.fileuploadStatus)
                })

        }


        function updateTotalFileUploads() {
            $scope.totalFileUploads = ProgressService.fileuploadStatus
            $scope.total.fileUploads = true
        }


    });
