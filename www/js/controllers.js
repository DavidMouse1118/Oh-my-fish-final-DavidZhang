/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])
//Controller for the whole app.
// This is where you can define methods or actions that stay constant throughout the app
.controller('AppCtrl', function($scope, $state, $rootScope, $ionicModal, $ionicPopover, $timeout, $ionicPopup,AUTH_EVENTS,AuthenticationService, NodeService) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.isExpanded = false;
  $scope.hasHeaderFabLeft = false;
  $scope.hasHeaderFabRight = false;

  $rootScope.currentUserName = window.localStorage.getItem('userName');

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthenticationService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  // logout method
  $scope.logout = function(){
    AuthenticationService.logout();
    $state.go('app.login');
  };

  var navIcons = document.getElementsByClassName('ion-navicon');
  for (var i = 0; i < navIcons.length; i++) {
    navIcons.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }

  ////////////////////////////////////////
  // Layout Methods
  ////////////////////////////////////////

  $scope.hideNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  };

  $scope.showNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  };

  $scope.hideTab = function() {
      var tab = angular.element(document.querySelector('.tabs-icon-top'));
      tab.css('display', 'none');
  };

  $scope.showTab = function() {
    var tab = angular.element(document.querySelector('.tabs-icon-top'));
    tab.css('display', 'block');
  };

  $scope.noHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  };

  $scope.setExpanded = function(bool) {
    $scope.isExpanded = bool;
  };

  $scope.setHeaderFab = function(location) {
    var hasHeaderFabLeft = false;
    var hasHeaderFabRight = false;

    switch (location) {
      case 'left':
      hasHeaderFabLeft = true;
      break;
      case 'right':
      hasHeaderFabRight = true;
      break;
    }

    $scope.hasHeaderFabLeft = hasHeaderFabLeft;
    $scope.hasHeaderFabRight = hasHeaderFabRight;
  };

  $scope.hasHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (!content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }

  };

  $scope.hideHeader = function() {
    $scope.hideNavBar();
    $scope.noHeader();
  };

  $scope.showHeader = function() {
    $scope.showNavBar();
    $scope.hasHeader();
  };

  $scope.clearFabs = function() {
    var fabs = document.getElementsByClassName('button-fab');
    if (fabs.length && fabs.length > 1) {
      fabs[0].remove();
    }
  };

  function delayExpansion(){
    $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight();
      for (var index in $scope.nodes.data[$scope.nodes.currentIndex]) {
        NodeService.parseNode($scope.nodes.data[$scope.nodes.currentIndex][index]);
      }
    }, 2000);
  }
})

//Controller for the Enterprise Workspace page
//Here are defined the methods and actions specific to user behaviour allowed on the Enterprise Workspace page
.controller('EnterpriseCtrl', function($scope, $rootScope,$stateParams, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicActionSheet, $ionicPopup
  , NodeService) {
    // Set Header
     $scope.$parent.showHeader();
     $scope.$parent.clearFabs();
     $scope.$parent.setHeaderFab('left');
     $scope.nodes = {data: null};
     // Triggered on a button click, or some other target
     $scope.show = function() {
    // Show the action sheet
    var that = this;
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'View' },
        { text: 'Download'}
      ],
      destructiveText: 'Delete',
      titleText: 'ACTIONS',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        hideSheet();
      },


    //Functionality defined for clicking any of the 2 buttons: <View>, <Download>
    buttonClicked: function(index, button) {
        //If <View> is clicked
          $state.go('app.log_detail', {'log_id': that.node._id});
        return true;
      },

      //Functionality defined for clicking <Delete> in the node's Action Menu
      destructiveButtonClicked: function() {
        //$scope.nodes.currentIndex++;
        that.showDeleteConfirm(that.node.name, that.node.id, that.node.parent_id);
        return true;
      }

    });
  };

     NodeService.getSubNodesById(window.localStorage.getItem('userID'), $scope.nodes);
     // Delay expansion
     $timeout(function() {
       $scope.isExpanded = true;
       $scope.$parent.setExpanded(true);
     }, 500);

     // Delay expansion
     $timeout(function() {
       ionicMaterialMotion.fadeSlideInRight();
       //console.log($scope.nodes);
       //console.log($scope.nodes.location);
       for (var index in $scope.nodes.data) {
      parseNode($scope.nodes.data[index]);
    }
       console.log("Aasdasd");
     }, 200)

     function parseNode(node){
       console.log(node);
  }
     // Set Ink
     ionicMaterialInk.displayEffect();
})

//Controller for the Login Page
//Includes authentication using the OTCS Ticket
.controller('LoginCtrl', function($rootScope, $ionicModal,$scope, $timeout, $state, $stateParams, ionicMaterialInk, AuthenticationService) {
  $scope.$parent.clearFabs();

  $timeout(function() {
    $scope.$parent.hideHeader();
  }, 0);

  $timeout(function() {
    $scope.$parent.hideTab();
  }, 0);

  $ionicModal.fromTemplateUrl('templates/signupmodal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.errorgone = function() {
    var errormessage = angular.element(document.querySelector('.login-error'));
    errormessage.css('display','none');
    var clearIcon = angular.element(document.querySelectorAll('.clear-icon'));
    clearIcon.css("background-image", "url('/img/icons/formfield_clear.svg')");
  }

  $scope.username = "";
  $scope.password= "";

  ionicMaterialInk.displayEffect();

  $scope.authenticate = AuthenticationService.login;
  $scope.signup = AuthenticationService.signup;
})

/*
 * Controller for operation detail page
 */
.controller('DetailCtrl', function ($scope, $stateParams, $timeout, $ionicHistory, ionicMaterialMotion, ionicMaterialInk, NodeService) {
  // Set Header
   $scope.$parent.showHeader();
   $scope.$parent.clearFabs();
   $scope.$parent.setHeaderFab('left');
   $scope.nodes = {data: null};

   //NodeService.getSubNodesById($rootScope.currentUserId, $scope.nodes);
   NodeService.getOperationDetails($stateParams.log_id, $scope.nodes);
   // Delay expansion
   $timeout(function() {
     $scope.isExpanded = true;
     $scope.$parent.setExpanded(true);
   }, 500);

   // Delay expansion
   $timeout(function() {
     ionicMaterialMotion.fadeSlideInRight();
     //console.log($scope.nodes);
     //console.log($scope.nodes.location);
     for (var index in $scope.nodes.data) {
    parseNode($scope.nodes.data[index]);
  }
     console.log("Aasdasd");
   }, 200)

   function parseNode(node){
  console.log(node);
  //SET ICON

}
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
   //console.log($scope.nodes.location);
   // Set Ink
   ionicMaterialInk.displayEffect();
})

.controller('NewlogCtrl', function($scope,$rootScope,$http, $ionicPopover, $ionicLoading, $compile, $stateParams, $timeout, $state, $ionicActionSheet, ionicMaterialInk, ionicMaterialMotion, NodeService) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);
  console.log(window.localStorage.getItem('userID'));

  $scope.formData = {};

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

  // Creates a new user based on the form fields
  $scope.createOperationLog = function() {

    // Grabs all of the text box fields
    var userData = {
      username: $scope.formData.username,
      Phone: $scope.formData.phone,
      created_at: $scope.formData.startdate,
      finished_at: $scope.formData.enddate,
      vesselName: $scope.formData.vessel,
      vesselDetails: $scope.formData.deVessel,
      dealorInfo: $scope.formData.Dealer,
      vesseloperator: $scope.formData.vesseloperator,
      fishName: $scope.formData.fishname,
      fishTotalWeight: $scope.formData.fishWeight,
      fishCount: $scope.formData.fishCount,
      fishAppxWeight: $scope.formData.fishLength,
      fishAppxLength: $scope.formData.fishsingleweight,
      location: [$scope.formData.longitude, $scope.formData.latitude],
      userId: window.localStorage.getItem('userID')
    };
    console.log(userData);
    var req = {
        method: 'POST',
        url: 'http://localhost:3000/operationlog',
        headers: {
          'ohmyfish-ticket': window.localStorage.getItem('ohmyfish-ticket'),
          'Content-Type': "application/json"
        },
        data: userData
        }

        $http(req).then(function(data){
          console.log(data);
        }, function(data){
          console.log('Error: ' + data);
        });

  //  NodeService.addOperationLog(userData);

  };


  ionicMaterialMotion.blinds();
  ionicMaterialInk.displayEffect();
})
//Controller for the Nearby location Page
.controller('FavoritesCtrl', function($scope,$http, $ionicModal,$rootScope,$ionicPopover, $ionicLoading, $compile, $stateParams, $timeout, $state, $ionicActionSheet, ionicMaterialInk, ionicMaterialMotion, NodeService) {
  $scope.$parent.showHeader();
  $scope.$parent.showTab();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);


  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


    $scope.navTitle = 'Google Map';
    $scope.$on('$ionicView.afterEnter', function(){
      if ( angular.isDefined( $scope.map ) ) {
        google.maps.event.trigger($scope.map, 'resize');
      }
    });

    // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        // Handling Clicks and location selection
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude, filteredResults){

          // Clears the holding array of locations
          locations = [];

          // Set the selected lat and long equal to the ones provided on the refresh() call
          selectedLat = latitude;
          selectedLong = longitude;

          // If filtered results are provided in the refresh() call...
          if (filteredResults){

            // Then convert the filtered results into map points.
            locations = convertToMapPoints(filteredResults);

            // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
            initialize(latitude, longitude, true);
          }

          // If no filter is provided in the refresh() call...
          else {

            var nodes = {data: null};

             NodeService.getSubNodesById(window.localStorage.getItem('userID'),nodes);
             console.log(nodes);
             // Delay expansion
             $timeout(function() {
               // Then convert the results into map points
               locations = convertToMapPoints(nodes);
               // Then initialize the map -- noting that no filter was used.
               initialize(latitude, longitude, false);
             }, 500);
            }
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){
            console.log(response);
            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.data.length; i++) {
              console.log("lol");
                var log = response.data[i];
                console.log(log);
                // Create popup windows for each record
                var contentString =' <div class="card-item">  <div style = "left: 7%;  top: 11%;  width: 53%;  height: 22px"><a href="#" style="width: 56%;position: absolute;left: 0;top: 0;">View Details>></a></div><div class="stable-bg ink ink-dark" style="background-color: #FFF">  <div class="item item-avatar item-text-wrap" style="border: none; padding:0; text-align: center;"> <p style="font-size: 17px"><b>fishName: </b>'+log.fishName+'</p>  <p style="padding-top:4px;font-size: 17px;"><b>total Weight: </b>'+log.fishTotalWeight+'</p>  <p style="padding-top:4px;font-size: 17px;"><b>total count: </b>'+log.fishCount+'</p>    </div>  </div></div>';
                  console.log(contentString);

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(log.location[1], log.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: log.fishName,
                    gender: log.fishTotalWeight,
                    age: log.fishCount,
                    favlang: log.vesselDetails
            });
            console.log(locations);
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };
    var initialize = function initialize(latitude, longitude, filter) {
      //var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
      // Uses the selected lat, long as starting point
        var myLatLng = {lat: selectedLat, lng: selectedLong};
        var icon = "";
        // If map has not been created...
        if (!map){

            // Create a new map and place in the index.html page
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 3,
                center: myLatLng
            });
        }
      // If a filter was used set the icons yellow, otherwise blue
        if(filter){
            icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
        }
        else{
            icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        }

        // Loop through each location in the array and place a marker
        locations.forEach(function(n, i){
            var marker = new google.maps.Marker({
                position: n.latlon,
                map: map,
                title: "Big Map",
                icon: icon,
            });

            // For each marker created, add a listener that checks for clicks
            google.maps.event.addListener(marker, 'click', function(e){

                // When clicked, open the selected marker's message
                var currentSelectedMarker = n;
                n.message.open(map, marker);
            });
        });

        // Set initial location as a bouncing red marker
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
            position: initialLocation,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        var lastMarker = marker;

        // Function for moving to a selected location
        map.panTo(new google.maps.LatLng(latitude, longitude));

        // Clicking on the Map moves the bouncing red marker
        google.maps.event.addListener(map, 'click', function(e){
            var marker = new google.maps.Marker({
                position: e.latLng,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            // When a new spot is selected, delete the old red bouncing marker
            if(lastMarker){
                lastMarker.setMap(null);
            }

            // Create a new red bouncing marker and move to it
            lastMarker = marker;
            map.panTo(marker.position);

            // Update Broadcasted Variable (lets the panels know to change their lat, long values)
            googleMapService.clickLat = marker.getPosition().lat();
            googleMapService.clickLong = marker.getPosition().lng();
            console.log(googleMapService.clickLat);
            $rootScope.$broadcast("clicked");
        });
        };


        googleMapService.refresh(43.6427197, -69.38397530000002);


        $scope.search = {};
        var queryBody = {};

    // Functions
    // ----------------------------------------------------------------------------

    // Get coordinates based on mouse click. When a click event is detected....
  $rootScope.$on("clicked", function(){

      // Run the gservice functions associated with identifying coordinates
      $scope.$apply(function(){
          $scope.search.latitude = parseFloat(googleMapService.clickLat).toFixed(3);
          $scope.search.longitude = parseFloat(googleMapService.clickLong).toFixed(3);
      });
  });

  // Take query parameters and incorporate into a JSON queryBody
    $scope.queryUsers = function(){

        // Assemble Query Body
        queryBody = {
            longitude: parseFloat($scope.search.longitude),
            latitude: parseFloat($scope.search.latitude),
            distance: parseFloat($scope.search.distance),
            fishName: $scope.search.fishName,
            totalWeight: $scope.search.fishTotalWeight,
            totalAmount: $scope.search.fishCount,
            userId: "123"
        };


        console.log(queryBody);
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/operationlog/query/',
            headers: {
              'ohmyfish-ticket': window.localStorage.getItem('ohmyfish-ticket'),
              'Content-Type': "application/json"
            },
            data: queryBody
            }

            $http(req).then(function(queryResults){
              // Query Body and Result Logging
              console.log("QueryBody:");
              console.log(queryBody);
              console.log("QueryResults:");
              console.log(queryResults);
              // Pass the filtered results to the Google Map Service and refresh the map
              googleMapService.refresh(queryBody.latitude, queryBody.longitude, queryResults);
              // Count the number of records retrieved for the panel-footer
              $scope.queryCount = queryResults.length;
              $scope.modal.hide();
            }, function(queryResults){
              console.log('Error ' + queryResults);
            });
    };
  });
