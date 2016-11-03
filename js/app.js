
//Generate game
$(document).ready(generateGame());

function generateGame() {
  mineCount = 0;
  createRows();
  //Use createCells function to populate each .msrow div with a row of cells determined by the value of columns
  $(".msrow").each(createCells);
  //Seed mines in newly created cells
  $(".msrow div").each(seedMines);
  //Post mine Count
  $("#counter span").text(mineCount);
  // generateMineCount();
}

function createRows() {

    for (var i =1; i <= numberOfRows; i+=1){
    //Create row divs inside the game container div
    $($msrowDiv).addClass("msrow").appendTo("#game");
  }
}

function createCells(rowNumber) {

  rowNumber += 1; //rowNumber is passed as 0 to 19 but want it to be 1 to 20
  var rowOrder = numberOfRows + 1 -rowNumber; //since the loop traverses the row divs from top to bottom, this gives a Y position value going from high to low rather than low to high
  for (var j=1; j<= numberOfColumns; j+=1) {
    $($columnDiv).addClass("covered cell").attr("id",j+"_"+rowOrder).appendTo(this); //Adds the cell div with an ID based on grid position X_Y
  }
}

function seedMines() {
  var seedNumber = Math.random();
  if(seedNumber < minesPercentage) {
    $(this).addClass("mine");
    mineCount += 1;
  } else {
    $(this).addClass("notmine");
  }
}

function getMineProximity(neighbourIds) {
  //Start off with a mine proximity value of 0
  var mineProximity = 0;
  // Select each neighbour from the array
  for (var w = 0; w < neighbourIds.length; w+=1) {
    var id = neighbourIds[w];
    //Evaluate whether neighbour is a mine, and if so, add one to the mine proximity
    if ($("#" + id).hasClass("mine")) {
      mineProximity += 1;
      }
    }
  return mineProximity;
}

function getNeighbourIds(inputId) {
  //Split out the x and y values and change them to integers to use in calculations below
  var x = parseInt(inputId[0]);
  var y = parseInt(inputId[1]);
  //Create array with each of the target cell's neighbours, for each one declare its x and y location in the grid
  var neighbourLocations = [
    {name: "topLeftNeighbour", xlocation: x-1, ylocation: y+1},
    {name: "topMiddleNeighbour", xlocation: x, ylocation: y+1},
    {name: "topRightNeighbour", xlocation: x+1, ylocation: y+1},
    {name: "leftNeighbour", xlocation: x-1, ylocation: y},
    {name: "rightNeighbour", xlocation: x+1, ylocation: y},
    {name: "bottomLeftNeighbour", xlocation: x-1, ylocation: y-1},
    {name: "bottomMiddleNeighbour", xlocation: x, ylocation: y-1},
    {name: "bottomRightNeighbour", xlocation: x+1, ylocation: y-1}
  ];
  //Convert locations into array of id strings
  var neighbourIds = [];
  for (var i = 0; i < neighbourLocations.length; i+=1) {
      var id = neighbourLocations[i].xlocation + "_" + neighbourLocations[i].ylocation;
      neighbourIds.push(id);
  }
  return neighbourIds;
}

function gameOver() {
  $(".mine").removeClass("marked").addClass("detonated");
  $("#msgbox").text("Detonation! You have lost. Press Reset to try again.");
}

function uncoverCells() {
  //Get IDs of neighbouring cells
  var cellId = $(this).attr("id");
  var idArray = cellId.split("_");
  var neighbourIds= getNeighbourIds(idArray);
  //Get the mine proximity value
  var mineProximity = getMineProximity.call(this, neighbourIds);
  //If no mines surrounding target, uncover target plus trigger click on neighbours, otherwise just uncover target and add mine proximity text to cell
  if (mineProximity === 0) {
    $(this).removeClass("covered").addClass("uncovered");
    //Cycle through neighbours
    for (var w = 0; w < neighbourIds.length; w+=1) {
      var id = neighbourIds[w];
        if ($("#" + id).hasClass("covered")) {
          //If neighbour is covered, trigger a click to run the coveredClick process on the neighbour
          $(("#" + id)).trigger("click");
        }
      }
  } else {
    //Our mine proximity is not 0 so we uncover the target cell and add the mine proximity as text
    $(this).removeClass("covered").addClass("uncovered").text(mineProximity);
  }
}

function coveredClick() {
  //Evaluate if mine and end game if yes, otherwise, uncover cells
  if ($(this).hasClass("mine")) {
    gameOver();
  } else {
    uncoverCells.call(this);
    if ($(".notmine.covered").length) {
      //stil got covered mines - do nothing
    } else {
      //game is won
      console.log("GAMEWON");
      gameWon();
    }
  }
}

function coveredRightClick(e) {
  if(e.which == 3) //3 is the which type for right click
  {
      if ($(this).hasClass("marked")) {
        $(this).removeClass("marked");
        mineCount += 1;
        $("#counter span").text(mineCount)
      } else {
        $(this).addClass("marked");
        mineCount -= 1;
        $("#counter span").text(mineCount)
      }
  }
}

function gameWon() {
  //Inform user they have won
  $("#msgbox").text("Congratulations! Your awesomeness is confirmed. You win!");
  //Change mines from marked to being revealed
  $(".mine").removeClass("marked").addClass("revealed");
}

function resetGame() {
  $(".msrow").each(function() {
    $(this).remove();
  }
);
  $("#msgbox").text("");
  generateGame();
}


$("#game").on("click",".covered",coveredClick);

$("#game").on("mousedown",".covered",coveredRightClick);

//Stop right click on covered cell opening right click menu
$("#game").on("contextmenu",".covered",function(e) {
  e.preventDefault();
  }
);

//Allow user to reset by clicking the reset or generate buttons

$("#reset, #generate").click(function(e) {
  e.preventDefault();
  resetGame();
});
