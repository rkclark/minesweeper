$(document).ready(function() {
  calculateSize();
  generateGame();
  if (isTouchDevice()) {
    $("#cover").show("slow");
    $("#messages").empty().append("<p class=\"col-xs-12\">Tap to uncover each square, tap and hold to mark them as mines!</p>");
    $("#messagebutton").empty().text("OK!");
  }
});

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
}

//Autosizes the game based on the window size
function calculateSize() {
  horiz = Math.floor(($(window).width() * 0.8) / 35);
  $("#horizontal").val(horiz);
  vert = Math.floor((($(window).height() - 160) * 0.8) / 35);
  $("#vertical").val(vert);
}

function generateGame() {
  numberOfColumns = $("#horizontal").val();
  numberOfRows = $("#vertical").val();
  mineCount = 0;
  createRows();
  //Use createCells function to populate each .msrow div with a row of cells determined by the value of columns
  $(".msrow").each(createCells);
  //Seed mines in newly created cells
  $(".msrow div").each(seedMines);
  //Post mine Count
  $("#counter").text(mineCount);
  status = "";
}

function createRows() {
    for (var i =1; i <= numberOfRows; i+=1){
    //Create row divs inside the game container div
    $($msrowDiv).addClass("msrow row").appendTo("#game");
  }
}

function createCells(rowNumber) {

  rowNumber += 1; //rowNumber is passed as 0 to 19 but want it to be 1 to 20
  var rowOrder = numberOfRows + 1 -rowNumber; //since the loop traverses the row divs from top to bottom, this gives a Y position value going from high to low rather than low to high
  for (var j=1; j<= numberOfColumns; j+=1) {
    $($columnDiv).addClass("covered cell col-xs").attr("id",j+"_"+rowOrder).appendTo(this); //Adds the cell div with an ID based on grid position X_Y
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
  status = "lost";
  $(".notmine.marked").removeClass("marked").addClass("uncovered");
  $(".mine").removeClass("marked").addClass("detonated").empty().append("<img class=\"img-fluid\" src=\"../img/mine.svg\">");
  //$("#cover").toggleClass("hidden-xs-up");
  $("#cover").show("slow");
  $("#messages").empty().append("<p class=\"col-xs-12\">Detonation!</p><p class=\"col-xs-12\">I'm afraid you've lost.</p>");
  $("#messagebutton").empty().text("Bummer!");
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
    $(this).removeClass("covered").addClass("uncovered").append( "<div class=\"cell-text-wrapper\"><p class=\"cell-text\">"+mineProximity+"</p></div>" );
  }
}

function coveredClick() {
  if (status != "") {
    //do nothing, game is either won or lost
  } else {
    //Evaluate if mine and end game if yes, otherwise, uncover cells
    if ($(this).hasClass("mine")) {
      gameOver();
    } else {
      if ($(this).hasClass("marked")) {
        removeMark($(this));
      }
      uncoverCells.call(this);
      if ($(".notmine.covered").length) {
        //stil got covered mines - do nothing
      } else {
        //game is won
        console.log("status is "+status)
        console.log("GAMEWON");
        if (status == "") {
          gameWon();
        }
      }
    }
  }
}

function coveredRightClick(e) {
  if(e.which == 3) //3 is the which type for right click
  {
    if (status != "") {
      //do nothing - game is in win or lose state
    } else {
      if ($(this).hasClass("marked")) {
        removeMark($(this));
      } else {
        $(this).addClass("marked").append("<img class=\"img-fluid\" src=\"../img/mine.svg\">");
        mineCount -= 1;
        $("#counter").text(mineCount);
      }
    }
  }
}

function coveredTaphold() {
    if (status != "") {
      //do nothing - game is in win or lose state
    } else {
      if ($(this).hasClass("marked")) {
        removeMark($(this));
      } else {
        $(this).addClass("marked").append("<img class=\"img-fluid\" src=\"../img/mine.svg\">");
        mineCount -= 1;
        $("#counter").text(mineCount);
      }
    }
}

function removeMark(thisObj) {
  thisObj.removeClass("marked").empty();
  mineCount += 1;
  $("#counter").text(mineCount);
}

function gameWon() {
  status = "won";
  //Inform user they have won
  //$("#cover").toggleClass("hidden-xs-up").fadeIn("slow");
  $("#cover").show("slow");
  $("#messages").empty().append("<p class=\"col-xs-12\">You won!</p><p class=\"col-xs-12\">Your awesomeness is confirmed.</p>");
  $("#messagebutton").empty().text("Hooray!");
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

$("#game").on("taphold",".covered",coveredTaphold);

//Stop right click on covered cell opening right click menu
$("#game").on("contextmenu",".covered",function(e) {
  e.preventDefault();
  }
);

$("#game").on("contextmenu",function(e) {
  e.preventDefault();
  }
);

//Allow user to reset by clicking the reset or generate buttons

$("#reset").click(function(e) {
  e.preventDefault();
  resetGame();
});

$("#generate").click(function(e) {
  e.preventDefault();
  resetGame();
  $("#settings-icon").click();
});

$("#autosize").click(function(e) {
  e.preventDefault();
  calculateSize();
});

$("#messagebutton").click(function(e) {
  e.preventDefault();
  $("#cover").hide("slow");
});

//Spin settings
$("#settings-icon").click(function(){
  $(this).toggleClass("rotate");
  $("#settingscontainer").toggleClass("fade-out").toggleClass("slide-out");
});
