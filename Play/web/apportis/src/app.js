angular
    .module('Apportis', ['ngMaterial', 'ui.router', 'ngSanitize', 'health-guide', 'community', 'nav'])
    .config(function($mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider){

        // Routes
        $urlRouterProvider.otherwise("/");
        $stateProvider
          .state('home', {
              url: "/",
              templateUrl: "views/home.html",
              controller: function($scope) {
                  $scope.isHome = true;
              }
          })
          .state('health-guide', {
              url: "/health-guide",
              templateUrl: "views/health-guide.html",
              controllerAs: 'ctrl',
              controllerProvider: function() {
                  return 'HealthGuideController';
              }
          })
          .state('about-you', {
              url: "/about-you",
              templateUrl: "views/about-you/layout.html",
              controller: function($scope) {
                  $scope.isHome = false;
              }
          })
          .state('about-you.disclaimer', {
              url: "/start",
              templateUrl: "views/about-you/disclaimer.html",
              controller: function($scope) {
                  $scope.isHome = false;
              }
          })
          .state('about-you.start', {
              url: "/start",
              templateUrl: "views/about-you/start.html",
              controller: function($scope) {
                  $scope.isHome = false;
              }
          })
          .state('about-you.objectives', {
              url: "/objectives",
              templateUrl: "views/about-you/objectives.html",
              controller: function($scope) {
                  $scope.isHome = false;
                  console.log('objectives!');
              }
          })
          .state("about-you.ready", {
              url: "/ready",
              templateUrl: "views/about-you/ready.html",
              controller: function($scope) {
                  $scope.isHome = false;
              }
          })
          .state('community', {
              url: "/community",
              templateUrl: "views/community/main.html",
              controllerAs: 'ctrl',
              controllerProvider: function() {
                  return 'CommunityController';
              }
          });

        // Icons
        $mdIconProvider
            .icon("logo"       , "./assets/svg/anthembcbs.svg")

            .icon("menu-close"   , "./assets/svg/ic_chevron_left_black_24px.svg")
            .icon("home"   , "./assets/svg/ic_home_black_24px.svg")
            .icon("settings"   , "./assets/svg/ic_settings_black_24px.svg")
            .icon("power"   , "./assets/svg/ic_power_settings_new_black_24px.svg")

            // home - icon grid
            .icon("search"   , "./assets/svg/ic_search_white_24px.svg")
            .icon("urgent-care"   , "./assets/svg/ic_local_hospital_white_24px.svg")
            .icon("id-cards"   , "./assets/svg/ic_picture_in_picture_white_24px.svg")
            .icon("prescriptions"   , "./assets/svg/ic_local_pharmacy_white_24px.svg")
            .icon("costs"   , "./assets/svg/ic_attach_money_white_24px.svg")
            .icon("add_info"   , "./assets/svg/ic_assignment_white_24px.svg")
            .icon("group"   , "./assets/svg/ic_group_white_24px.svg")
            .icon("health-guide"   , "./assets/svg/ic_healing_white_24px.svg")

            // wellness objectives
            .icon("reduce-stress"   , "./assets/svg/ic_mood_white_24px.svg")
            .icon("sleep"   , "./assets/svg/ic_hotel_white_24px.svg")
            .icon("loose-weight"   , "./assets/svg/ic_trending_down_white_24px.svg")
            .icon("eat"   , "./assets/svg/ic_restaurant_menu_white_24px.svg")
            .icon("run"   , "./assets/svg/ic_directions_run_white_24px.svg")

            .icon("menu"       , "./assets/svg/menu.svg"        , 24)
            .icon("share"      , "./assets/svg/share.svg"       , 24)
            .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
            .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        // Theme
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('green')
            .warnPalette('purple');

    });
