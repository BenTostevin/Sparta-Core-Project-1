$(document).ready(function(){

  var interval;

  var $character = $('#character');
  var $room = $('#room');
  var $door = $('.door');
  var $redDoor = $('.redDoor');

  // calculates where the room edges are
  var roomLeft = $room.offset().left;
  var roomTop = $room.offset().top;
  var roomRight = roomLeft + $room.width();
  var roomBottom = roomTop + $room.height();



  // intruder gererator start
  var emptyDoors = [0, 1, 2, 3, 4, 5, 6, 7];
  var occupiedDoors = [];

  setInterval(spawnIntruder, 5000);

  function spawnIntruder(){

    var randomEmptyDoor = Math.floor(Math.random()*emptyDoors.length); // randomly selects an empty door

    $(`#door${emptyDoors[randomEmptyDoor]}`).toggleClass('redDoor'); // adds the class of that door, hence changing colour
    occupiedDoors.push(emptyDoors[randomEmptyDoor]);
    emptyDoors.splice(randomEmptyDoor, 1); // removes the newly occupied door from the emptyDoors array
  }
  // intruder gererator end



  // pressed a key start
  setInterval(movePerson, 20);
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
    for (var keySelected in keys) {
      if (!keys.hasOwnProperty(keySelected)) continue; // check if key exists

      // Move right
      if (keySelected == 39) { // if key exists, and is loosely equal to 39
        var characterLeft = $character.offset().left; // calculate sides of character
        var characterRight = characterLeft + $character.width(); // calculate sides of character
        if (characterRight < roomRight) { // boundary of the room
          $character.animate({left: "+=5"}, 1);
        }
      }

      // Move left
      if (keySelected == 37) {
        var characterLeft = $character.offset().left;
        if (characterLeft > roomLeft) {
          $character.animate({left: "-=5"}, 1);
        }
      }

      // Move down
      if (keySelected == 40) {
        var characterTop = $character.offset().top;
        var characterBottom = characterTop + $character.height();
        if (characterBottom < roomBottom) {
          $character.animate({top: "+=5"}, 1);
        }
      }

      // move up
      if (keySelected == 38) {
        var characterTop = $character.offset().top;
        if (characterTop > roomTop) {
          $character.animate({top: "-=5"}, 1);
        }
      }

      if (keySelected == 32) {
        // if you are in a red square
        for (var i = 0; i < occupiedDoors.length; i++) { // check all redDoors
          // to check if you are in a red box, check that all of the character's sides are inside the boxes' sides
          if ($(`#door${occupiedDoors[i]}`)[0].offsetLeft < $character[0].offsetLeft &&
              $(`#door${occupiedDoors[i]}`)[0].offsetLeft + 40 > $character[0].offsetLeft && // 40 is the difference between the width/height of the door hitbox and the width/height of the character
              $(`#door${occupiedDoors[i]}`)[0].offsetTop < $character[0].offsetTop &&
              $(`#door${occupiedDoors[i]}`)[0].offsetTop + 40 > $character[0].offsetTop) {

            // remember the door that you are currently at
            var targetDoor = $(`#door${occupiedDoors[i]}`);

            // change door back to green
            setInterval(protectDoor, 3000);
            function protectDoor() {
              targetDoor.removeClass('redDoor');
            }

          }
        }
      }
    }
  }
  // end pressed a key
});
