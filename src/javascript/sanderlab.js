
var app = angular.module('sanderlab', ['ngMaterial', 'ui.router']);

app.config(['$mdThemingProvider', '$urlRouterProvider', '$stateProvider', 
            function($mdThemingProvider, $urlRouterProvider, $stateProvider) {
  
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('blue-grey');
  
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: '',
      templateUrl: 'javascript/partials/home.html'
    })
    .state('people', {
        url: '/people',
        templateUrl: 'javascript/partials/people.html'
    })
    .state('research', {
        url: '/research',
        templateUrl: 'javascript/partials/research.html'
    })
    .state('tools', {
        url: '/tools',
        templateUrl: 'javascript/partials/tools.html'
    })
    .state('publications', {
      url: '/publications',
      templateUrl: 'javascript/partials/publications.html'
    })
    .state('news', {
      url: '/news',
      templateUrl: 'javascript/partials/news.html'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'javascript/partials/contact.html'
    });
  
}]);

app.controller('MainCtrl', ['$scope', '$log', '$document', '$transitions', '$state', 
                            function($scope, $log, $document, $transitions, $state){
  $scope.title = 'Sander lab';
  $scope.pages = [
    {title:'People', state:'people'}, 
    {title:'Research', state:'research'}, 
    {title:'Tools', state:'tools'}, 
    {title:'Publications', state:'publications'}, 
    {title:'News', state:'news'}, 
    {title:'Contact', state:'contact'}
  ];
  
  $scope.selectedTabIndex = -1; //default to no tab set (home)
  
  //watch for tab changes--set the state depending on the tab set.
  $scope.$watch('selectedTabIndex', function(current, old){
    if (!$scope.pages[current]){
      $state.go("index");
      return;
    }
    $state.go($scope.pages[current].state);
  });

  //update the tab selected based on the current state. 
  //necessary for initial load  (that might be it, but not sure)
  $transitions.onFinish({}, function(transition){
    var idx = _.findIndex($scope.pages, function(p){
      if (p.state == transition.to().name){
        return true;
      }
    });
    if ($scope.selectedTabIndex !== idx){
      $scope.selectedTabIndex = idx;
    }
  });
      
}]);
