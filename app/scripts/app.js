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
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        
        var access = routingConfig.accessLevels;

        $urlRouterProvider.otherwise("/404");
      //
      // Now set up the states



   // Anonymous routes
        $stateProvider
            .state('anon', {
                abstract: true,
                templateUrl: "partials/index.html",
                data: {
                    access: access.anon
                }
            })
            .state('anon.login', {
                url: "/login",
                controller: 'LoginCtrl',
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/login.html"}
                }
            })
            .state('anon.signup', {
                url: "/signup",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/signup.html"}
                }
            })
            .state('anon.404', {
                url: '/404',
                templateUrl: '404.html'
            });







       // Public routes
        $stateProvider
            .state('public', {
                abstract: true,
                templateUrl: "partials/index.html",
                data: {
                    access: access.public
                }
            });


    // Regular user routes

        $stateProvider
            .state('user', {
                abstract: true,
                templateUrl: "partials/index.html",
                data: {
                    access: access.user
                }
            })
                .state("user.home", {
                    // Use a url of "/" to set a states as the "index".
                    url: "/",
                    views: {
                        nav:{templateUrl: "partials/navbar.html"},
                        main:{templateUrl: "partials/home.html"}
                    }
                })



                .state("user.profile", {
                // 
                    url: "/profile",
                    views: {
                        nav:{templateUrl: "partials/navbar.html"},
                        main:{templateUrl: "partials/profile.html"}
                    }
                })

                .state('user.join', {
                    url: "/join",
                    views: {
                        nav:{templateUrl: "partials/navbar.html"},
                        main:{templateUrl: "partials/event-list.html"}
                    }
                })
                .state('user.mobile', {
                    url: "/mobile",
                    views: {
                        nav:{templateUrl: "partials/navbar.html"},
                        main:{templateUrl: "partials/mobile.html"}
                    }
                })

                .state('user.presentation', {
                    url: "/presentation",
                    views: {
                        nav:{templateUrl: "partials/navbar.html"},
                        main:{templateUrl: "partials/presentation.html"}
                    }
                })




        // Admin routes
        $stateProvider
            .state('admin', {
                abstract: true,
                templateUrl: "partials/index.html",
                data: {
                    access: access.admin
                }
            })


            .state("admin.admin", {
            // 
                url: "/admin",
                views: {
                    nav:{templateUrl: "partials/navbar.html"},
                    main:{templateUrl: "partials/admin/index.html"}
                }
            })
                .state("admin.admin.users", {
                // 
                    url: "/users",
                    views: {
                        sidebar:{templateUrl: "partials/admin/user-browser.html"},
                        content:{templateUrl: "partials/admin/user-details.html"}
                    }
                })
                .state("admin.admin.user", {
                // 
                    url: "/user/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/user-browser.html"},
                        content:{templateUrl: "partials/admin/user-details.html"}
                    }
                })
                .state("admin.admin.decks", {
                // 
                    url: "/decks",
                    views: {
                        sidebar:{templateUrl: "partials/admin/decks-menu.html"},
                        content:{templateUrl: "partials/admin/deck-list.html"}
                    }
                })
                .state("admin.admin.deck", {
                // 
                    url: "/deck/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/slide-browser.html"},
                        content:{templateUrl: "partials/admin/deck-details.html"}
                    }
                })
                .state("admin.admin.groups", {
                // 
                    url: "/groups",
                    views: {
                        sidebar:{templateUrl: "partials/admin/group-browser.html"},
                        content:{templateUrl: "partials/admin/group-details.html"}
                    }
                })
                .state("admin.admin.group", {
                // 
                    url: "/group/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/group-browser.html"},
                        content:{templateUrl: "partials/admin/group-details.html"}
                    }
                })
                .state("admin.admin.edit", {
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
                .state("admin.admin.events", {
                // 
                    url: "/events",
                    views: {
                        sidebar:{templateUrl: "partials/admin/event-browser.html"},
                        content:{templateUrl: "partials/admin/event-details.html"}
                    }
                })
                .state("admin.admin.event", {
                // 
                    url: "/event/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/event-browser.html"},
                        content:{templateUrl: "partials/admin/event-details.html"}
                    }
                })
                .state('admin.player', {
                    url: "/player",
                    views: {
                        nav:{templateUrl: "partials/navbar.html"},
                        main:{templateUrl: "partials/player.html"},
                        controls:{templateUrl: "partials/player-controls.html"}
                    }
                })



        // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function($injector, $location) {
            if($location.protocol() === 'file')
                return;

            var path = $location.path()
            // Note: misnomer. This returns a query object, not a search string
                , search = $location.search()
                , params
                ;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
                return;
            }

            // If there was no search string / query params, return with a `/`
            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            // Otherwise build the search string and return a `/?` prefix
            params = [];
            angular.forEach(search, function(v, k){
                params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
        });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function($q, $location) {
            return {
                'responseError': function(response) {

                    if(response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });










    })
    .run(function ($rootScope, $state, $stateParams, Auth) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

    // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {


            if (!Auth.authorize(toState.data.access)) {
                $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
                event.preventDefault();
                
                if(fromState.url === '^') {
                    if(Auth.isLoggedIn()) {
                        $state.go('user.home');
                    } else {
                        $rootScope.error = null;
                        $state.go('anon.login');
                    }
                }
            }
        });
    });