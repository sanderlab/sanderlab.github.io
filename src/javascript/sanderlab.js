
var app = angular.module('sanderlab', ['ngMaterial', 'ui.router']);

app.config(['$mdThemingProvider', '$urlRouterProvider', '$stateProvider', 
            function($mdThemingProvider, $urlRouterProvider, $stateProvider) {
  
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('blue-grey');
  
  var backController = function ($scope, $element, $state, $stateParams) {
    if ($scope.back) {
      $element.addClass('back');
    }
    $scope.$on('$viewContentAnimationEnded', function () {
      $element.removeClass('back');
    });
    $scope.$on('uiBack', function (event, args) {
      $element.addClass('back');
    });
  };
  
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'javascript/partials/home.html',
      controller: backController
    })
    .state('people', {
      url: '/people',
      templateUrl: 'javascript/partials/people.html',
      controller: backController
    })
    .state('research', {
      url: '/research',
      templateUrl: 'javascript/partials/research.html',
      controller: backController
    })
    .state('tools', {
      url: '/tools',
      templateUrl: 'javascript/partials/tools.html',
      controller: backController
    })
    .state('publications', {
      url: '/publications',
      templateUrl: 'javascript/partials/publications.html',
      controller: backController
    })
    .state('news', {
      url: '/news',
      templateUrl: 'javascript/partials/news.html',
      controller: backController
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'javascript/partials/contact.html',
      controller: backController
    });
  
}]);


app.run(['$rootScope', '$log', '$transitions', '$state',
         function ($rootScope, $log, $transitions, $state) {
  
  var allorderedstates = _.map($state.get().slice(1), 'name');
  var goBackStates = _.reduce(allorderedstates, function(memo, state, idx){
    if (idx > 0){
      memo[state] = allorderedstates.slice(0, idx);
    }
    return memo;
  }, {});
  
  //used for animations 
  //   see http://plnkr.co/edit/3cBugxsAglHHpt9XAkMp?p=info
  //   and https://ui-router.github.io/docs/latest/classes/transition.transition-1.html
  $transitions.onStart({}, function(transition){
    $log.info('transition start: ' + transition.from().name + ' -> ' + transition.to().name);
    
    // we cannot distinguish history "back" and "forward", so if possible, can using this alternative way
    // using data instead program for history back
    var backStates = goBackStates[transition.from().name];
    if (_.isArray(backStates) && backStates.indexOf(transition.to().name) >= 0 ){
      $rootScope.back = true; //needs to be set for incoming transition animation
      $rootScope.$broadcast('uiBack', null); //used for outgoing transition animation
    }
    else{
      $rootScope.back = false; //reset
    }
  });
}]);


//
//
// CONTROLLER
//
//
app.controller('MainCtrl', ['$scope', '$element', '$log', '$document', '$transitions', '$state', '$stateParams',
                            function($scope, $element, $log, $document, $transitions, $state, $stateParams){
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
