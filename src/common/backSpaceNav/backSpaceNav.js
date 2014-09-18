angular.module('backSpaceNav', ['jQuery'])
    .directive('keypressEvents', function ($document, jQuery) {

        function postLink() {

            $document.bind('keypress', function (e) {

                var target = jQuery(e.target || e.srcElement)
                if (e.keyCode == 8 && !target.is('input:text,input:password,[contenteditable="true"],textarea'))
                    e.preventDefault();

            });
        }

        return {
            restrict: 'A',
            link: postLink
        }
    }
)
