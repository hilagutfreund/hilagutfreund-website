var scotchApp = angular.module('scotchApp', ['ngRoute', 'ui.router']);

    // configure our routes
    // scotchApp.config(function($routeProvider) {
    //     $routeProvider

    //         // route for the home page
    //         .when('/', {
    //             templateUrl : 'templates/main.html',
    //             controller  : 'mainController'
    //         })

    //         // route for the about page
    //         .when('/resume', {
    //             templateUrl : 'templates/resume.html',
    //             controller  : 'aboutController'
    //         })

    //         // route for the contact page
    //         .when('/projects', {
    //             templateUrl : 'templates/projects.html',
    //             controller  : 'projectsController'
    //         });
    // });

    scotchApp.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('home');
        $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/main.html',
            controller: 'mainController'
        })

        .state('projects', {
            url: '/projects', 
            templateUrl: 'templates/projects.html'
        })
    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    scotchApp.controller('resumeController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    scotchApp.controller('projectsController', function($scope) {
        $scope.message = 'projects! JK. This is just a demo.';
    });