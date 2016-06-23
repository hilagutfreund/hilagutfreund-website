var hilaApp = angular.module('hilaApp', ['ngRoute', 'ui.router']);

    hilaApp.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('portfolio');
        // $urlRouterProvider.when('resume', 'documents-forweb/HilaGutfreund-Resume-2016.pdf');
        $stateProvider
        .state('portfolio', {
            url: '/portfolio',
            templateUrl: 'templates/main.html',
            controller: 'portfolioController'
        })

        .state('about', {
            url: '/about', 
            templateUrl: "templates/about.html", 
            controller: 'aboutController'

        })
    });
   
    // create the controller and inject Angular's $scope
    hilaApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $scope.resume = "documents-forweb/HilaGutfreund-resume-2016.pdf"; 
    });
    
    hilaApp.controller('portfolioController', function($scope, $rootScope) {
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

        $scope.myprojects = [
            {
                "title": "WDJC", 
                "description": "DJ is a procedural scripting language for algorithmic music production.", 
                "year": "PLT, 2013",
                "link": "http://whet-plt.github.io/wdjc/", 
                "docLink": "https://github.com/WHET-PLT/documents",
                "image": "img/WHET.png"
            }, 
            {   "title": "Squareday", 
                "description": "SquareDay is a FourSquare based schedule generator.", 
                "year": "User Interace Design, 2013",
                "link": "http://squareday.github.io/squareday/", 
                "docLink": "http://squareday.github.io/squareday/SquareDay_user.pdf", 
                "image": "img/squareday.png"
            }, 
            {
                "title": "Strokes", 
                "description": "A gesture based video controlling web application.", 
                "year": "User Interface Design, 2013",
                "link": "http://hilagutfreund.github.io/Strokes/", 
                "docLink": "http://hilagutfreund.github.io/Strokes/documentation.html",
                "image": "img/daftPunk.jpg" 
            }
        ];

         $scope.mydocuments = [

            {
                "title": "Home", 
                "break": null,
                "description": "A project on the concept of home through journal entries and works of Modern Jewish Literature.", 
                "year": "JTS Senior Seminar, 2013",
                "link": "documents-forweb/homethroughjournals.pdf", 
                "image": "img/home.jpg",
                "other": "documents-forweb/finalexplanation-seniorseminar.pdf", 
                "otherDesc": "Explanation of project"
            }, 
            {
                "title": "Butler Library", 
                "break": null,
                "description": "An essay exploring the Columbia University Library, Butler, as a type of home.", 
                "year": "The Art of Being Onself, 2011",
                "link": "documents-forweb/butlerlibrary.pdf", 
                "image": "img/butler.jpg",
                "other": null, 
                "otherDesc": null
            }, 
            {
                "title": "Brou-Ha-What?",
                "break": 'br',
                "description": "An essay detailing how the word 'brouhaha' has become an integral part of my life.", 
                "year": "The Art of Being Oneself, 2011",
                "link": "documents-forweb/brouhaha-artofbeingonself.pdf", 
                "image": "img/brouhaha.gif",
                "other": null,
                "otherDesc": null
            }, 
            {
                "title": "Margalit Street", 
                "break": 'br',
                "description": "An essay detailing my connection to my old neighborhood and house.", 
                "year": "The Art of the Essay, 2009",
                "link": "documents-forweb/journeytochildhood.pdf", 
                "image": "img/street.jpg",
                "other": null, 
                "otherDesc": null
            } 
        ]
    });

    hilaApp.controller('aboutController', function($scope) {
        $scope.message = 'projects! JK. This is just a demo.';
    });
