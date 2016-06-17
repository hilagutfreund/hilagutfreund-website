// $(document).ready(function() {
//     var accessToken = '3271830693.e8750bb.cb4e791f241b474d891c043abdac34c0';
//     var userID = 3271830693;
//     $(".instagram.search").instagram({
//         userID = userID,
//         show: 5,
//         accessToken: accessToken
//     });
// });


  // $(document).ready(function(){
  //   jQuery(function($) {
  //         $('.instagram').on('willLoadInstagram', function(event, options) {
  //           console.log(options);
  //         });
  //         $('.instagram').on('didLoadInstagram', function(event, response) {
  //           console.log(response);
  //         });
  //         $('.instagram').instagram({
  //         userId: 3271830693,
  //         accessToken: '3271830693.e8750bb.cb4e791f241b474d891c043abdac34c0'
  //       });

  //       })
  //   }); 


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
    
    scotchApp.controller('portfolioController', function($scope, $rootScope) {
        $scope.message = 'Look! I am an about page.';
        $scope.imagesReady = false; 
        $scope.$on('photosready', function(events, args){
            $scope.photosready = true; 
            $scope.myfeed= args; 
            console.log($scope.photosready);
            console.log($scope.myfeed);
            $scope.$root.$digest()

        })

        jQuery(function($) {
          $('.instagram').on('willLoadInstagram', function(event, options) {
            console.log(options);
          });
          $('.instagram').on('didLoadInstagram', function(event, response) {
            //console.log(response);
            $scope.images = response['data']; 
            //$scope.imagesReady = true; 
            $rootScope.$broadcast('photosready', $scope.images);
            //console.log($scope.images[0]['images']['thumbnail']);
          });
         $('.instagram').instagram({
                  userId: 3271830693,
                  accessToken: '3271830693.e8750bb.cb4e791f241b474d891c043abdac34c0'
                });

            });
       


        
    });

    scotchApp.controller('projectsController', function($scope) {
        $scope.message = 'projects! JK. This is just a demo.';
    });