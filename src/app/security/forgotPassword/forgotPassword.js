angular.module('forgotPassword', ['ui.router', 'auth'])
    .config(function ($stateProvider, routingConfig) {

        var access = routingConfig.accessLevels()
        $stateProvider.state('forgotPassword', {
            url: '/forgotPassword',
            templateUrl: 'security/forgotPassword/forgotPassword.tpl.html',
            controller: 'ForgotPasswordCtrl',
            controllerAs: 'forgotPassword',
            access: access.anon
        })
    })
    .controller('ForgotPasswordCtrl', function (toaster) {

        this.sendEmail = function (email) {
            toaster.pop('success', "", "Password sent to your email")
        }

    })