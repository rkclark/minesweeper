$(document).ready(calculateSize());

function calculateSize() {
  horiz = Math.floor(($(window).width() * 0.8) / 40);
  $("#horizontal").val(horiz);
  vert = Math.floor((($(window).height() - 200) * 0.8) / 40);
  $("#vertical").val(vert);
  console.log("horiz is "+horiz+" and vert is "+vert)
}
