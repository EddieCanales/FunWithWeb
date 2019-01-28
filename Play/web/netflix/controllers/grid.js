'use strict';

angular.module('netflixMovingTiles.grid',[])

//tileBuilder service: .build() creates a tile object from the next image in its list
//  note: services are shared across scopes, so I can define all of my tile images here
//  even though each "grid" (2 rows that interact with each other) has it's own scope
.factory('tileBuilder', function() {
  var tileQueue =  [
    { img: 'sonic', color: 'ltblue' },
    { img: 'ferb', color: 'orange' },
    { img: 'wildkrats', color: 'green' },
    { img: 'leapfrog', color: 'yellow' },
    { img: 'superwhy', color: 'blue' },
    { img: 'wordgirl', color: 'yellow' },
    { img: 'jake', color: 'blue' },
    { img: 'avengers', color: 'red' },
    { img: 'shrek', color: 'green' },
    { img: 'garfield', color: 'yellow' },
    { img: 'straw', color: 'green' },
    { img: 'woody', color: 'orange' },
    { img: 'george', color: 'yellow' },
    { img: 'rugrats', color: 'ltblue' },
    { img: 'trans', color: 'red' },
    { img: 'tink', color: 'green' },
    { img: 'johnnytest', color: 'orange' },
    { img: 'jack', color: 'red' }
  ];
  return {
    build: function() {
      var tile;
      var config = tileQueue.shift();
      if(config) {
        var tileStyle = {
          'background-image': 'url(img/'+config.img+'.webp)'
        };
        tile = {
          'pos': {}, //pos will be set elsewhere
          'id': tileQueue.length, //hey... a free sequence
          'style': tileStyle,
          'bgColor': config.color
        };
      }
      return tile;
    }
  };
})

.controller('GridCtrl', ['$scope','tileBuilder', function($scope, tileBuilder) {
  //layout: Used to store the grid details (positions of cells mosly).
  //        It's also used to produce the grid DOM in the template.
  var layout = []; //grid structure to produce initial DOM layout
  //tiles: tiles with images used to produce elements in the DOM
  var tiles = [];
  //model: holds references to tiles in the order/pos that they fit into the grid (internal model)
  var model = [];
  //active tile: holds a reference to the currently active tile. Used for being able to act
  //             on the current and previously active tile. Also used to assign the "active"
  //             class in the angular template.
  var activeTile = null;

  //calculates the cell width as a percentage so that it responds
  var calculateCellWidth = function(numColumns) {
    return Math.floor(10000/numColumns)/100;
  };

  //builds initial state of the grid and returns elements needed to build DOM in angular template
  var initGrid = function(numColumns) {
    numColumns = numColumns || 3; //default to 3 (arbitrary)
    var cellWidth = calculateCellWidth(numColumns);
    for(var y=0; y<2; y++) {//each grid contains 2 rows - you can stack as many grids as you'd like
      model[y] = [];
      layout[y] = [];

      //the first row can have n-1 tiles because it holds the active tile,
      //but the second row can only have n-2
      var maxTiles = y ? numColumns - 2 : numColumns - 1;

      for(var x=0; x<numColumns; x++) {
        var tile = x < maxTiles ? tileBuilder.build() : null;
        if(tile != null) {
          tiles.push(tile);
        }
        model[y].push(tile);
        layout[y].push({
          'style': {
            'left': x*cellWidth + '%',
            'top': y*50 +'%',
            'width': cellWidth + '%'
          }
        });
      }
    }
    return {
      layout: layout,
      tiles: tiles
    };
  };

  //filters out padding (empty tiles) from rows
  var filterRows =  function(rows) {
    return _.map(rows, function(row) {return _.filter(row)});
  };

  // Adds the "padding" (empty cells) below and to the right of the active tile.
  // This is how an active tile physically occupies 4 squares. The active tile itself
  // really only occupies one space and is scaled for the visual effect.
  var addPadding = function(rows,active) {
    for(var x in rows[0]) {
      if(rows[0][x] && active && rows[0][x].id === active.id) {
        //right padding
        rows[0].splice(parseInt(x)+1,0,null);
        //bottom padding
        rows[1].splice(x,0,null,null);
        break;
      }
    }
    return rows;
  };

  // This is the fun part. This handles moving around tiles to accomodate the
  // changing active (expanded) tile.
  //   if new active was on bottom row
  //     1. move lastActive down (if it exists)
  //     2. move active up
  //   if new active was on the top
  //     [do nothing - no adjustments needed]
  //   remember: active tiles always occupy the top row
  var adjustRows = function(active, lastActive) {
    var adjusted = model;
    if(active && active.pos.y === 1) { //bottom-row tile activated
      if(lastActive) { // move last active to bottom row
        //add last active to the bottom row (replacing one of the empty cells below it)
        //note: replacing that empty cell makes the work easier when removing the new
        //      active tile from bottom row (last step in this function).
        adjusted[1].splice(lastActive.pos.x,1,lastActive);
        //remove last active from the top row
        adjusted[0].splice(lastActive.pos.x,1);
      }
      //move new active to the top row
      adjusted[0].splice(active.pos.x,0,active);
      //remove new active from the bottom row
      adjusted[1].splice(active.pos.x,1);
    }
    return adjusted;
  };

  //sets the tile's position in the grid data structure and on screen
  // note: won't update the DOM, only the CSS position of the current DOM elements
  var setTilePosition = function(tile, x, y) {
    var cell = layout[y][x];
    if(cell) {
      if(tile) {
        //store x,y for easy manipulation of the grid
        tile.pos.x = x;
        tile.pos.y = y;
        //set the CSS position/size based on the cell
        tile.style.left = cell.style.left;
        tile.style.top  = cell.style.top;
        tile.style.width = cell.style.width;
      }
      model[y][x] = tile;
    }
  };

  //render: set all the new positions of every element on the grid
  var renderTiles = function(rows) {
    //might as well do it in one pass instead of looping first and second row separately
    for(var x in rows[0]) {
      var topTile = rows[0][x] || null;
      var bottomTile = rows[1][x] || null;
      setTilePosition(topTile, x, 0);
      setTilePosition(bottomTile, x, 1);
    }
  };

  //update grid: wraps up the above functions to move the tiles according to new active tile
  var updateGrid = function(tile) {

    var lastActive = activeTile;
    activeTile = tile;

    renderTiles( //update all tiles positions based on changes

      addPadding( //add padding around active tile

        filterRows( //filter out previous padding/empty tiles

          adjustRows( //set position for previous and new active tiles (and any fallout)

            tile, lastActive

          )
        ), tile
      )
    );

    return tile;
  };


  // Our good ol' init function... ng-init ths guy!
  $scope.init = function(numColumns, wait) {
    //initialize the grid
    $scope.grid = initGrid(numColumns);
    //activate the first tile
    $scope.activeTile = updateGrid($scope.grid.tiles[0]);

    // activateTile: Sets a tile to active and updates the grid.
    //  Could be called on hover, click, etc.
    //  Debounced so that tiles don't go flying all over the place as you move across the grid.
    //  You can set the debouce wait in your ng-init call.
    $scope.activateTile = _.debounce(function(tile) {
      //activate this tile
      $scope.activeTile = updateGrid(tile);
      $scope.$apply();
    }, _.isNumber(wait) ? wait : 250); //use isNumber instead of truthy check, in case set to 0
  };

}]);
