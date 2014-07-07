'use strict';


MathJax.Hub.Config({
  asciimath2jax: {
    delimiters: [['$','$'], ['$$','$$']]
  }
});

angular.module('ionApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ui.sortable',
    'ngCkeditor',
    'angularFileUpload',
    'ui.chart',
    'nvd3ChartDirectives'
])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        console.log('loading app config')
        
        var access = routingConfig.accessLevels;

        $urlRouterProvider.otherwise("/404");
      //
      // Now set up the states



   // Anonymous routes
        $stateProvider
            
            .state('anon', {
                abstract: true,
                templateUrl: "partials/window.html",
                controller: 'WindowCtrl',
                data: {
                    access: access.anon
                }
            })
                .state('anon.login', {
                    url: "/login",
                    controller: 'LoginCtrl',
                    views: {
                        content:{templateUrl: "partials/login.html"}
                    }
                })
                .state('anon.signup', {
                    url: "/signup",
                    views: {
                        content:{templateUrl: "partials/signup.html"}
                    }
                })
                .state('anon.404', {
                    url: '/404',
                    views: {
                        content:{templateUrl: "404.html"}
                    }
                });

       // Public routes
        $stateProvider
            .state('public', {
                abstract: true,
                templateUrl: "partials/window.html",
                controller: 'WindowCtrl',
                data: {
                    access: access.public
                }
            })
                .state("public.home", {
                // 
                    url: "/",
                    views: {
                        content:{templateUrl: "partials/home.html"}
                    }
                })
    // Regular user routes
        $stateProvider
            .state('user', {
                abstract: true,
                templateUrl: "partials/window.html",
                controller: 'WindowCtrl',
                data: {
                    access: access.user
                }
            })
                .state("user.home", {
                // 
                    url: "/",
                    views: {
                        content:{templateUrl: "partials/home.html"}
                    }
                })
                .state("user.profile", {
                // 
                    url: "/profile",
                    views: {
                        content:{templateUrl: "partials/profile.html"}
                    }
                })

                .state('user.join', {
                    url: "/join",
                    views: {
                        content:{templateUrl: "partials/event-list.html"}
                    }
                })
                .state('user.mobile', {
                    url: "/mobile",
                    views: {
                        content:{templateUrl: "partials/presentation.html"}
                    }
                })

                .state('user.presentation', {
                    url: "/presentation",
                    views: {
                        content:{templateUrl: "partials/presentation.html"},
                    }
                })


        // Admin routes
        $stateProvider
            .state('admin', {
                abstract: true,
                templateUrl: "partials/window.html",
                controller: 'WindowCtrl',
                data: {
                    access: access.admin
                },
            })

                .state("admin.video", {
                // 
                    url: "video",
                    views: {
                        content:{templateUrl: "partials/admin/tool-video.html"}
                    }
                })
                .state("admin.math", {
                // 
                    url: "math",
                    views: {
                        content:{templateUrl: "partials/admin/tool-math.html"}
                    }
                })
                .state("admin.chem", {
                // 
                    url: "chem",
                    views: {
                        content:{templateUrl: "partials/admin/tool-chem.html"}
                    }
                })


                .state("admin.admin", {
                // 
                    url: "/admin",
                    views: {
                        content:{templateUrl: "partials/admin/index.html"}
                    }
                })
                .state("admin.users", {
                // 
                    url: "/admin/users",
                    views: {
                        content:{templateUrl: "partials/admin/user-details.html"}
                    }
                })
                .state("admin.user", {
                // 
                    url: "/admin/user/:id",
                    views: {
                        sidebar:{templateUrl: "partials/admin/user-browser.html"},
                        content:{templateUrl: "partials/admin/user-details.html"}
                    }
                })
                .state("admin.decks", {
                // 
                    url: "/admin/decks",
                    views: {
                        content:{templateUrl: "partials/admin/deck-list.html"}
                    }
                })
                .state("admin.deck", {
                // 
                    url: "/admin/deck/:id/:slideNr",
                    views: {
                        content:{templateUrl: "partials/admin/deck-details.html"}
                    }
                })
                .state("admin.groups", {
                // 
                    url: "/admin/groups",
                    views: {
                        content:{templateUrl: "partials/admin/group-list.html"}
                    }
                })
                .state("admin.group", {
                // 
                    url: "/admin/group/:id",
                    views: {
                        content:{templateUrl: "partials/admin/group-details.html"}
                    }
                })
                .state("admin.new", {
                    url: "/admin/new/:type",
                    views: {
                        content:{
                            templateUrl: function(stateParams){
                                return '/partials/forms/' + stateParams.type + '.html'
                            }
                        }
                    }
                })
                .state("admin.edit", {
                    url: "/admin/edit/:type/:id",
                    views: {
                        content:{
                            templateUrl: function(stateParams){
                                return '/partials/forms/' + stateParams.type + '.html'
                            }
                        }
                    }
                })
                .state("admin.events", {
                // 
                    url: "/admin/events",
                    views: {
                        content:{templateUrl: "partials/admin/event-list.html"}
                    }
                })
                .state("admin.event", {
                // 
                    url: "/admin/event/:id",
                    views: {
                        content:{templateUrl: "partials/admin/event-details.html"}
                    }
                })
                .state('admin.files', {
                    url: "/admin/files",
                    views: {
                        content:{templateUrl: "partials/admin/file-list.html"}
                    }
                })
                .state('admin.file', {
                    url: "/admin/file/:id",
                    views: {
                        content:{templateUrl: "partials/admin/file-details.html"}
                    }
                })

                .state('admin.player', {
                    url: "/admin/player",
                    views: {
                        content:{templateUrl: "partials/player.html"},
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
