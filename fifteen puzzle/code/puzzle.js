var start_flag = 0;
var stop_flag = 0;
var change = 0;
var size = 4;
var easy_best = 0;
var middle_best = 0;
var hard_best = 0;
var mode = 0;
window.onload = function() {
  create_puzzle();
  $("#start").click(game_start);
  $("#stop").click(game_stop);
  $("#change").click(change_picture);
  $("#recover").click(recover);
  $("#three").click(select);
  $("#four").click(select);
  $("#five").click(select);
  $("#mode").click(select_mode);
}

var time_m;

function select_mode() {
  if (start_flag == 0) {
    mode = (mode + 1) % 3;
    if (mode == 0) {
      $("#mode").text("free");
    }
    else if (mode == 1) {
      $("#mode").text("limit");
    }
    else if (mode == 2) {
      $("#mode").text("rapid");
    }
  }
  else $("#result").text("Can't change the mole when playing");
}

function change_mode() {
  if (mode == 1) {
    if (size == 3) time_m = 41;
    else if (size == 4) time_m = 201;
    else if (size == 5) time_m = 401;
  }
  else if (mode == 2) {
    if (size == 3) time_m = 21;
    else if (size == 4) time_m = 101;
    else if (size == 5) time_m = 201;
  }
}

function minus_time() {
  time_m--;
  timer_m = setTimeout(minus_time, 1000);
  $("#result").text("Gaming -- reserve time: " + time_m + " s");
  $("#time").text(time_m + " s");
  if (time_m == 0 || check_finish()) {
    clearTimeout(timer_m);
  }
  if(time_m == 0 && !check_finish()) {
    $("#result").text("You Lose!");
    $("#time").text("Time");
    start_flag = 0;
  }
}

function select(event) {
  recover();
  change_mode();
  if (event.target.id == "three") {
    size = 3;
  }
  else if (event.target.id == "four") {
    size = 4;
  }
  else if (event.target.id == "five") {
    size = 5;
  }
  create_puzzle();
}

function create_puzzle() {
  $("#puzzle").empty();
  var _puzzle = document.getElementById("puzzle");
  for (var index = 1; index <= size * size; index++) {
    var _part = document.createElement("div");
    _part.id = "partsize" + size + '-'+ index;
    _part.className = "partsize"+ size +"-picture" + change + " partsize"+size+"-position" + index;
    _part.addEventListener('click', move);
    _puzzle.appendChild(_part);
  }
}

var time = -1;
function count_time() {
  time++;
  timer = setTimeout(count_time, 1000);
  $("#result").text("Gaming -- using time: " + time + " s");
  $("#time").text(time + " s");
}

function game_start(event) {
  if (start_flag == 0) {
    start_flag = 1;
    reset();
    random_puzzle();
    change_mode();
    $("#start").text("Restart");
    if (mode == 0) count_time();
    else minus_time();
  }
  else if (start_flag == 1) {
    reset();
    random_puzzle();
    change_mode();
    if (mode == 0) {
      clearTimeout(timer);
      count_time();
    }
    else {
      clearTimeout(timer_m);
      minus_time();
    }
  }
}

function game_stop(event) {
  if (stop_flag == 0 && start_flag == 1) {
    stop_flag = 1;
    if (mode == 0) clearTimeout(timer);
    else clearTimeout(timer_m);
    $("#stop").text("Continue");
    if (mode == 0) $("#result").text("Stopping -- using time: " + time + " s");
    else $("#result").text("Stopping -- reserve time: " + time_m + " s");
  }
  else if (stop_flag == 1) {
    time--;
    stop_flag = 0;
    if (mode == 0) count_time();
    else minus_time();
    $("#stop").text("Stop");
  }
}

function reset(){
  $("#result").text("");
  $("#stop").text("Stop");
  for (var index = 1; index <= size*size; index++) {
    document.getElementById("partsize"+size+'-'+index).className = "partsize"+size+"-picture"+change+" partsize"+size+"-position"+index;
  }
  stop_flag = 0;
  time = -1;
  $("#time").text("Time");
}

function recover() {
  reset();
  if (start_flag == 1) {
    if (mode == 0) clearTimeout(timer);
    else clearTimeout(timer_m);
    start_flag = 0;
    $("#start").text("Start");
    $("time").text("Time");
  }
}

function change_picture() {
  recover();
  change = (change + 1) % 5;
  if (change == 0) {
    $('.show-picture4').addClass("show-picture0");
    $('.partsize'+size+'-picture4').addClass("partsize"+size+"-picture0");
    $('.show-picture4').removeClass("show-picture4");
    $('.partsize'+size+'-picture4').removeClass("partsize"+size+"-picture4");
  }
  else if (change == 1) {
    $('.show-picture0').addClass("show-picture1");
    $('.partsize'+size+'-picture0').addClass("partsize"+size+"-picture1");
    $('.show-picture0').removeClass("show-picture0");
    $('.partsize'+size+'-picture0').removeClass("partsize"+size+"-picture0");
  }
  else if (change == 2) {
    $('.show-picture1').addClass("show-picture2");
    $('.partsize'+size+'-picture1').addClass("partsize"+size+"-picture2");
    $('.show-picture1').removeClass("show-picture1");
    $('.partsize'+size+'-picture1').removeClass("partsize"+size+"-picture1");
  }
  else if (change == 3) {
    $('.show-picture2').addClass("show-picture3");
    $('.partsize'+size+'-picture2').addClass("partsize"+size+"-picture3");
    $('.show-picture2').removeClass("show-picture2");
    $('.partsize'+size+'-picture2').removeClass("partsize"+size+"-picture2");
  }
  else if (change == 4) {
    $('.show-picture3').addClass("show-picture4");
    $('.partsize'+size+'-picture3').addClass("partsize"+size+"-picture4");
    $('.show-picture3').removeClass("show-picture3");
    $('.partsize'+size+'-picture3').removeClass("partsize"+size+"-picture3");
  }
}

function random_puzzle() {
  random_arr = [];
  for (var i = 0; i < size*size - 1; i++) {
    random_arr[i] = i + 1;
  }
  while(1) {
    random_arr.sort(random_num);
    if (check_random_isValid()) {
      break;
    }
  }
  var part = document.getElementById("puzzle").childNodes;
  for (var i = 0; i < size*size - 1; i++) {
    part[i].className = "partsize"+size+"-picture" + change + " partsize"+size+"-position" + random_arr[i];
  }
}

function random_num (){
  return 0.5-Math.random();
}

function check_random_isValid() {
  var count = 0;
  for (var i = 0; i < size*size; i++) {
    for (var j = i + 1; j < size*size; j++) {
        if (random_arr[j] < random_arr[i]) {
        count++;
      }
    }
  }
  return count%2===0;
}

function move(event) {
  if (start_flag == 1 && stop_flag != 1) {
    var blank = document.getElementById("partsize"+size+'-'+ size*size);
    if (((Math.abs(blank.offsetTop - this.offsetTop) == 116 && (blank.offsetLeft == this.offsetLeft) ||
        Math.abs(blank.offsetLeft - this.offsetLeft) == 116 && (blank.offsetTop == this.offsetTop)) && size == 3) ||
        ((Math.abs(blank.offsetTop - this.offsetTop) == 87 && (blank.offsetLeft == this.offsetLeft) ||
        Math.abs(blank.offsetLeft - this.offsetLeft) == 87 && (blank.offsetTop == this.offsetTop)) && size == 4) ||
        ((Math.abs(blank.offsetTop - this.offsetTop) == 70 && (blank.offsetLeft == this.offsetLeft) ||
        Math.abs(blank.offsetLeft - this.offsetLeft) == 70 && (blank.offsetTop == this.offsetTop)) && size == 5)){
      var blank_pic = blank.className;
      blank.className = this.className;
      this.className = blank_pic;
      check_finish();
    }
  }
}

function check_finish() {
  for (var index = 1; index <= size*size ; index++) {
    var pos =  document.getElementById("partsize"+size+'-'+ index);
    if (pos.className != "partsize"+size+"-picture" + change + " partsize"+size+"-position" + index) {
      return false;
    }
  }
  if (mode == 0) {
    $("#result").text("You Win! -- using time: " + time + " s");
    clearTimeout(timer);
    if (size == 3) {
      if (easy_best == 0 || easy_best != 0 && time < easy_best) 
        easy_best = time;
      $("#easy-history").text("easy: " + time + " s");
    }
    else if (size == 4) {
      if (middle_best == 0 || middle_best != 0 && time < middle_best)
        middle_best = time;
      $("#middle-history").text("middle: " + time + " s");
    }
    else if (size == 5) {
      if (hard_best == 0 || hard_best != 0 && time < hard_best)
        hard_best = time;
      $("#hardhistory").text("hard: " + time + " s");
    }
  }
  else {
    var max_time;
    if (mode == 1) {
      if (size == 3) max_time = 40;
      else if (size == 4) max_time = 200;
      else if (size == 5) max_time = 400;
    }
    else if (mode == 2) {
      if (size == 3) max_time = 20;
      else if (size == 4) max_time = 100;
      else if (size == 5) max_time = 250;
    }
    $("#result").text("You Win! -- reserve time: " + (max_time - time_m) + " s");
    if (size == 3) {
      if (easy_best == 0 || easy_best != 0 && (max_time - time_m) < easy_best) 
        easy_best = (max_time - time_m);
      $("#easy-history").text("easy: " + (max_time - time_m) + " s");
    }
    else if (size == 4) {
      if (middle_best == 0 || middle_best != 0 && (max_time - time_m) < middle_best)
        middle_best = (max_time - time_m);
      $("#middle-history").text("middle: " + (max_time - time_m) + " s");
    }
    else if (size == 5) {
      if (hard_best == 0 || hard_best != 0 && (max_time - time_m) < hard_best)
        hard_best = (max_time - time_m);
      $("#hardhistory").text("hard: " + (max_time - time_m) + " s");
    }
  }
  $("#start").text("Start Game");
  start_flag = 0;
  return true;
}