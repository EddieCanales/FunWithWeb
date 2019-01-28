(function(){

  angular
       .module('nav')
       .controller('NavController', [
          '$mdSidenav', '$mdBottomSheet', '$q',
          NavController
       ]);

  /**
   * Nav Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdBottomSheet
   * @param $q
   * @constructor
   */
  function NavController( $mdSidenav, $mdBottomSheet, $q ) {
    var self = this;

    self.toggleLeftNav = toggleLeftNav;

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleLeftNav() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

  }

})();
