$(document).ready(function(){

  var interval;

  var $character = $('#character');
  var $room = $('#room');

  // work out where the room edges are
  var roomLeft = $room.offset().left;
  var roomTop = $room.offset().top;
  var roomRight = roomLeft + $room.width();
  var roomBottom = roomTop + $room.height();


  setInterval(movePerson,20);
  var keys = {};

  // When a key is pushed down, it is added to the 'keys' object
  $(document).keydown(function(e){
    keys[e.keyCode] = true;
  })

  // When a key is lifted up, that key is removed from the keys array
  $(document).keyup(function(e){
    delete keys[e.keyCode];
  })

  function movePerson(){
    for (var direction in keys) {
      if (!keys.hasOwnProperty(direction)) continue; // check if key exists

      // Move right
      if (direction == 39) { // if key exists, and is loosely equal to 39
        var characterLeft = $character.offset().left; // calculate sides of character
        var characterRight = characterLeft + $character.width(); // calculate sides of character
        if (characterRight < roomRight) { // boundary of the room
          $character.animate({left: "+=5"}, 1);
        }
      }

      // Move left
      if (direction == 37) {
        var characterLeft = $character.offset().left;
        if (characterLeft > roomLeft) {
          $character.animate({left: "-=5"}, 1);
        }
      }

      // Move down
      if (direction == 40) {
        var characterTop = $character.offset().top;
        var characterBottom = characterTop + $character.height();
        if (characterBottom < roomBottom) {
          $character.animate({top: "+=5"}, 1);
        }
      }

      // move up
      if (direction == 38) {
        var characterTop = $character.offset().top;
        if (characterTop > roomTop) {
          $character.animate({top: "-=5"}, 1);
        }
      }
    }
  }
});
