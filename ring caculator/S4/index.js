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

var order = [];
function robot() {
  if (doing == false) {
    $("#button").mouseleave();
    doing = true;
    
    var collect = [];
    var ordertext = "";
    $("li").each(function() {
      collect.push($(this));
    });
    for (var i = 5; i >= 1; i--) {
      var random_num = Math.ceil((Math.random() * 100)) % i;
      order.push(collect[random_num]);
      ordertext += collect[random_num].text().match(/[A,B,C,D,E]/)[0] + " ";
      collect.splice(random_num, 1);
    }
    $("#text-field").text(ordertext);
    auto_get_num(order[0], auto_show);
  }
}
function auto_get_num(jqobject, callback) {
  req_count++;
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
      if(doing && req_count == 1) callback(jqobject, req.responseText, auto_sum);
      req_count--;
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
  doing = false;
  if(count == 5) {
    result_mode();
    callback($("#info-bar"));
  }
  else auto_get_num(order[count], auto_show);
}

function auto_sum(jqobject) {
  if (count == 5) {
    var sum = 0;
    $('.num').each(function() {
      sum += +$(this).text();
    })
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
  order.splice(0, order.length);
  $("#text-field").html("");
}