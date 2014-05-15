/*
 * cgForm
 * 

 * Version: 0.1.0 - 2014-05-14
 * License: MIT
 */
angular.module('cgForm', [
    'cgForm.tpls',
    'cgForm.templateFactory',
    'cgForm.initFocus',
    'cgForm.jQuery',
    'cgForm.scrollTop',
    'cgForm.ngEnter',
    'cgForm.myFocus',
    'cgForm.formElement',
    'cgForm.formConfig',
    'cgForm.lodash',
    'cgForm.formService',
    'cgForm.schemaFactory',
    'cgForm.joelpurra',
    'cgForm.ffqForm',
    'cgForm.plusAsTab',
    'cgForm.standardForm',
    'cgForm.surveyForm'
]);
angular.module('cgForm.tpls', [
    'template/formElement/checkbox.html',
    'template/formElement/control-group-heading.html',
    'template/formElement/control-group.html',
    'template/formElement/dropdown.html',
    'template/formElement/duration.html',
    'template/formElement/gps.html',
    'template/formElement/hidden.html',
    'template/formElement/lookup.html',
    'template/formElement/password.html',
    'template/formElement/radio-inline.html',
    'template/formElement/radio.html',
    'template/formElement/readonly.html',
    'template/formElement/suggest.html',
    'template/formElement/text.html',
    'template/formElement/textarea.html',
    'template/ffqForm/ffqForm.html',
    'template/standardForm/standardForm.html',
    'template/surveyForm/surveyForm.html'
]);
angular.module('cgForm.templateFactory', []).factory('TemplateFactory', [
    '$http',
    '$templateCache',
    function ($http, $templateCache) {
        return {
            get: function (template) {
                return $http.get('template/formElement/' + template + '.html', { cache: $templateCache });
            }
        };
    }
]);
angular.module('cgForm.initFocus', []).directive('initFocus', [
    '$timeout',
    function ($timeout) {
        return {
            link: function (scope, elm, attrs) {
                if (attrs.initFocus == 'false') {
                    return false;
                }
                $timeout(function () {
                    elm.focus();
                }, 0);
            }
        };
    }
]);
angular.module('cgForm.jQuery', []).factory('jQuery', [
    '$window',
    function ($window) {
        if (!$window.jQuery) {
            throw new Error('Lodash library not available');
        }
        return $window.jQuery;
    }
]);
angular.module('cgForm.scrollTop', ['cgForm.jQuery']).directive('scrollTop', [
    '$timeout',
    'jQuery',
    function ($timeout, jQuery) {
        return {
            link: function (scope, elm, attrs) {
                if (attrs.scrollTop == 'false') {
                    return false;
                }
                /* Scroll to the newly added element */
                $timeout(function () {
                    jQuery('body, html').animate({ scrollTop: jQuery(elm).offset().top }, 100);
                }, 0);
            }
        };
    }
]);
angular.module('cgForm.ngEnter', []).directive('ngEnter', function () {
    return {
        link: function postLink(scope, elem, attrs) {
            elem.bind('keypress', function (e) {
                if (e.charCode === 13 && !e.shiftKey) {
                    scope.$apply(attrs.ngEnter);
                }
            });
        }
    };
});
angular.module('cgForm.myFocus', []).directive('myFocus', function () {
    return {
        link: function postLink(scope, elem, attrs) {
            elem.bind('focus', function (e) {
                scope.$apply(attrs.myFocus);
            });
        }
    };
});
angular.module('cgForm.formElement', [
        'cgForm.templateFactory',
        'cgForm.initFocus',
        'cgForm.scrollTop',
        'cgForm.ngEnter',
        'cgForm.myFocus'
    ]).directive('formElement', [
        '$http',
        '$compile',
        '$templateCache',
        'TemplateFactory',
        function ($http, $compile, $templateCache, TemplateFactory) {
            return {
                replace: true,
                restrict: 'E',
                template: '<div></div>',
                scope: true,
                link: function postLink(scope, element, attrs) {
                    /* Evaluate data supplied in attrs */
                    scope.config = scope.$eval(attrs.config);
                    attrs.$observe('config', function () {
                        scope.config = scope.$eval(attrs.config);
                    });
                    /* Create a templateUrl from config.type */
                    var isHeading = scope.config.type === 'heading';
                    var controlGroup = isHeading ? 'control-group-heading' : 'control-group';
                    /* Get the control group template first and insert the input widget template */
                    TemplateFactory.get(controlGroup).then(function (response) {
                        element.html(response.data);
                        $compile(element)(scope);
                        if (isHeading) {
                            return;
                        }
                        TemplateFactory.get(scope.config.type).then(function (response) {
                            element.find('div.controls').html(response.data);
                            $compile(element)(scope);
                        });
                    });
                }
            };
        }
    ]);
angular.module('cgForm.formConfig', []).factory('FormConfig', [
    '$rootScope',
    function ($rootScope) {
        return {
            getConfig: function () {
                if (angular.isUndefined($rootScope.serviceBaseUrl)) {
                    throw new Error('serviceBaseUrl  not found in $rootScope');
                }
                var context = $rootScope.serviceBaseUrl;
                //Update Date Prototypes to have today and timeNow
                return {
                    submitUrl: context + 'api/data/dataStoreService/',
                    resourceBaseUrl: context + 'api/data/dataAccessService/',
                    lookupBaseUrl: context + 'api/LookupService/',
                    crossFlowBaseUrl: context + 'api/CrossFlowService',
                    crossCheckBaseUrl: context + 'api/CrossCheckService',
                    submitLabel: 'Save',
                    style: 'well'
                };
            }
        };
    }
]);
angular.module('cgForm.lodash', []).factory('_', [
    '$window',
    function ($window) {
        if (!$window._) {
            throw new Error('Lodash library not available');
        }
        return $window._;
    }
]);
angular.module('cgForm.formService', [
        'cgForm.formConfig',
        'cgForm.lodash',
        'ui.router'
    ]).factory('FormService', [
        'FormConfig',
        '$http',
        '$location',
        '_',
        '$stateParams',
        function (FormConfig, $http, $location, _, $stateParams) {
            return {
                getResource: function (entity) {
                    var params = $location.url().split('/');
                    var entityId = _.last(params);
                    var dataUrl = FormConfig.getConfig().resourceBaseUrl + entity + '/' + entityId;
                    return $http.get(dataUrl);
                },
                postResource: function (data) {
                    return $http.post(FormConfig.getConfig().submitUrl, data);
                },
                getLookupData: function (reqData) {
                    reqData.refId = $stateParams[reqData.ref];
                    return $http.post(FormConfig.getConfig().lookupBaseUrl, reqData);
                },
                getCrossCheckData: function (reqData) {
                    reqData.refId = $stateParams[reqData.ref];
                    return $http.post(FormConfig.getConfig().crossCheckBaseUrl, reqData);
                },
                checkCrossFlow: function (crossFlows) {
                    angular.forEach(crossFlows, function (crossFlow) {
                        crossFlow.refId = $stateParams[crossFlow.ref];
                    });
                    return $http.post(FormConfig.getConfig().crossFlowBaseUrl, crossFlows);
                }
            };
        }
    ]);
angular.module('cgForm.schemaFactory', []).factory('SchemaFactory', function () {
    return {
        get: function (schemaName) {
            if (!this[schemaName]) {
                throw new Error('Schema Not found for ' + schemaName);
            }
            return this[schemaName];
        },
        put: function (schemaName, schemaObject) {
            this[schemaName] = schemaObject;
        }
    };
});
angular.module('cgForm.joelpurra', []).factory('JoelPurra', [
    '$window',
    function ($window) {
        if (!$window.JoelPurra) {
            throw new Error('plusAsTab library not available');
        }
        $window.JoelPurra.PlusAsTab.setOptions({ key: 13 });
        return $window.JoelPurra;
    }
]);
angular.module('cgForm.ffqForm', [
        'cgForm.formElement',
        'cgForm.formConfig',
        'cgForm.formService',
        'cgForm.lodash',
        'cgForm.schemaFactory',
        'ui.router',
        'cgForm.joelpurra'
    ]).directive('ffqForm', [
        'FormConfig',
        '_',
        'SchemaFactory',
        '$state',
        'FormService',
        '$rootScope',
        'JoelPurra',
        function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, JoelPurra) {
            return {
                templateUrl: 'template/ffqForm/ffqForm.html',
                restrict: 'E',
                replace: true,
                scope: { options: ' = ' },
                link: function postLink(scope, element) {
                    Date.prototype.today = function () {
                        return this.getFullYear() + '-' + (this.getMonth() + 1 < 10 ? '0' : '') + (this.getMonth() + 1) + '-' + (this.getDate() < 10 ? '0' : '') + this.getDate();
                    };
                    Date.prototype.timeNow = function () {
                        return (this.getHours() < 10 ? '0' : '') + this.getHours() + ':' + (this.getMinutes() < 10 ? '0' : '') + this.getMinutes() + ':' + (this.getSeconds() < 10 ? '0' : '') + this.getSeconds();
                    };
                    var newDate = new Date();
                    $rootScope.timestamp = newDate.today() + '' + newDate.timeNow();
                    /* Load Json Schema for current state if not supplied through attributes */
                    scope.schema = angular.copy(scope.options) || angular.copy(SchemaFactory.get($state.current.name));
                    /* Initialize form data */
                    scope.data = {};
                    /* Extend the current schema with default config */
                    scope.schema = _.extend(scope.schema, FormConfig.getConfig());
                    /* Evaluate information in hidden fields */
                    angular.forEach(scope.schema.properties, function (elem) {
                        if (elem.name !== 'datastore' && elem.type === 'hidden') {
                            elem.value = $rootScope.$eval(elem.value);
                        }
                        if (elem.type === 'hidden') {
                            scope.data[elem.name] = elem.value;
                        }
                    });
                    /* Initialize checkbox element's data with empty objects in scope.data */
                    var multipleSelectElements = _.filter(scope.schema.properties, { type: 'checkbox' });
                    _.each(multipleSelectElements, function (item) {
                        scope.data[item.name] = {};
                    });
                    /* Store datastore value in scope to use in controller */
                    scope.data.datastore = _.find(scope.schema.properties, { name: 'datastore' }).value;
                    /* Create a separate collection for hidden elements  */
                    scope.schema.hiddenElements = _.filter(scope.schema.properties, { type: 'hidden' });
                    /* Remove hidden items from schema */
                    _.remove(scope.schema.properties, { type: 'hidden' });
                    /* Bind Enter as Tab and Validation to form */
                    element.plusAsTab();
                    element.bValidator();
                },
                controller: [
                    '$scope',
                    '$element',
                    '$state',
                    '$stateParams',
                    function ($scope, $element, $state, $stateParams) {
                        $scope.onSubmit = function (data) {
                            /* Validate form before submit */
                            if (!$element.data('bValidator').validate()) {
                                return;
                            }
                            postData(data);
                        };
                        /* Posts form data to Sever */
                        function postData(data) {
                            var done = function () {
                                $state.go($scope.schema.onSave, $stateParams);
                            };
                            var fail = function () {
                                throw new Error('Failed to post data');
                            };
                            FormService.postResource(data).then(done, fail);
                        }
                    }
                ]
            };
        }
    ]);
angular.module('cgForm.plusAsTab', []).factory('JoelPurra', [
    '$window',
    function ($window) {
        if (!$window.JoelPurra) {
            throw new Error('Plus As Tab library not available');
        }
        $window.JoelPurra.PlusAsTab.setOptions({ key: 13 });
        return $window.JoelPurra;
    }
]);
angular.module('cgForm.standardForm', [
        'cgForm.formElement',
        'cgForm.formConfig',
        'cgForm.formService',
        'cgForm.lodash',
        'ui.router',
        'cgForm.schemaFactory',
        'cgForm.joelpurra'
    ]).directive('standardForm', [
        'FormConfig',
        '_',
        'SchemaFactory',
        '$state',
        'FormService',
        '$rootScope',
        'JoelPurra',
        function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, JoelPurra) {
            return {
                templateUrl: 'template/standardForm/standardForm.html',
                restrict: 'E',
                replace: true,
                scope: {
                    options: '=',
                    randomtotal: '@',
                    randomsize: '@',
                    formData: '='
                },
                link: function postLink(scope, element, attrs) {
                    Date.prototype.today = function () {
                        return this.getFullYear() + '-' + (this.getMonth() + 1 < 10 ? '0' : '') + (this.getMonth() + 1) + '-' + (this.getDate() < 10 ? '0' : '') + this.getDate();
                    };
                    Date.prototype.timeNow = function () {
                        return (this.getHours() < 10 ? '0' : '') + this.getHours() + ':' + (this.getMinutes() < 10 ? '0' : '') + this.getMinutes() + ':' + (this.getSeconds() < 10 ? '0' : '') + this.getSeconds();
                    };
                    var newDate = new Date();
                    $rootScope.timestamp = newDate.today() + '' + newDate.timeNow();
                    /* Load Json Schema for current state if not supplied through attributes */
                    scope.schema = angular.copy(scope.options) || angular.copy(SchemaFactory.get($state.current.name));
                    /* Generates a random form */
                    var randoms = [];
                    var randomProperties = [];
                    scope.randomsize = angular.isDefined(scope.randomsize) ? scope.randomsize : 0;
                    for (var i = 0; i < scope.randomsize; i++) {
                        randoms.push(getRandomNumber());
                    }
                    if (scope.randomsize > 0 && scope.randomtotal > 0) {
                        /* Push all hidden properties */
                        angular.forEach(scope.schema.properties, function (property, index) {
                            if (property.type === 'hidden') {
                                randomProperties.push(property);  //scope.schema.properties.splice(index,1);
                            }
                        });
                        _.remove(scope.schema.properties, { type: 'hidden' });
                        angular.forEach(randoms, function (randomItem) {
                            randomProperties.push(scope.schema.properties[randomItem]);
                        });
                        scope.schema.properties = randomProperties;
                    }
                    function mathRandom() {
                        return Math.floor(Math.random() * scope.randomtotal + 1);
                    }

                    function getRandomNumber() {
                        var randomNumber;
                        while (1) {
                            randomNumber = mathRandom();
                            if (!_.contains(randoms, randomNumber)) {
                                break;
                            }
                        }
                        return randomNumber;
                    }

                    console.log('random properties');
                    console.log(scope.schema.properties);
                    /* Initialize data in  scope to save all form data*/
                    scope.data = scope.formData || {};
                    /* Extend the current schema with default config */
                    scope.schema = _.extend(scope.schema, FormConfig.getConfig());
                    /* Load lookup data if any and add initFocus attr to every elem to disable initFocus attribute */
                    angular.forEach(scope.schema.properties, function (elem) {
                        elem.initFocus = false;
                        elem.scrollTop = false;
                        if (elem.type === 'lookup') {
                            FormService.getLookupData(elem.lookup).then(function (resp) {
                                elem.type = 'radio';
                                elem.items = resp.data;
                            });
                        }
                    });
                    /* Evaluate information in hidden fields */
                    angular.forEach(scope.schema.properties, function (elem) {
                        if (elem.name !== 'datastore' && elem.type === 'hidden') {
                            elem.value = $rootScope.$eval(elem.value);
                        }
                        if (elem.type === 'hidden') {
                            scope.data[elem.name] = elem.value;
                        }
                    });
                    /* Initialize checkbox element's data with empty objects in scope.data */
                    var multipleSelectElements = _.filter(scope.schema.properties, { type: 'checkbox' });
                    _.each(multipleSelectElements, function (item) {
                        scope.data[item.name] = {};
                    });
                    /* Store datastore value in scope.data  */
                    scope.data.datastore = _.find(scope.schema.properties, { name: 'datastore' }).value;
                    /* Bind Enter as Tab and Validation to form */
                    element.plusAsTab();
                    element.bValidator();
                },
                controller: [
                    '$scope',
                    '$element',
                    '$state',
                    '$stateParams',
                    function ($scope, $element, $state, $stateParams) {
                        $scope.onSubmit = function (data) {
                            /* Validate form before submit */
                            if (!$element.data('bValidator').validate()) {
                                return;
                            }
                            postData(data);
                        };
                        /* Posts  data to Sever */
                        function postData(data) {
                            var done = function () {
                                $state.go($scope.schema.onSave, $stateParams);
                            };
                            var fail = function () {
                                throw new Error('Failed to post data');
                            };
                            FormService.postResource(data).then(done, fail);
                        }

                        /* Get GPS */
                        $scope.getGps = function () {
                            $scope.data.gps_latitude = '12.7435';
                            $scope.data.gps_longitude = '17.9872';
                        };
                    }
                ]
            };
        }
    ]);
angular.module('cgForm.surveyForm', [
        'cgForm.formElement',
        'cgForm.formConfig',
        'cgForm.schemaFactory',
        'cgForm.formService',
        'cgForm.lodash',
        'ui.router'
    ]).controller('surveyFormCtrl', [
        '$scope',
        '$element',
        'FormService',
        '$state',
        '$stateParams',
        function ($scope, $element, FormService, $state, $stateParams) {
            /* Posts  data to Sever */
            function postData() {
                var done = function () {
                    if ($scope.schema.onSave !== '') {
                        $state.go($scope.schema.onSave, $stateParams);
                    } else {
                        $scope.fnct({ data: $scope.data });
                    }  //$rootScope.$eval($scope.schema.onSave);
                };
                var fail = function () {
                    throw new Error('Failed to post data');
                };
                FormService.postResource($scope.data).then(done, fail);
            }

            /* Validate form before submit */
            function isValidForm() {
                return $element.data('bValidator').validate();
            }

            /* Handles enter Event on Form to render next Question */
            $scope.showNext = function () {
                if (!isValidForm()) {
                    return;
                }
                if ($scope.flowIndex < $scope.schema.properties.length - 1) {
                    handleFlow();
                    var nextCondition = $scope.schema.properties[$scope.flowIndex]['valdn'];
                    var matches = nextCondition.match(/{.*}/);
                    if (matches) {
                        var evalValue = $scope.$eval(matches[0].replace('{', '').replace('}', ''));
                        $scope.flow.properties[$scope.flowIndex].valdn = nextCondition.replace(/{.*}/, evalValue);
                    }
                } else {
                    postData();
                }
            };
            /* Handles the flow condition logic  */
            function handleFlow() {
                $scope.flowSeq++;
                var nextItemInFlow = $scope.schema.properties[$scope.flowSeq];
                if (!nextItemInFlow) {
                    postData();
                    return;
                }
                if (nextItemInFlow.flow.length === 0 || $scope.$eval(nextItemInFlow.flow) === true) {
                    $scope.flowIndex = $scope.flowSeq;
                    $scope.flow.properties.push(angular.copy($scope.schema.properties[$scope.flowIndex]));
                } else {
                    handleFlow();
                }
            }

            /* Handles focus event on control group and modifies flow accordingly */
            $scope.jumpFlow = function (itemName) {
                var flowIndex = _.findIndex($scope.flow.properties, { name: itemName });
                var seqIndex = _.findIndex($scope.schema.properties, { name: itemName });
                $scope.flow.properties = _.initial($scope.flow.properties, $scope.flow.properties.length - 1 - flowIndex);
                $scope.flowIndex = seqIndex;
                $scope.flowSeq = $scope.flowIndex;
                /* Remove all non-flow properties added to $scope.data (form data) as a result of flow navigation back */
                _.each($scope.data, function (value, key) {
                    key = key.split('_')[0];
                    var isPresent = _.findIndex($scope.flow.properties, { name: key });
                    if (isPresent === -1) {
                        delete $scope.data[key];
                    }
                });
            };
            /* Get GPS */
            $scope.getGps = function () {
                $scope.data.gps_latitude = '12.7435';
                $scope.data.gps_longitude = '17.9872';
            };
        }
    ]).directive('surveyForm', [
        'FormConfig',
        '_',
        'SchemaFactory',
        '$state',
        'FormService',
        '$rootScope',
        '$timeout',
        '$q',
        function (FormConfig, _, SchemaFactory, $state, FormService, $rootScope, $timeout, $q) {
            return {
                templateUrl: 'template/surveyForm/surveyForm.html',
                restrict: 'E',
                replace: true,
                scope: {
                    options: ' = ',
                    fnct: '&onSave'
                },
                link: function postLink(scope, element) {
                    Date.prototype.today = function () {
                        return this.getFullYear() + '-' + (this.getMonth() + 1 < 10 ? '0' : '') + (this.getMonth() + 1) + '-' + (this.getDate() < 10 ? '0' : '') + this.getDate();
                    };
                    Date.prototype.timeNow = function () {
                        return (this.getHours() < 10 ? '0' : '') + this.getHours() + ':' + (this.getMinutes() < 10 ? '0' : '') + this.getMinutes() + ':' + (this.getSeconds() < 10 ? '0' : '') + this.getSeconds();
                    };
                    var newDate = new Date();
                    $rootScope.timestamp = newDate.today() + '' + newDate.timeNow();
                    /* Load Json Schema for current state if not supplied through attributes */
                    scope.schema = angular.copy(scope.options) || angular.copy(SchemaFactory.get($state.current.name));
                    /* Initialize form data */
                    scope.data = {};
                    /* Merge schema with default config */
                    scope.schema = _.extend(scope.schema, FormConfig.getConfig());
                    /* Load lookup data and Cross Flow dynamic validation */
                    angular.forEach(scope.schema.properties, function (elem) {
                        if (elem.type === 'lookup') {
                            console.log('lookup ');
                            FormService.getLookupData(elem.lookup).then(function (resp) {
                                elem.type = 'radio';
                                elem.items = resp.data;
                                var index = _.findIndex(scope.flow.properties, { name: elem.name });
                                scope.flow.properties[index].type = 'radio';
                                scope.flow.properties[index].items = resp.data;
                            });
                        }
                        if (!_.isEmpty(elem.crossCheck)) {
                            FormService.getCrossCheckData(elem.crossCheck).then(function (resp) {
                                var condition = elem.crossCheck.condition.replace('{value}', resp.data.value);
                                elem.valdn = condition;
                                var index = _.findIndex(scope.flow.properties, { name: elem.name });
                                scope.flow.properties[index].valdn = condition;
                            });
                        }
                    });
                    var crossFlowPromises = [];
                    var indexes = [];
                    /* Check for CrossFlow conditions */
                    angular.forEach(scope.schema.properties, function (elem, i) {
                        if (elem.crossFlow) {
                            if (elem.crossFlow.length > 0) {
                                crossFlowPromises.push(FormService.checkCrossFlow(elem.crossFlow));
                                indexes.push(i);
                            }
                        }
                    });
                    var elemIndex = 0;
                    $q.all(crossFlowPromises).then(function (responses) {
                        angular.forEach(responses, function (resp) {
                            if (resp.data.check === false) {
                                scope.schema.properties[indexes[elemIndex]].crossFlowCheck = false;  //scope.schema.properties.splice(indexes[elemIndex],1);
                            }
                            elemIndex++;
                        });
                        scope.schema.properties = _.remove(scope.schema.properties, function (element) {
                            if (angular.isUndefined(element.crossFlowCheck)) {
                                return true;
                            }
                            return element.crossFlowCheck !== false;
                        });
                    });
                    /* Evaluate values in hidden fields */
                    angular.forEach(scope.schema.properties, function (elem) {
                        if (elem.name !== 'datastore' && elem.type === 'hidden') {
                            elem.value = $rootScope.$eval(elem.value);
                            console.log(elem);
                            console.log(elem.value);
                        }
                        if (elem.type === 'hidden') {
                            scope.data[elem.name] = elem.value;
                        }
                    });
                    /* Initialize checkbox element's data with empty objects in scope.data */
                    var multipleSelectElements = _.filter(scope.schema.properties, { type: 'checkbox' });
                    _.each(multipleSelectElements, function (item) {
                        scope.data[item.name] = {};
                    });
                    /* Store datastore value in scope to use in controller */
                    scope.datastore = _.find(scope.schema.properties, { name: 'datastore' }).value;
                    /* Bind Enter as Tab and Validation to form */
                    element.bValidator();
                    scope.flow = { properties: [] };
                    //Render All hidden elements
                    var hiddenCount = -1;
                    //count all hidden elements
                    scope.flowSeq = -1;
                    scope.flowIndex = -1;
                    for (var j = 0; j < scope.schema.properties.length; j++) {
                        var elem = scope.schema.properties[j];
                        if (elem.type === 'hidden' || elem.type === 'heading') {
                            scope.flow.properties.push(angular.copy(elem));
                            hiddenCount++;
                            scope.flowSeq++;
                            scope.flowIndex++;
                        } else {
                            break;
                        }
                    }
                    /* Render Initial Item in the flow after all hidden elements(without conditions) */
                    scope.flow.properties.push(angular.copy(scope.schema.properties[++hiddenCount]));
                    scope.flowSeq++;
                    scope.flowIndex++;
                },
                controller: 'surveyFormCtrl'
            };
        }
    ]);
angular.module('template/formElement/checkbox.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/checkbox.html', '<label class="checkbox" ng-repeat="item in config.items">\n' + '    <div ng-if="$index==0" >\n' + '        <input data-bvalidator="{{config.valdn}}" data-bvalidator-msg="Please Select an option" type="checkbox"\n' + '               name="{{config.name}}[]"\n' + '               value="{{item.value}}"\n' + '               ng-model="data[config.name][item.value]" init-focus="{{config.initFocus}}" />\n' + '        {{item.text}}\n' + '    </div>\n' + '    <div ng-if="$index!=0">\n' + '        <input type="checkbox"\n' + '               name="{{config.name}}[]"\n' + '               value="{{item.value}}"\n' + '               ng-model="data[config.name][item.value]" />\n' + '        {{item.text}}\n' + '\n' + '    </div>\n' + '\n' + '</label>');
    }
]);
angular.module('template/formElement/control-group-heading.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/control-group-heading.html', '<div class="control-group" id="{{config.name}}-control-group" scroll-top="{{config.scrollTop}}">\n' + '    <div class="control-label" >\n' + '        <div class="alert alert-error" style="font-weight:bold">{{config.label}}</div>\n' + '    </div>\n' + '    <div class="controls"></div>\n' + '</div>');
    }
]);
angular.module('template/formElement/control-group.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/control-group.html', '<div class="control-group" id="{{config.name}}-control-group" scroll-top="{{config.scrollTop}}">\n' + '    <div class="control-label">\n' + '        <label style="font-weight:bold">{{config.label}} </label>\n' + '        <div ng-if="config.image!=\'\'"><img ng-src="{{config.image}}" /></div>\n' + '    </div>\n' + '    <div class="controls" ng-click="jumpFlow(config.name)"></div>\n' + '\n' + '</div>');
    }
]);
angular.module('template/formElement/dropdown.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/dropdown.html', '<select  data-bvalidator="{{config.valdn}}"\n' + '        data-bvalidator-msg="Please select an option"\n' + '        ng-model="data[config.name]"\n' + '        init-focus>\n' + '    <option ng-repeat="item in config.items" value="{{item.value}}" init-focus="{{config.initFocus}}" >{{item.text}}</option>\n' + '\n' + '</select>');
    }
]);
angular.module('template/formElement/duration.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/duration.html', '<input type="text"  data-bvalidator="{{config.valdn}}"\n' + '       ng-model="data[config.name+\'_value\']" init-focus="{{config.initFocus}}" />\n' + '\n' + '<select   data-bvalidator="required" data-bvalidator-msg="Please select an option"\n' + '         ng-model="data[config.name+\'_unit\']"  >\n' + '    <option value=""></option>\n' + '    <option ng-repeat="item in config.items" value="{{item.value}}">{{item.text}}</option>\n' + '</select>');
    }
]);
angular.module('template/formElement/gps.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/gps.html', '<label>Latitude</label>\n' + '<input type="text" ng-model="data[config.name+\'_latitude\']"\n' + '       readonly="readonly"/>\n' + '<label>Longitude</label>\n' + '<input type="text"\n' + '       ng-model="data[config.name+\'_longitude\']"\n' + '       readonly="readonly"/>\n' + '<a class="btn btn-danger btn-small" href="" ng-click="getGps()">Get GPS</a>');
    }
]);
angular.module('template/formElement/hidden.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/hidden.html', '<input type="text"  value="{{config.value}}" ng-model="data[config.name]" style="display: none;" />');
    }
]);
angular.module('template/formElement/lookup.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/lookup.html', '<label class="radio" ng-repeat="item in config.items">\n' + '    <div ng-if="$index==0"><input  data-bvalidator="{{config.valdn}}" data-bvalidator-msg="Please select an option" type="radio" name="{{config.name}}"\n' + '                value="{{item.value}}" ng-model="data[config.name]" init-focus="{{config.initFocus}}"  /> {{item.text}}\n' + '    </div>\n' + '    <div ng-if="$index!=0"><input  type="radio" name="{{config.name}}" value="{{item.value}}"\n' + '                ng-model="data[config.name]"    /> {{item.text}}\n' + '    </div>\n' + '</label>');
    }
]);
angular.module('template/formElement/password.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/password.html', '<input type="password"   data-bvalidator="{{config.valdn}}"\n' + '       ng-model="data[config.name]" init-focus="{{config.initFocus}}"/>');
    }
]);
angular.module('template/formElement/radio-inline.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/radio-inline.html', '<label class="radio inline" ng-repeat="item in config.items">\n' + '    <div ng-if="$index==0"><input  data-bvalidator="{{config.valdn}}" data-bvalidator-msg="Please select an option" type="radio" name="{{config.name}}"\n' + '                                   value="{{item.value}}" ng-model="data[config.name]" init-focus="{{config.initFocus}}"/> {{item.text}}\n' + '    </div>\n' + '    <div ng-if="$index!=0"><input  type="radio" name="{{config.name}}" value="{{item.value}}"\n' + '                                   ng-model="data[config.name]"/> {{item.text}}\n' + '    </div>\n' + '</label>');
    }
]);
angular.module('template/formElement/radio.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/radio.html', '<label class="radio" ng-repeat="item in config.items">\n' + '    <div ng-if="$index==0"><input  data-bvalidator="{{config.valdn}}" data-bvalidator-msg="Please select an option" type="radio" name="{{config.name}}"\n' + '                value="{{item.value}}" ng-model="data[config.name]" init-focus="{{config.initFocus}}"/> {{item.text}}\n' + '    </div>\n' + '    <div ng-if="$index!=0"><input  type="radio" name="{{config.name}}" value="{{item.value}}"\n' + '                ng-model="data[config.name]"    /> {{item.text}}\n' + '    </div>\n' + '</label>');
    }
]);
angular.module('template/formElement/readonly.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/readonly.html', '<input type="text"  ng-model="data[config.name]" readonly="readonly"/>');
    }
]);
angular.module('template/formElement/suggest.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/suggest.html', '<input type="text"\n' + '       data-bvalidator="{{config.valdn}}"\n' + '       ng-model="data[config.name]"\n' + '       typeahead="item.text for item in config.items | filter:$viewValue"\n' + '       init-focus="{{config.initFocus}}" />');
    }
]);
angular.module('template/formElement/text.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/text.html', '<input type="text"  data-bvalidator="{{config.valdn}}"\n' + '       ng-model="data[config.name]" init-focus="{{config.initFocus}}" />');
    }
]);
angular.module('template/formElement/textarea.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/formElement/textarea.html', '<textarea  data-bvalidator="{{config.valdn}}" ng-model="data[config.name]" init-focus="{{config.initFocus}}" > </textarea>');
    }
]);
angular.module('template/ffqForm/ffqForm.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/ffqForm/ffqForm.html', '<form ng-submit="onSubmit(data)" action="javascript:void(0)" class="well">\n' + '\n' + '    <input ng-repeat="elm in schema.hiddenElements" type="hidden" id="{{elm.name}}" name="{{elm.name}}" value="{{elm.value}}" ng-model="data[elm.name]"/>\n' + '\n' + '    <table class="table table-bordered" style="margin-top:20px">\n' + '        <tr style="background-color:gray;color:#ffffff">\n' + '            <th>Foods and Amounts</th>\n' + '\n' + '            <th colspan="9" style="text-align:center">Average Use Last year</th>\n' + '\n' + '        </tr>\n' + '\n' + '        <tr style="background-color:gray;color:#ffffff">\n' + '            <th class="span2">Food/Drink Item</th>\n' + '\n' + '            <th class="span2">Never or less than once/month</th>\n' + '\n' + '            <th class="span2">1-3 per month</th>\n' + '\n' + '            <th class="span2">Once a week</th>\n' + '\n' + '            <th class="span2">2-4 per week</th>\n' + '\n' + '            <th class="span2">5-6 per week</th>\n' + '\n' + '            <th class="span2">Once a day</th>\n' + '\n' + '            <th class="span2">2-3 per day</th>\n' + '\n' + '            <th class="span2">Measure</th>\n' + '\n' + '            <th class="span2">Unit</th>\n' + '\n' + '        </tr>\n' + '\n' + '\n' + '        <tr ng-repeat="element in schema.properties">\n' + '            <td>{{element.label}}</td>\n' + '\n' + '            <td ng-repeat="item in element.items">\n' + '\n' + '                <label class="radio inline">\n' + '                    <div ng-if="$index==0">\n' + '\n' + '                        <input type="radio"\n' + '                               id="{{element.name}}_frequency"\n' + '                               name="{{element.name}}_frequency"\n' + '                               data-bvalidator="required"\n' + '                               data-bvalidator-msg="Please select an option"\n' + '                               value="{{item.value}}"\n' + '                               ng-model="data[element.name+\'_frequency\']"/>{{item.text}}\n' + '                    </div>\n' + '\n' + '                    <div ng-if="$index!=0">\n' + '\n' + '                        <input type="radio"\n' + '                               name="{{element.name}}_frequency"\n' + '                               value="{{item.value}}"\n' + '                               ng-model="data[element.name+\'_frequency\']"/>\n' + '                    </div>\n' + '                    {{item.text}} </label>\n' + '            </td>\n' + '\n' + '            <td><input type="text" placeholder="Measure" class="input input-mini" data-bvalidator="between[1:99],required"\n' + '                       name="{{element.name}}_measure" ng-model="data[element.name+\'_measure\']" ng-disabled="data[element.name+\'_frequency\']==0" />\n' + '            </td>\n' + '\n' + '            <td><select class="input-medium" data-bvalidator="required" name="{{element.name}}_unit"\n' + '                        ng-model="data[element.name+\'_unit\']" data-bvalidator-msg="Please select an option" ng-disabled="data[element.name+\'_frequency\']==0">\n' + '                <option value=""></option>        \n' + '                <option value="T1">Tambya</option>\n' + '                <option value="G1">Glass</option>\n' + '                <option value="K1">Cup (Big)</option>\n' + '                <option value="K2">Cup (Medium)</option>\n' + '                <option value="K3">Cup (Small)</option>\n' + '                <option value="D1">Dish</option>\n' + '                <option value="W1">Wati</option>\n' + '                <option value="P1">Pali</option>\n' + '                <option value="S1">Spoon (Big)</option>\n' + '                <option value="S2">Spoon (Medium)</option>\n' + '                <option value="S3">Spoon (Small)</option>\n' + '            </select>\n' + '            </td>\n' + '\n' + '        </tr>\n' + '        </tr>\n' + '    </table>\n' + '\n' + '\n' + '    <div class="controls">\n' + '        <button class="btn  btn-primary"\n' + '                type="submit" data-plus-as-tab="false">Save\n' + '        </button>\n' + '    </div>\n' + '</form>\n' + '\n' + '\n' + '\n' + '');
    }
]);
angular.module('template/standardForm/standardForm.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/standardForm/standardForm.html', '<form ng-submit="onSubmit(data)" action="javascript:void(0)" class="well" xmlns="http://www.w3.org/1999/html">\n' + '    <div ng-repeat="element in schema.properties">\n' + '        <form-element config="{{element}}"></form-element>\n' + '    </div>\n' + '\n' + '    <div class="controls">\n' + '        <button class="btn btn-small btn-primary"\n' + '                type="submit" data-plus-as-tab="false">Save\n' + '        </button>\n' + '    </div>\n' + '</form>\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '');
    }
]);
angular.module('template/surveyForm/surveyForm.html', []).run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put('template/surveyForm/surveyForm.html', '<form  class="well" ng-enter="showNext()">\n' + '    <div ng-repeat="element in flow.properties">\n' + '        <form-element config="{{element}}" ></form-element>\n' + '    </div>\n' + '\n' + '    <div class="">\n' + '        <div class="control-label"><label></label></div>\n' + '\n' + '        <div class="controls">\n' + '            <a class="btn btn-small btn-primary" ng-click="showNext()">Next &#187;</a>\n' + '        </div>\n' + '\n' + '    </div>\n' + '</form>\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '');
    }
]);