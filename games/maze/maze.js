var start_flag = 0; //confirm whether hover the start_block
var end_flag = 0;   //confirm whether hover the end_block
var crack_flag = 0; //confirm whether hover the wall_block
var cheat_flag = 0; //confirm whether get out of the maze when the game has began

window.onload = function() {
  addListener();
}

function addListener() {
  var wall = document.getElementsByClassName("wall");
  var start = document.getElementById("start");
  var end = document.getElementById("end");
  var test = document.getElementById("test");
  var maze = document.getElementById("maze");

  start.addEventListener('mouseover', game_start);
  start.addEventListener('mouseout', clear_alert);

  end.addEventListener('mouseover', game_end);
  test.addEventListener('mouseover', test_cheat);

  maze.addEventListener('mouseleave', wall_reset);

  for (var i = 0; i < 5; i++) {
    wall[i].addEventListener('mouseover', test_crack);
  }
}

function test_cheat(event) {
  cheat_flag = 1;
}

function game_start(event) {
  if (start_flag == 0) {
    wall_reset();
    end_flag = 0;
    cheat_flag = 0
    crack_flag = 0;
    start_flag = 1;
    document.getElementById("result").textContent = "Game start!";
    document.getElementById("result").className = "result";
    document.getElementById("status").textContent = "Status: Playing";
  }
  else if (start_flag == 1) {
    wall_reset();
    crack_flag = 0;
    end_flag = 0;
    cheat_flag = 0;
    document.getElementById("result").className = "shade";
    document.getElementById("status").textContent = "Status: Playing";
  }
}

function clear_alert(event) {
  if (start_flag == 1) {
    document.getElementById("result").className = "shade";
  }
}

function game_end(event) {
  if (start_flag == 1 && cheat_flag == 0 && crack_flag == 0) {
    document.getElementById("result").textContent = "You Win!";
    document.getElementById("result").className = "result";
    document.getElementById("status").textContent = "Status: Free";
    start_flag = 0;
  }
  else if (start_flag == 0 && crack_flag == 0) {
    document.getElementById("result").textContent = "Don't cheat, you are not started from the 'S'.";
    document.getElementById("result").className = "result";
    document.getElementById("status").textContent = "Status: Cheated";
    cheat_flag = 1;
  }
  else if (start_flag == 1 && cheat_flag == 1 && crack_flag == 0) {
    document.getElementById("result").textContent = "Don't cheat, you should start from the 'S' move to the 'E' inside the maze!";
    document.getElementById("result").className = "result";
    document.getElementById("status").textContent = "Status: Cheated";
    cheat_flag = 1;
  }
  end_flag = 1;
}

function test_crack(event) {
  if (start_flag == 1 && end_flag == 0) {
    crack_flag = 1;
    event.target.className = "crack-wall";
    document.getElementById("result").textContent = "You Lose! Please back to the 'S' to start again.";
    document.getElementById("result").className = "result";
    document.getElementById("status").textContent = "Status: Lose";
    start_flag = 0;
    end_flag = 1;
  }
}

function wall_reset(event) {
  var wall = document.getElementsByClassName("crack-wall");
  for (var i = 0; i < wall.length; i++){
    wall[i].className = "wall";
  }
}