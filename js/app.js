$(document).ready(function(){

  var $instructions = $('.instructions');
  var $gameOver = $('.gameOver');

  var $startButton = $('#startButton');
  var $instructionsButton = $('#instructionsButton');
  var $restart = $('#restart');

  var interval;

  var $character = $('.character');
  var $room = $('#room');
  var $door = $('.door');
  var $redDoor = $('.redDoor');

  // keeps track of how long a red door has been left red for.
  var redDoorTimer = [0, 0, 0, 0, 0, 0, 0, 0];

  var emptyDoors = [0, 1, 2, 3, 4, 5, 6, 7];
  var occupiedDoors = [];

  // calculates where the room edges are
  var roomLeft = $room.offset().left;
  var roomTop = $room.offset().top;
  var roomRight = roomLeft + $room.width();
  var roomBottom = roomTop + $room.height();


  // keeping score - start
  var score = 0;
  var time = 0;
  var alive = false;
  var scoreInterval;


  function addScore() {
    //might need a function here to check the variable 'alive'
    if (alive = true) {
      score++; // score goes up by 10 points every second
      $('#score')[0].textContent = score;

      if (score % 10 === 0) { // every second
        time++;
        $('#timer')[0].textContent = time;

        // add red door timer here
        // for (var i = 0; i < 8; i++) {
        //   console.log($('#door'));
        // }
      }
    }
  }
  // keeping score - end


  // intruder gererator start
  function spawnIntruder(){

    // check red doors start - first check if there is a redDoor already. If so, add 1 to it
    for (var i = 0; i < 8; i++) {
      if (($(`#door${i}`)[0].classList[1] == 'redDoor')) {
        redDoorTimer[i] += 1;

        // >>>End of game condition<<<
        if (redDoorTimer[i] >= 3) { // 2*2000 = 4000 = 4 seconds. If any door is left red for 4 seconds...
          clearInterval(scoreInterval) // ... The score will stop increasing
          clearInterval(intruderInterval) // game stops running
          clearInterval(pressKeys) // disables keys after game
          $gameOver.toggle(); // brings up game over screen
          $('#yourScore')[0].textContent = score;
        }
      }
    }
    // check red doors end

    var randomEmptyDoor = Math.floor(Math.random()*emptyDoors.length); // randomly selects an empty door

    $(`#door${emptyDoors[randomEmptyDoor]}`).toggleClass('redDoor'); // adds the class of that door, hence changing colour
    $(`#door${emptyDoors[randomEmptyDoor]}`)[0].textContent = 4;

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

      var tempArr = [];
      $(document).keypress(function(e){
        if (e.keyCode == 32) {
          tempArr.push(e.keyCode);
        }
        if (tempArr.length > 3000) {
          console.log('fixed');
        }
      })

      if (keySelected == 32) {
        // if you are in a red square
        for (var i = 0; i < occupiedDoors.length; i++) { // check all redDoors
          // to check if you are in a red box, check that all of the character's sides are inside the boxes' sides
          if ($(`#door${occupiedDoors[i]}`)[0].offsetLeft < $character[0].offsetLeft &&
          $(`#door${occupiedDoors[i]}`)[0].offsetLeft + 48 > $character[0].offsetLeft && // 40 is the difference between the width/height of the door hitbox and the width/height of the character
          $(`#door${occupiedDoors[i]}`)[0].offsetTop < $character[0].offsetTop &&
          $(`#door${occupiedDoors[i]}`)[0].offsetTop + 32 > $character[0].offsetTop) {

            // remember the door that you are currently at
            var targetDoor = $(`#door${occupiedDoors[i]}`);

            // change door back to green
            targetDoor.removeClass('redDoor');

            // remove red door timer
            targetDoor[0].textContent = "";

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
    pressKeys = setInterval(movePerson, 20);
  });

  $restart.click(function() {
    console.log('working');
    location.reload();
  });

});
