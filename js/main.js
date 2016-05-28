    // var feed = new Instafeed({
    //     get: 'tagged',
    //     tagName: 'awesome',
    //     //clientId: '3271830693.467ede5.3d940be0e681483394ef1bc044270f05',
    //     userId: "3271830693", 
    //     accessToken: "3271830693.467ede5.3d940be0e681483394ef1bc044270f05",
    //     template: '<a href="{{link}}"><img src="{{image}}" /></a>'
    // });
    // feed.run();


    // var feed = new Instafeed({
    // userId: "3271830693", 
    // accessToken: "3271830693.467ede5.3d940be0e681483394ef1bc044270f05",  

$(document).ready(function(){
 var userfeed = new Instafeed({
        get: 'user',
        userId: 3271830693, 
        accessToken: "3271830693.467ede5.3d940be0e681483394ef1bc044270f05", 
        filter: function(image){
            return image.user.username === "hilariousdesigns"; 
        },
        useHttp: true,
        sortBy: "most-recent",
        limit: 20
    });
    userfeed.run();
}); 


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
        $urlRouterProvider.otherwise('portfolio');
        $stateProvider
        .state('portfolio', {
            url: '/portfolio',
            templateUrl: 'templates/main.html',
            controller: 'portfolioController'
        })

        .state('resume', {
            url: '/resume', 
            templateUrl: 'templates/projects.html'
        })
    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    scotchApp.controller('portfolioController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    scotchApp.controller('projectsController', function($scope) {
        $scope.message = 'projects! JK. This is just a demo.';
    });