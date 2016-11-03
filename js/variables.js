
//Set initial variables
var numberOfColumns = 20;
var numberOfRows = 20;
var $msrowDiv = "<div>&nbsp;</div>";
var $columnDiv = "<div>&nbsp;</div>";
var minesPercentage = 0.15;
var mineCount = "";

//Update variables on events

//Update number of rows global variable
function rowUpdate() {
  numberOfRows = $(this).val();
}

//Update number of columns global variable
function columnUpdate() {
  numberOfColumns = $(this).val();
}

//Update difficulty setting global variable
function difficultyUpdate() {
  minesPercentage = $("input:radio[name=difficulty]:checked").val();
  console.log(minesPercentage);
}

$("#vertical").keyup(rowUpdate).change(rowUpdate);

$("#horizontal").keyup(columnUpdate).change(columnUpdate);

$("input:radio[name=difficulty]").change(difficultyUpdate);
