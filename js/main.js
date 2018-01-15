var hilaApp = angular.module('hilaApp', ['ngRoute', 'ui.router']);

    hilaApp.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('portfolio');
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
    hilaApp.controller('mainController', function($scope, $rootScope) {
        $scope.resume = "documents-forweb/HilaGutfreund-Resume-2017.pdf"; 
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
          });
          $('.instagram').on('didLoadInstagram', function(event, response) {
            $scope.images = response['data']; 
            $rootScope.$broadcast('photosready', $scope.images);
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
                "year": "Columbia: PLT, 2013",
                "link": "https://whet-plt.github.io/wdjc/", 
                "docLink": "https://github.com/WHET-PLT/documents",
                "image": "img/WHET.png"
            }, 
            {   "title": "Squareday", 
                "description": "SquareDay is a FourSquare based schedule generator.", 
                "year": "Columbia: User Interace Design, 2013",
                "link": "https://squareday.github.io/squareday/", 
                "docLink": "https://squareday.github.io/squareday/SquareDay_user.pdf", 
                "image": "img/squareday.png"
            }, 
            {
                "title": "Strokes", 
                "description": "A gesture based video controlling web application.", 
                "year": "Columbia: User Interface Design, 2013",
                "link": "https://hilagutfreund.github.io/Strokes/", 
                "docLink": "https://hilagutfreund.github.io/Strokes/documentation.html",
                "image": "img/daftPunk.jpg" 
            },
             {
                "title": "BuzzFeed Swami", 
                "description": "A web appplication to find the answers to BuzzFeed quizes.", 
                "year": "California, 2017",
                "link": "https://hilagutfreund.github.io/BFQuiz/", 
                "docLink": "https://hilagutfreund.github.io/BFQuiz/",
                "image": "img/bf-badge.png" 
            },
            {
                "title": "Heuristic Evaluation", 
                "description": "A usability evaluation for Amazon Music app.", 
                "year": "SJSU, 2017",
                "link": "https://www.hilariousdesigns.com/EngineeringPsychology/AmazonMusicApp/", 
                "docLink": "https://drive.google.com/file/d/1I2wJgH3MNeAWVzPltwA_Gi1PlcnsWG5Z/view?usp=sharing",
                "image": "img/musiclogo.png" 
            }
        ];

        // $scope.mydocuments = [

        //     {
        //         "title": "Home", 
        //         "break": null,
        //         "description": "A project on the concept of home through journal entries and works of Modern Jewish Literature.", 
        //         "year": "JTS Senior Seminar, 2013",
        //         "link": "documents-forweb/homethroughjournals.pdf", 
        //         "image": "img/home.jpg",
        //         "other": "documents-forweb/finalexplanation-seniorseminar.pdf", 
        //         "otherDesc": "Explanation of project"
        //     }, 
        //     {
        //         "title": "Butler Library", 
        //         "break": null,
        //         "description": "An essay exploring the Columbia University Library, Butler, as a type of home.", 
        //         "year": "The Art of Being Onself, 2011",
        //         "link": "documents-forweb/butlerlibrary.pdf", 
        //         "image": "img/butler.jpg",
        //         "other": null, 
        //         "otherDesc": null
        //     }, 
        //     {
        //         "title": "Brou-Ha-What?",
        //         "break": 'br',
        //         "description": "An essay detailing how the word 'brouhaha' has become an integral part of my life.", 
        //         "year": "The Art of Being Oneself, 2011",
        //         "link": "documents-forweb/brouhaha-artofbeingoneself.pdf", 
        //         "image": "img/brouhaha.gif",
        //         "other": null,
        //         "otherDesc": null
        //     }, 
        //     {
        //         "title": "Margalit Street", 
        //         "break": 'br',
        //         "description": "An essay detailing my connection to my old neighborhood and house.", 
        //         "year": "The Art of the Essay, 2009",
        //         "link": "documents-forweb/journeytochildhood.pdf", 
        //         "image": "img/street.jpg",
        //         "other": null, 
        //         "otherDesc": null
        //     } 
        // ]
    });

    hilaApp.controller('aboutController', function($scope) {
    });

