var doing = false;
var auto = false;
var count = 0;
window.onload = function() {
  $(".button").click(function() {
    get_num(event, show_and_disable);
  });
  $("#button").mouseleave(reset);
  $("#info-bar").click(get_sum);
  $("#button .apb").click(robot);
}

function get_num(event, callback) {
  if (event.target.className == "button" && doing == false) {
    var _part = document.createElement("div");
    _part.className = "num";
    _part.innerHTML = "...";
    $("#"+event.target.id).append(_part);
    $('.button').addClass("button-disable");
    $('.button').removeClass("button");
    $("#"+event.target.id).addClass("button");
    $("#"+event.target.id).removeClass("button-disable");
    doing = true;

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200 && doing == true) {
        callback(event, req.responseText);
      }
    }
    req.open("GET", true);
    req.send();
  }
}

function show_and_disable(event, responseText) {
  if ($("#"+event.target.id).find("div")) {
    $("#"+event.target.id).children(".num").html(responseText);
    $('.button-disable').addClass("button");
    $('.button-disable').removeClass("button-disable");
    $("#"+event.target.id).addClass("button-finish");
    $("#"+event.target.id).removeClass("button");
    $("#"+event.target.id).unbind();
    doing = false;
    count++;
  }
  if (count == 5) result_mode();
  if (auto == true) {
    if (count != 5) $("li")[count].click();
    else {
      $("#info-bar").click();
    }
  }
}

function get_sum(event) {
  if (count == 5) {
    var sum = 0;
    $('.num').each(function() {
      sum += +$(this).text();
    });
    end_mode();
    $("#"+event.target.id).html(sum);
    count = 0;
  }
}

function robot(event) {
  if (doing == false) {
    $("#button").mouseleave();
    auto = true;
    $("li")[0].click();
  }
}

function result_mode() {
  $("#info-bar").addClass("info-bar-able");
  $("#info-bar").removeClass("info-bar-disable");
  $("#control-ring li").removeClass("button");
  $("#control-ring li").removeClass("button-disable");
  $("#control-ring li").removeClass("button-finish");
  $("#control-ring li").addClass("button");
}

function end_mode() {
  $("#info-bar").addClass("info-bar-disable");
  $("#info-bar").removeClass("info-bar-able");
}

function reset() {
  $("#control-ring li").children("div").remove();
  $("#control-ring li").removeClass("button");
  $("#control-ring li").removeClass("button-disable");
  $("#control-ring li").removeClass("button-finish");
  $("#control-ring li").addClass("button");
  $("#info-bar").addClass("info-bar-disable");
  $("#info-bar").removeClass("info-bar-able");
  $(".button").click(function() {
    get_num(event, show_and_disable);
  });
  $("#info-bar").html("");
  doing = false;
  count = 0;
  auto = false;
}