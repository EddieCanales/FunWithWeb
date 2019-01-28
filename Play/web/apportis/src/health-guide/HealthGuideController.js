(function(){

  angular
       .module('health-guide')
       .controller('HealthGuideController', [
          'healthGuideService', '$q', '$scope',
          HealthGuideController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @constructor
   */
  function HealthGuideController( healthGuideService, $q, $scope) {
    var self = this;
    // Load all registered users
    healthGuideService
        .load()
        .then( function( papers ) {
            console.log('loaded papers',papers);
            self.papers = papers;
        });
    self.dismiss = function(index) {
        self.papers.splice(index, 1);
    };
    $scope.isHome = false;
    // *********************************
    // Internal methods
    // *********************************

  }

})();
