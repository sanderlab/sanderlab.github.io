
var app = angular.module('sanderlab', ['ngMaterial', 'ui.router']);

app.config(['$mdThemingProvider', '$urlRouterProvider', '$stateProvider', 
            function($mdThemingProvider, $urlRouterProvider, $stateProvider) {
  
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('blue-grey');
  
  $urlRouterProvider.otherwise('/tab/dash');
  $stateProvider
    .state('view1', {
        url: "/view1",
        templateUrl: "partials/view1.html"
    })
    .state('view2', {
        url: "/view2",
        templateUrl: "partials/view2.html"
    })
    .state('view3', {
        url: "/view3",
        templateUrl: "partials/view3.html"
    });
  
}]);

app.controller('MainCtrl', ['$scope', '$log', '$document', '$location', 
                            function($scope, $log, $document, $location){
  $scope.title = 'Sander lab';
  $scope.pages = [
    {title:'People', url:''}, 
    {title:'Research', url:''}, 
    {title:'Tools', url:''}, 
    {title:'Publications', url:''}, 
    {title:'News', url:''}, 
    {title:'Contact', url:''}
  ];
  
  $scope.selectedTabIndex = -1;
  $scope.$watch('selectedTabIndex', function(current, old){
      switch (current) {
          case 0:
              $location.url("/view1");
              break;
          case 1:
              $location.url("/view2");
              break;
          case 2:
              $location.url("/view3");
              break;
      }
  });
}]);
