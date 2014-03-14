'use strict';

angular.module('studiApp')
    .directive('access', function ( $rootScope, Auth ) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                // console.log('linking')
                var prevDisp = element.css('display')
                    , userRole
                    , access;

                $rootScope.user = Auth.currentUser();
                $rootScope.$watch('currentUser', function(user) {
                    if(user && user.role){
                        userRole = user.role;
                    }
                    updateCSS();
                }, true);

                attrs.$observe('access', function(al) {
                    if(al) access = al;
                    updateCSS();
                });

                function updateCSS() {
                    if(userRole && access) {
                        if(!Auth.hasRole(access)){
                            element.css('display', 'none');
                        }
                        else
                            element.css('display', prevDisp);
                    }
                }
            }
        };
  });
