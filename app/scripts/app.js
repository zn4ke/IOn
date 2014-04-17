'use strict';

MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
});



angular.module('studiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ngCkeditor'
])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/state1");
      //
      // Now set up the states
        $stateProvider
            .state("home", {
                // Use a url of "/" to set a states as the "index".
                url: "/",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/home.html"}
                }
            })
            .state("login", {
            // 
                url: "/login",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/login.html"}
                }
            })
            .state("signup", {
            // 
                url: "/signup",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/signup.html"}
                }
            })
            .state("profile", {
            // 
                url: "/profile",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/profile.html"}
                }
            })
            .state("admin", {
            // 
                url: "/admin",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/admin/index.html"}
                }
            })
                .state("admin.users", {
                // 
                    url: "/users",
                    views: {
                        browser:{templateUrl: "partials/admin/user-browser.html"},
                        details:{templateUrl: "partials/admin/user-details.html"}
                    },
                    controller: function($scope) {
                        $scope.info = 'admin.users controller';
                    }
                })
                .state("admin.decks", {
                // 
                    url: "/decks",
                    views: {
                        browser:{templateUrl: "partials/admin/deck-browser.html"},
                        details:{templateUrl: "partials/admin/deck-details.html"}
                    },
                    controller: function($scope) {
                        $scope.info = 'admin.decks controller';
                    }
                })
                .state("admin.groups", {
                // 
                    url: "/groups",
                    views: {
                        browser:{templateUrl: "partials/admin/group-browser.html"},
                        details:{templateUrl: "partials/admin/group-details.html"}
                    },
                    controller: function($scope) {
                        $scope.info = 'admin.groups controller';
                    }
                })
                .state("admin.edit", {
                    url: "/edit/:type",
                    views: {
                        browser:{templateUrl: "partials/admin/form-browser.html"},
                        details:{
                            templateUrl: function(stateParams){
                                return '/partials/forms/' + stateParams.type + '.html'
                            }
                        }
                    }
                })
                .state("admin.events", {
                // 
                    url: "/events",
                    views: {
                        browser:{templateUrl: "partials/admin/event-browser.html"},
                        details:{templateUrl: "partials/admin/event-details.html"}
                    }
                })
            .state('viewer', {
                url: "/viewer/:eventId",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/viewer.html"}
                },
                //templateUrl: "partials/state1.html",
                controller: function($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }
            })
            .state('join', {
                url: "/join",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/event-list.html"}
                }
            })

            .state('state2', {
                url: "/state2/:id",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/state2.html"}
                },
            })
                .state('state2.list', {
                    url: "/list",
                    templateUrl: "partials/state2-list.html",
                    controller: function($scope) {
                        $scope.things = ["A", "Set", "Of", "Things"];
                    }
                })

            .state('enter',{
                url: "/enter",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/list.html"}
                }
            })




      
  //   // Intercept 401s and redirect you to login
  //   $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
  //     return {
  //       'responseError': function(response) {
  //         if(response.status === 401) {
  //           $location.path('/login');
  //           return $q.reject(response);
  //         }
  //         else {
  //           return $q.reject(response);
  //         }
  //       }
  //     };
  //   }]);
    })
    .run(function ($state, $stateParams, $rootScope, $location, Auth) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });
    });