angular.module('progressService', ['toaster'])
    .service('ProgressService', function ProgressService($log, $http, toaster) {

        ProgressService.downloadStatus = 0
        ProgressService.uploadStatus = 0
        ProgressService.fileuploadStatus = 0

        this.startSync = function () {

            return $http.get('api/sync/dataSync')
                .success(function () {
                    toaster.pop('success', '', 'Sync Completed');

                })
                .error(function () {
                    toaster.pop('error', '', 'Failed to Sync.Try Again');
                });
        }


        this.getDownloadStatus = function () {

            return getData('api/sync/status/download')
                .success(function (data) {
                    ProgressService.downloadStatus = data
                })
                .error(fail)

        }

        this.getUploadStatus = function () {

            return getData('api/sync/status/upload')
                .success(function (data) {
                    ProgressService.uploadStatus = data
                })
                .error(fail)

        }
        this.getFileUploadStatus = function () {

            return getData('api/sync/status/fileupload')
                .success(function (data) {
                    ProgressService.fileuploadStatus = data
                })
                .error(fail)
        }

        function getData(url) {
            return $http.get(url)
        }

        function fail() {
            $log.error('Failed to get Progress Status')
        }


    })
