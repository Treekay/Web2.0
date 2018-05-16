var doing = false;
var count = 0;
var req_count = 0;
window.onload = function() {
  $(".button").click(function() {
    get_num(event, show_and_disable);
  });
  $("#button").mouseleave(reset);
  $("#info-bar").click(get_sum);
  $(".apb").click(robot);
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

var save_req = {"A":0,"B":0,"C":0,"D":0,"E":0};
function robot() {
  if (doing == false) {
    $("#button").mouseleave();
    doing = true;
    req_count++;
    $("li").each(function() {
      auto_get_num($(this), auto_show);
    });
  }
}

function auto_get_num(jqobject, callback) {
  var _part = document.createElement("div");
  _part.className = "num";
  _part.innerHTML = "...";
  jqobject.append(_part);
  jqobject.addClass("button");
  jqobject.removeClass("button-disable");
  doing = true;

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      var temp = jqobject.text().match(/[A,B,C,D,E]/)[0];
      save_req[temp]++;
      if(doing && save_req[temp] == req_count) callback(jqobject, req.responseText, auto_sum);
    }
  }
  req.open("POST", true);
  req.send();
}

function auto_show(jqobject, responseText, callback) {
  jqobject.children(".num").html(responseText);
  jqobject.addClass("button-finish");
  jqobject.removeClass("button");
  jqobject.unbind();
  count++;
  if(count == 5) {
    save_req["A"] = 0;
    save_req["B"] = 0;
    save_req["C"] = 0;
    save_req["D"] = 0;
    save_req["E"] = 0;
    req_count = 0;
    result_mode();
    callback($("#info-bar"));
  }
}

function auto_sum(jqobject) {
  if (count == 5) {
    var sum = 0;
    $('.num').each(function() {
      sum += +$(this).text();
    });
    end_mode();
    jqobject.html(sum);
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
  doing = false;
  count = 0;
}