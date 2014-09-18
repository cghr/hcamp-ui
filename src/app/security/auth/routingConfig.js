(function () {

    var config = {
        roles: ['public', 'user', 'manager'],
        accessLevels: {
            'public': '*',
            'anon': ['public'],
            'user': ['user', 'manager'],
            'manager': ['manager']
        }
    }
    angular.module('routingConfig', ['ui.router'])
        .constant('routingConfig', {

            userRoles: function () {
                var roles = config.roles
                var bitMask = "01"
                var userRoles = {}

                for (var role in roles) {
                    var intCode = parseInt(bitMask, 2)
                    userRoles[roles[role]] = {
                        bitMask: intCode,
                        title: roles[role]
                    }
                    bitMask = (intCode << 1).toString(2)
                }

                return userRoles
            },
            accessLevels: function () {
                var userRoles = this.userRoles()
                var accessLevelDeclarations = config.accessLevels
                var accessLevels = {}
                for (var level in accessLevelDeclarations) {
                    var resultBitMask
                    var role
                    if (typeof accessLevelDeclarations[level] == 'string') {
                        if (accessLevelDeclarations[level] == '*') {

                            resultBitMask = ''

                            for (role in userRoles) {
                                resultBitMask += "1"
                            }
                            //accessLevels[level] = parseInt(resultBitMask, 2)
                            accessLevels[level] = {
                                bitMask: parseInt(resultBitMask, 2),
                                title: accessLevelDeclarations[level]
                            }
                        } else {
                            console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'")
                        }


                    } else {

                        resultBitMask = 0
                        for (role in accessLevelDeclarations[level]) {
                            if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) {
                                resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask
                            } else {
                                console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'")
                            }

                        }
                        accessLevels[level] = {
                            bitMask: resultBitMask,
                            title: accessLevelDeclarations[level][role]
                        }
                    }
                }

                return accessLevels
            }

        })
})()