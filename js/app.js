$(document).ready(function(){

  var $instructions = $('.instructions');
  var $gameOver = $('.gameOver');

  var $startButton = $('.startButton');
  var $instructionsButton = $('.instructionsButton');
  var $restart = $('.restart');

  var interval;

  var $character = $('.character');
  var $room = $('.room');
  var $door = $('.door');
  var $redDoor = $('.redDoor');

  var $door0 = $('.door0');
  var $door1 = $('.door1');
  var $door2 = $('.door2');
  var $door3 = $('.door3');
  var $door4 = $('.door4');
  var $door5 = $('.door5');
  var $door6 = $('.door6');
  var $door7 = $('.door7');


  // keeps track of how long a red door has been left red for.
  var redDoorTimer = [0, 0, 0, 0, 0, 0, 0, 0];

  var emptyDoors = [0, 1, 2, 3, 4, 5, 6, 7];
  var occupiedDoors = [];

  // calculates where the room edges are
  var roomLeft = $room.offset().left;
  var roomTop = $room.offset().top;
  var roomRight = roomLeft + $room.width();
  var roomBottom = roomTop + $room.height();

  var characterTop = $character.offset().top;
  var characterBottom = characterTop + $character.height();
  var characterLeft = $character.offset().left; // calculate sides of character
  var characterRight = characterLeft + $character.width(); // calculate sides of character


  // keeping score - start
  var score = 0;
  var alive = false;
  var scoreInterval;


  function addScore() {
    //might need a function here to check the variable 'alive'
    if (alive = true) {
      score += 1; // score goes up by 10 points every second
      $('.score')[0].textContent = score;
    }
  }
  // keeping score - end


  // intruder gererator start
  function spawnIntruder(){

    // check red doors start - first check if there is a redDoor already. If so, add 1 to it
    for (var i = 0; i < 8; i++) {
      if (($(`.door${i}`)[0].classList[2] == 'redDoor')) {

        redDoorTimer[i] += 1;

        // >>>End of game condition<<<
        if (redDoorTimer[i] >= 3) { // 2*2000 = 4000 = 4 seconds. If any door is left red for 4 seconds...
          clearInterval(scoreInterval) // ... The score will stop increasing
          clearInterval(intruderInterval) // game stops running
          clearInterval(pressKeys) // disables keys after game
          $gameOver.toggle(); // brings up game over screen
          $('.yourScore')[0].textContent = score;
        }
      }
    }
    // check red doors end

    var randomEmptyDoor = Math.floor(Math.random()*emptyDoors.length); // randomly selects an empty door

    $(`.door${emptyDoors[randomEmptyDoor]}`).toggleClass('redDoor'); // adds the class of that door, hence changing colour
    occupiedDoors.push(emptyDoors[randomEmptyDoor]);

    emptyDoors.splice(randomEmptyDoor, 1); // removes the newly occupied door from the emptyDoors array
  }
  // intruder gererator end


  // pressed a key start
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
        //change direction character is facing
        $character[0].classList.remove(`${$character[0].classList[1]}`); // remove the class of whatever direction you are facing
        $character.addClass('right'); // and add the class of the direction you need to now be facing

        if (characterRight < (roomRight - 2)) { // boundary of the room
          $character.animate({left: "+=2"}, 0);
        }
      }

      // Move left
      if (keySelected == 37) {
        var characterLeft = $character.offset().left;

        //change direction character is facing
        $character[0].classList.remove(`${$character[0].classList[1]}`);
        $character.addClass('left');

        if (characterLeft > roomLeft) {
          $character.animate({left: "-=2"}, 0);
        }
      }

      // Move down
      if (keySelected == 40) {
        var characterTop = $character.offset().top;
        var characterBottom = characterTop + $character.height();

        //change direction character is facing
        $character[0].classList.remove(`${$character[0].classList[1]}`);
        $character.addClass('front');

        if (characterBottom < (roomBottom - 2)) {
          $character.animate({top: "+=2"}, 0);
        }
      }

      // move up
      if (keySelected == 38) {
        var characterTop = $character.offset().top;

        //change direction character is facing
        $character[0].classList.remove(`${$character[0].classList[1]}`);
        $character.addClass('back');

        if (characterTop > roomTop) {
          $character.animate({top: "-=2"}, 0);
        }
      }

      if (keySelected == 32) {
        // if you are in a red square
        for (var i = 0; i < occupiedDoors.length; i++) { // check all redDoors
          // to check if you are in a red box, check that all of the character's sides are inside the boxes' sides
          if ($(`.door${occupiedDoors[i]}`)[0].offsetLeft <= $character[0].offsetLeft &&
          $(`.door${occupiedDoors[i]}`)[0].offsetLeft + 50 >= $character[0].offsetLeft && // 40 is the difference between the width/height of the door hitbox and the width/height of the character
          $(`.door${occupiedDoors[i]}`)[0].offsetTop <= $character[0].offsetTop &&
          $(`.door${occupiedDoors[i]}`)[0].offsetTop + 26 >= $character[0].offsetTop) {

            // remember the door that you are currently at
            var targetDoor = $(`.door${occupiedDoors[i]}`);

            // change door back to green
            targetDoor.removeClass('redDoor');

            redDoorTimer[occupiedDoors[i]] = 0;
            emptyDoors.push(occupiedDoors[i]) // adds door back to emptyDoors array
            occupiedDoors.splice(i,1); // remove this door from occupiedDoors array
          }
        }
      }
    }
  }
  // end pressed a key

  $startButton.click(function(){
    $instructions.toggle();
    scoreInterval = setInterval(addScore, 100);
    intruderInterval = setInterval(spawnIntruder, 1800);
    pressKeys = setInterval(movePerson, 10);
  });

  $restart.click(function() {
    location.reload();
  });

});
