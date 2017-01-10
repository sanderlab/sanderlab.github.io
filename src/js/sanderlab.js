
var app = angular.module('sanderlab', ['ngMaterial', 'ui.router']);

//
//
// CONFIG
//
//
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
    
    //add all parameters to the scope
    $scope.person = null;
    $scope.params = $stateParams;
    if ($scope.params.personId){ //helper function to add person if person page.
      $scope.person = _.find($scope.sitedata.people, function(person){
        if ($scope.params.personId == person.key){ return true; }
        return false;
      });
    }
  };
  
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'js/partials/home.html',
      controller: backController,
      isTab: false
    })
    .state('personpage', {
      url: '/people/:personId',
      templateUrl: 'js/partials/person.html',
      controller: backController,
      isTab: false
    })
    .state('research', {
      url: '/research',
      templateUrl: 'js/partials/research.html',
      controller: backController,
      isTab: true
    })
    .state('people', {
      url: '/people',
      templateUrl: 'js/partials/people.html',
      controller: backController,
      isTab: true
    })
    .state('news', {
      url: '/news',
      templateUrl: 'js/partials/news.html',
      controller: backController,
      isTab: true
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'js/partials/contact.html',
      controller: backController,
      isTab: true
    })
    .state('join', {
      url: '/join',
      templateUrl: 'js/partials/join.html',
      controller: backController,
      isTab: true
    })
    .state('cbio center', {
      url: '/cbio',
      templateUrl: 'js/partials/cbiocenter.html',
      controller: backController,
      isTab: true
    });
  
}]);

//
//
// RUN
//
//
app.run(['$rootScope', '$log', '$transitions', '$state',
         function ($rootScope, $log, $transitions, $state) {
  
  var orderedstatenames = _.reduce($state.get(), function(memo, state){
    if (!state.isTab){
      memo.push(state.name);
    }
    return memo;
  }, []);
  var goBackStates = _.reduce(orderedstatenames, function(memo, state, idx){
    if (idx > 0){
      memo[state] = orderedstatenames.slice(0, idx);
    }
    return memo;
  }, {});
  
  //used for animations 
  //   see http://plnkr.co/edit/3cBugxsAglHHpt9XAkMp?p=info
  //   and https://ui-router.github.io/docs/latest/classes/transition.transition-1.html
  $transitions.onStart({}, function(transition){
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
app.controller('MainCtrl', ['$log', '$scope', '$element', '$log', '$document', '$transitions', 
                            '$state', '$stateParams', '$http', '$sce',
                            function($log, $scope, $element, $log, $document, $transitions, 
                                     $state, $stateParams, $http, $sce){
  $scope.title = 'Sander lab';
  
  $http.get('sanderlabdata.json').then(function(response) {
    $log.debug('site data loaded:', response.data);
    response.data.news = _.map(response.data.news, function(newsitem){
      newsitem.timestamp = Date.parse(newsitem.date);
      return newsitem;
    });
    
    $scope.sitedata = response.data;
  });
  
  //helper functions for the view
  $scope.getSafeHtml = function(str){
    return $sce.trustAsHtml(str);
  }
  $scope.reverseEmail = function(addr){
    var nameDomainArr = addr.split('@');
    return nameDomainArr[0].split('').reverse().join('') + '@' + nameDomainArr[1];
  };
  
  //set the pages configured for this site into the scope.
  $scope.pages = _.reduce($state.get(), function(memo, state){
                    if (state.isTab){
                      memo.push({
                        'title':state.name.charAt(0).toUpperCase() + state.name.slice(1), 
                        'state':state.name
                      });
                    }
                    return memo;
                  }, []);
  $scope.selectedTabIndex = -1; //default to no tab set (home)
  
  //update the tab selected based on the current state. 
  //only execute once for initial load
  $transitions.onFinish({}, function(transition){
    if (transition.to().name == 'personpage') { //special case for person page
      //$scope.selectedTabIndex = 1;
      $scope.selectedTabIndex = _.findIndex($scope.pages, function(p){
        if (p.state == 'people'){ return true; } //make sure people tab is selected 
      });
      return; 
    }
    var idx = _.findIndex($scope.pages, function(p){
      if (p.state == transition.to().name){
        return true;
      }
    });
    if ($scope.selectedTabIndex !== idx){
      $scope.selectedTabIndex = idx;
    }
  });
  

  //watch for tab changes--set the state depending on the tab set.
  $scope.$watch('selectedTabIndex', function(current, old){
    if (!$scope.pages[current]){ //default to home
      $state.go("index");
      return;
    }
    $state.go($scope.pages[current].state);
  });
}])


//
//
// DIRECTIVES
//
//

;
