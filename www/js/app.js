// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'ionic-table', 'firebase'])

.run(function($ionicPlatform,$rootScope, $state, AuthenticationService, AUTH_EVENTS) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthenticationService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'app.login') {
        event.preventDefault();
        $state.go('app.login');
      }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Turn off caching for demo simplicity's sake
  $ionicConfigProvider.views.maxCache(0);

  /*
  // Turn off back button text
  $ionicConfigProvider.backButton.previousTitleText(false);
  */

  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.enterprise', {
    url: '/enterprise/:nodeId',
    views: {
      'menuContent': {
        templateUrl: 'templates/enterprise.html',
        controller: 'EnterpriseCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('app.favorites', {
    url: '/favorites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favorites.html',
        controller: 'FavoritesCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('app.log_detail', {
    url: '/operation_detail/:log_id',
    views: {
      'menuContent': {
        templateUrl: 'templates/log_detail.html',
        controller: 'DetailCtrl'
      },
      'fabContent': {
        template: ''
      }
    }
  })

  .state('app.new_log', {
    url:'/new_log',
    views: {
      'menuContent': {
        templateUrl: 'templates/newLog.html',
        controller: 'NewlogCtrl'
      },
      'fabContent': {
        template: ''
      }
    }


  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
