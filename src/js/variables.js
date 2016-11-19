
//Set initial variables
var numberOfColumns = 0;
var numberOfRows = 0;
var $msrowDiv = "<div></div>";
var $columnDiv = "<div></div>";
var minesPercentage = 0.15;
var mineCount = 0;
var status = "";

//Update difficulty setting global variable
function difficultyUpdate() {
  minesPercentage = $("input:radio[name=difficulty]:checked").val();
}

$("input:radio[name=difficulty]").change(difficultyUpdate);
