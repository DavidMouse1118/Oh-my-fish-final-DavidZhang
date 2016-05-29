angular.module('starter')
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
.factory('AuthenticationService', function($http, $state, $rootScope,  $ionicPopup) {
  var LOCAL_TOKEN_KEY = 'ohmyfish-ticket';
  var isAuthenticated = false;
  var automationUrl = "http://localhost:3000";
  var tick = null;


  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    //$http.defaults.headers.common.Authorization = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("userName");
  }

  loadUserCredentials();

  return {
    getURL : function(){
      return automationUrl;
    },
    setURL : function(setURL){
      automationUrl = setURL;
    },
    getTicket : function(){
      return tick;
    },
    setTicket: function(ticket){
      tick = ticket;
    },
    //REST API call to authenticate a user's credentials
    login: function(user, pass){
      console.log(user, pass);
      $http({
        method: 'POST',
        url: automationUrl + '/authenticate',
        data: "name=" + user + "&password=" + pass,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(msg) {
        console.log(msg);
        tick = msg.data.token;
        console.log(tick);
        //set the Id and username in the window localStorage
        window.localStorage.setItem("userID", msg.data.userID);
        window.localStorage.setItem("userName", msg.data.userName);
        console.log($rootScope.currentUserName);
        console.log($rootScope.currentUserId);
        storeUserCredentials(msg.data.token);
        $state.go('app.favorites');
      }, function failCallback(msg, username) {
        var errormessage = angular.element(document.querySelector('.login-error'));
        errormessage.css('display','block');
        errormessage.html("Invalid credentials were entered.");
        var clear = angular.element(document.querySelectorAll('.clear-icon'));
        clear.css("background-image", "url('/img/icons/formfield_error.svg')");
      });
    },
    signup: function(user, pass){
      console.log(user, pass);
      $http({
        method: 'POST',
        url: automationUrl + '/signup',
        data: "name=" + user + "&password=" + pass,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(msg) {
        console.log(msg);
        //console.log(msg.headers("otcsticket"));
        $state.go('app.favorites');
        var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
      }, function failCallback(msg, username) {
      console.log(msg);
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: msg
      });
      });
    },
    logout: function() {
      destroyUserCredentials();
    },
    isAuthenticated: function() {return isAuthenticated;}
  };
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

.factory('NodeService', function($http, AuthenticationService, $rootScope) {
  return {
    addOperationLog: function(logData){
      $http({
        method: 'POST',
        url: AuthenticationService.getURL() + '/operationlog',
        data: logData,
        headers: {'ohmyfish-ticket': window.localStorage.getItem('ohmyfish-ticket'),'Content-Type': 'application/json'}
      }).then(function successCallback(msg) {
          console.log(msg);
        }, function failCallback(msg) {
          console.log(msg);
        });
    },
    getSubNodesById: function(id, nodes,callback){
      $http({
        method: 'GET',
        url: AuthenticationService.getURL() + '/operationlog/' + id,
        headers: {'ohmyfish-ticket': window.localStorage.getItem('ohmyfish-ticket')},
      }).then(function successCallback(msg) {
        console.log(msg);
        nodes.data = msg.data;
        return msg.data;
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    getOperationDetails: function(id,node){
      $http({
        method: 'GET',
        url: AuthenticationService.getURL() + '/operationlog/logDetail/' + id,
        headers: {'ohmyfish-ticket': window.localStorage.getItem('ohmyfish-ticket')},
      }).then(function successCallback(msg) {
        console.log(msg);
        node.data = msg.data;
        return msg.data;
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    deleteNode: function(id){
    }
  };
});
