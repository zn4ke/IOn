'use strict';

angular.module('studiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
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
                .state("admin.new", {
                    url: "/new/:type",
                    views: {
                        browser:{templateUrl: "partials/admin/form-browser.html"},
                        details:{
                            templateUrl: function(stateParams){
                                return '/partials/forms/' + stateParams.type + '.html'
                            }
                        }
                    }
                })
                .state("admin.lectures", {
                // 
                    url: "/lectures",
                    views: {
                        browser:{templateUrl: "partials/admin/lecture-browser.html"},
                        details:{templateUrl: "partials/admin/lecture-details.html"}
                    },
                    controller: function($scope) {
                        $scope.info = 'admin.lecture controller';
                    }
                })
            .state('state1', {
                url: "/state1",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/state1.html"}
                },
                //templateUrl: "partials/state1.html",
                controller: function($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }
            })
                .state('state1.list', {
                    url: "/list",
                    templateUrl: "partials/list.html",
                    //templateUrl: "partials/list.html",
                    controller: function($scope) {
                        console.log('state1.list controller')
                        $scope.items = ["A", "List", "Of", "Items"];
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