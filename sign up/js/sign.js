var name_input_flag = 0;
var id_input_flag = 0;
var phone_input_flag = 0;
var mail_input_flag = 0;

//定义画布宽高和生成点的个数
var WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 35;
var canvas;
var context;
function handler() {
  canvas = document.getElementById('canvas');
  canvas.width = WIDTH,
  canvas.height = HEIGHT;
  context = canvas.getContext('2d');
  context.strokeStyle = 'rgba(0,0,0,0.02)',
  context.strokeWidth = 1,
  context.fillStyle = 'rgba(0,0,0,0.05)';
  var circleArr = [];
}

//线条：开始xy坐标，结束xy坐标，线条透明度
function Line (x, y, _x, _y, o) {
  this.beginX = x,
  this.beginY = y,
  this.closeX = _x,
  this.closeY = _y,
  this.o = o;
}

//点：圆心xy坐标，半径，每帧移动xy的距离
function Circle (x, y, r, moveX, moveY) {
  this.x = x,
  this.y = y,
  this.r = r,
  this.moveX = moveX,
  this.moveY = moveY;
}

//生成max和min之间的随机数
function num (max, _min) {
  var min = arguments[1] || 0;
  return Math.floor(Math.random()*(max-min+1)+min);
}

// 绘制原点
function drawCricle (cxt, x, y, r, moveX, moveY) {
  var circle = new Circle(x, y, r, moveX, moveY)
  cxt.beginPath()
  cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
  cxt.closePath()
  cxt.fill();
  return circle;
}

//绘制线条
function drawLine (cxt, x, y, _x, _y, o) {
  var line = new Line(x, y, _x, _y, o)
  cxt.beginPath()
  cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'
  cxt.moveTo(line.beginX, line.beginY)
  cxt.lineTo(line.closeX, line.closeY)
  cxt.closePath()
  cxt.stroke();

}

//初始化生成原点
function init () {
  circleArr = [];
  for (var i = 0; i < POINT; i++) {
    circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10)/40, num(10, -10)/40));
  }
  draw();
}

//每帧绘制
function draw () {
  context.clearRect(0,0,canvas.width, canvas.height);
  for (var i = 0; i < POINT; i++) {
    drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
  }
  for (var i = 0; i < POINT; i++) {
    for (var j = 0; j < POINT; j++) {
      if (i + j < POINT) {
        var A = Math.abs(circleArr[i+j].x - circleArr[i].x),
          B = Math.abs(circleArr[i+j].y - circleArr[i].y);
        var lineLength = Math.sqrt(A*A + B*B);
        var C = 1/lineLength*7-0.009;
        var lineOpacity = C > 0.03 ? 0.03 : C;
        if (lineOpacity > 0) {
          drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity);
        }
      }
    }
  }
}

function background_draw() {
  init();
  setInterval(function () {
    for (var i = 0; i < POINT; i++) {
      var cir = circleArr[i];
      cir.x += cir.moveX;
      cir.y += cir.moveY;
      if (cir.x > WIDTH) cir.x = 0;
      else if (cir.x < 0) cir.x = WIDTH;
      if (cir.y > HEIGHT) cir.y = 0;
      else if (cir.y < 0) cir.y = HEIGHT;
    }
    draw();
  }, 16);
}

window.onload = function() {
  handler();
  background_draw();
  $('#reset').click(reset);
  $('.input-area').focus(clear_tip);
  $('#username').blur(check_name);
  $('#id').blur(check_id);
  $('#phone').blur(check_phone);
  $('#mail').blur(check_mail);
}

function clear_tip(event) {
  if (event.target.id == "username" && name_error == "The username can't be empty") {
    name_error = "";
    $("#name-error").html("");
  }
  else if (event.target.id == "id" && id_error == "The student id can't be empty") {
    id_error = "";
    $("#id-error").html("");
  }
  else if (event.target.id == "phone" && phone_error == "The phone number can't be empty") {
    phone_error = "";
    $("#phone-error").html("");
  }
  else if (event.target.id == "mail" && mail_error == "The mail address can't be empty") {
    mail_error = "";
    $("#mail-error").html("");
  }
}
function reset() {
  name_error = "";
  id_error = "";
  phone_error = "";
  mail_error = "";
  $("#name-error").html("");
  $("#id-error").html("");
  $("#phone-error").html("");
  $("#mail-error").html("");
  document.getElementById('username').value = "";
  document.getElementById('id').value = "";
  document.getElementById('phone').value = "";
  document.getElementById('mail').value = "";
}

function check_isValid() {
  if (check_name() && check_id() && check_phone() && check_mail()) {
    $('form').attr('action', 'http://localhost:8000?username='+$("[name = username]").val());
    return true;
  }
  else {
    if (document.getElementById("username").value.length == 0) name_error = "The username can't be empty";
    if (document.getElementById("id").value.length == 0) id_error = "The student id can't be empty";
    if (document.getElementById("phone").value.length == 0) phone_error = "The phone number can't be empty";
    if (document.getElementById("mail").value.length == 0) mail_error = "The mail address can't be empty";
    show_error();
    return false;
  }
}

function show_error() {
  if (name_error != "") $("#name-error").html(name_error);
  if (id_error != "") $("#id-error").html(id_error);
  if (phone_error != "") $("#phone-error").html(phone_error);
  if (mail_error != "") $("#mail-error").html(mail_error);
}

var name_error = "";
function check_name() {
  name_error = "";
  var str = document.getElementById("username").value;
  if (str.length != 0) {
    if (/^\w+$/.test(str)) {
      if (/^[a-zA-Z]{1}/.test(str)) {
        if (str.length > 5 && str.length < 19) {
          name_error = "";
          $("#name-error").html("");
          return true;
        }
        else {
          name_error = "The length must between 6 to 18";
        }
      } 
      else {
        name_error = "Must begin with alpha";
      }
    }
    else {
      name_error = "Only permit alpha or digit or '_'";
    }
  }
  show_error();
  return false;
}

var id_error = "";
function check_id() {
  id_error = "";
  var str = document.getElementById("id").value;
  if (str.length != 0) {
    if (/^\d+$/.test(str)) {
      if (/^[1-9]/.test(str)) {
        if (str.length == 8) {
          id_error = "";
          $("#id-error").html("");
          return true;
        }
        else {
          id_error = "The length must be 8";
        }
      }
      else {
        id_error = "Can't begin with 0";
      }
    }
    else {
      id_error = "Only permit digit";
    }
  }
  show_error();
  return false;
}

var phone_error = "";
function check_phone() {
  phone_error = "";
  var str = document.getElementById("phone").value;
  if (str.length != 0) {
    if (/^\d+$/.test(str)) {
      if (/^[1-9]/.test(str)) {
        if (str.length == 11) {
          phone_error = "";
          $("#phone-error").html("");
          return true;
        }
        else {
          phone_error = "The length must be 11";
        }
      }
      else {
        phone_error = "Can't begin with 0";
      }
    }
    else {
      phone_error = "Only permit digit";
    }
  }
  show_error();
  return false;
}

var mail_error = "";
function check_mail() {
  mail_error = "";
  var str = document.getElementById("mail").value;
  if (str.length != 0) {
    if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(str)){
      mail_error = "";
      $("#mail-error").html("");
      return true;
    }
    else{
      mail_error = "The form was wrong";
    }
  }
  show_error();
  return false;
}