var status = 0;
var score = 0;
var timer;

window.onload = function() {
  create_hole();
  document.getElementById("control").onclick = start_stop;
  hole = document.getElementsByClassName("hole");
}

function create_hole() {
  var hole_field = document.getElementById("hole-field");
  for (var row = 0; row < 6; row++) {
    for (var col = 0; col < 10; col++) {
      var hole = document.createElement("div");
      hole.className = "hole";
      hole.addEventListener("click", hole_click);
      hole_field.appendChild(hole);
    }
  }
}

function start_stop() {
  if (status == 0) {
    status = 1;
    score = 0;
    time = 31;
    document.getElementById("score").value = score;
    document.getElementById("time").value = time;
    document.getElementById("status").value = "Playing";
    count_time();
    random_mole();
  }
  else {
    game_end();
  }
}

var time = 31;
function count_time() {
  time--;
  document.getElementById("time").value = time;
  timer = setTimeout(count_time, 1000);
  if (time == 0) {
    game_end();
  }
}

function game_end() {
  clearTimeout(timer);
  var using_time = 30 - document.getElementById("time").value;
  alert("Game Over.\nUsing time: " + using_time + " seconds.\nYour score is: " + document.getElementById("score").value);
  status = 0;
  time = 30;
  score = 0;
  hole[pos].id = "mole_click";
  document.getElementById("score").value = score;
  document.getElementById("time").value = time;
  document.getElementById("status").value = "Game over";
}

function random_mole() {
  if (time != 0) {
    pos = Math.round(Math.random()*59);
    hole[pos].id = "mole";
  }
}

function hole_click(event) {
  if (time != 0 && status == 1) {
    if (event.target.id == "mole") {
      score++;
      event.target.id = "mole_click";
      random_mole();
    }
    else {
      if(score != 0) {
        score--;
      }
    }
    document.getElementById("score").value = score;
  }
}