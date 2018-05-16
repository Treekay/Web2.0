var doing = 0;
var count = 0;
window.onload = function() {
  $(".button").click(function() {
    get_num(event, show_and_disable);
  });
  $("#button").mouseleave(reset);
  $("#info-bar").click(get_sum);
}

function get_num(event, callback) {
  if (event.target.className == "button" && doing == 0) {
    var _part = document.createElement("div");
    _part.className = "num";
    _part.innerHTML = "...";
    $("#"+event.target.id).append(_part);
    $('.button').addClass("button-disable");
    $('.button').removeClass("button");
    $("#"+event.target.id).addClass("button");
    $("#"+event.target.id).removeClass("button-disable");
    doing = 1;

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200 && doing == 1) {
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
    $("#"+event.target.id).addClass("button-finish");
    $("#"+event.target.id).removeClass("button");
    $("#"+event.target.id).unbind();
    $('.button-disable').addClass("button");
    $('.button-disable').removeClass("button-disable");
    doing = 0;
    count++;
    if (count == 5) {
      result_mode();
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
  doing = 0;
  count = 0;
}