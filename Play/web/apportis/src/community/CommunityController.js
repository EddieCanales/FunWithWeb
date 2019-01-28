(function(){

  angular
       .module('community')
       .controller('CommunityController', [
          '$scope',
          '$timeout',
          CommunityController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @constructor
   */
  function CommunityController($scope, $timeout) {
    var self = this;
    // Load all registered users
    self.events = [
        {
            date: new Date('10/3/2015'),
            title: 'Cooking to Support Type II Diabetes',
            location: {
                name: 'Giant Eagle Market District'
            },
            attending: true
        }
    ];
    self.friends = [
        {
            name: 'Steven Jones',
            avatar: 'https://www.springcm.com/sites/default/files/executive_team/sjones_100.png'
        },
        {
            name: 'Julie Newberg',
            avatar: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/2/005/073/26f/2b7b16b.jpg'
        },
        {
            name: 'William Shaw',
            avatar: 'https://api.curtisbrown.co.uk/media/30708/show/square'
        }
    ];
    self.groups = [
        {
            name: 'Hypertension'
        },
        {
            name: 'Type II Diabetes'
        },
        {
            name: 'Lose Weight'
        },
        {
            name: 'Exercise'
        },
        {
            name: 'Reduce Stress'
        }
    ];

    $timeout(function() {
        self.size = {
            height: angular.element('#content').height() - angular.element('#community-toolbar').height()
        };
    });

    $scope.isHome = false;
    // *********************************
    // Internal methods
    // *********************************

  }

})();
