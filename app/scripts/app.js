'use strict';

// MathJax.Hub.Config({
//   tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
// });



angular.module('studiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ngCkeditor',
  'angular-client-side-auth'
])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/");
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
                        sidebar:{templateUrl: "partials/admin/user-browser.html"},
                        content:{templateUrl: "partials/admin/user-details.html"}
                    }
                })
                .state("admin.user", {
                // 
                    url: "/user/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/user-browser.html"},
                        content:{templateUrl: "partials/admin/user-details.html"}
                    }
                })
                .state("admin.decks", {
                // 
                    url: "/decks",
                    views: {
                        sidebar:{templateUrl: "partials/admin/decks-menu.html"},
                        content:{templateUrl: "partials/admin/deck-list.html"}
                    }
                })
                .state("admin.deck", {
                // 
                    url: "/deck/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/slide-browser.html"},
                        content:{templateUrl: "partials/admin/deck-details.html"}
                    }
                })
                .state("admin.groups", {
                // 
                    url: "/groups",
                    views: {
                        sidebar:{templateUrl: "partials/admin/group-browser.html"},
                        content:{templateUrl: "partials/admin/group-details.html"}
                    }
                })
                .state("admin.group", {
                // 
                    url: "/group/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/group-browser.html"},
                        content:{templateUrl: "partials/admin/group-details.html"}
                    }
                })
                .state("admin.edit", {
                    url: "/edit/:type",
                    views: {
                        sidebar:{templateUrl: "partials/admin/form-browser.html"},
                        content:{
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
                        sidebar:{templateUrl: "partials/admin/event-browser.html"},
                        content:{templateUrl: "partials/admin/event-details.html"}
                    }
                })
                .state("admin.event", {
                // 
                    url: "/event/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/event-browser.html"},
                        content:{templateUrl: "partials/admin/event-details.html"}
                    }
                })

            .state('join', {
                url: "/join",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/event-list.html"}
                }
            })
            .state('mobile', {
                url: "/mobile",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/mobile.html"}
                }
            })
            .state('player', {
                url: "/player",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/player.html"},
                    controls:{templateUrl: "partials/player-controls.html"}
                }
            })
            .state('presentation', {
                url: "/presentation",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/presentation.html"}
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