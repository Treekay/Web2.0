var num = 0;

window.onload = function() {
  document.getElementById("1").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("2").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("3").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("4").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("5").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("6").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("7").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("8").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("9").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("0").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById(".").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("+").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("-").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("*").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("/").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("(").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById(")").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("←").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("CE").onclick = function() {
    getCommand(this.id);
  }
  document.getElementById("=").onclick = function() {
    getCommand(this.id);
  }
}

document.onkeydown = function(event){
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if (e.keyCode == 13 || e.keyCode == 108) getCommand('=');
  else if (e.keyCode == 8) getCommand('←');
  else if (e.keyCode == 107 || e.keyCode == 187 && e.shiftKey) getCommand('+');
  else if (e.keyCode == 109 || e.keyCode == 189) getCommand('-');
  else if (e.keyCode == 106 || e.keyCode == 56 && e.shiftKey) getCommand('*');
  else if (e.keyCode == 111 || e.keyCode == 191) getCommand('/');
  else if (e.keyCode == 110 || e.keyCode == 190) getCommand('.');
  else if (e.keyCode == 48 && e.shiftKey) getCommand(')');
  else if (e.keyCode == 57 && e.shiftKey) getCommand('(');
  else if (e.keyCode >= 48 && e.keyCode <= 57) getCommand(e.keyCode - 48);
  else if (e.keyCode >= 96 && e.keyCode <= 105) getCommand(e.keyCode - 96);
  else if (e.keyCode < 37 || e.keyCode > 40  && e.keyCode < 48 || e.keyCode > 57 && e.keyCode < 96 || e.keyCode > 123) window.event.returnValue = false;
}

function readme() {
  alert("Simple Caculator - Readme @Treek\n\n\n"+
        "目前实现功能:\n"+
        "1.运算、清屏、退格\n"+
        "2.不合法算式的错误提示\n"+
        "3.运算精度到小数点后8位\n"+
        "4.支持键盘输入，屏蔽了大多数无关键，可放心食用\n\n"+
        "不足:\n"+
        "1.键盘输入时按钮没有被点击效果\n"+
        "2.超出显示屏宽度时显示不了后面的内容\n"+
        "3.点击过按钮之后按回车键会再次触发按钮\n\n"+
        "PS: 比如当你看完这段readme点完确定之后，再按回车键就会再次弹出readme，需点其他非按钮处才能破除，请先点击非按钮处再尝试键盘输入\n");
}

function showError(message) {
  alert("'"+document.getElementById("output").value+"'"+"不是合法算式");
  clean();
}

function getCommand(num){
  if (num == '=') updateoutput();
  else if (num == "CE") clean();
  else if (num == '←') back();
  else document.getElementById("output").value += document.getElementById(num).value;
}

function updateoutput() {
  if (document.getElementById("output").value == " ") return;
  if (judgeLegal() == true) {
    try {
      document.getElementById("output").value = parseFloat(eval(document.getElementById("output").value).toFixed(8));
    }
    catch (SyntaxError) {
      showError(document.getElementById("output").value);
    }
  }
  else {
    showError(document.getElementById("output").value);
  }
}

function clean() {
  document.getElementById("output").value = "";
}

function back() {
  var str = document.getElementById("output");
  if (str.value == 0 || str.value.length == 1) str.value = " ";
  else str.value = str.value.substring(0, str.value.length - 1);
}

function judgeLegal() {
  var str = document.getElementById("output").value;
  for (var index = 0; index < str.length; index++) {
    if (index == 0) {
      if (str[index] == '+'|| str[index] == '/'|| str[index] == '*') return false;
    }
    if ((str[index] == '+'|| str[index] == '-'|| str[index] == '/'|| str[index] == '*')&&
      (str[index+1] == '+'|| str[index+1] == '-'|| str[index+1] == '/'|| str[index+1] == '*')) {
      return false;
    }
    if (str[index] == '.' && (str[index+1] == '.'|| str[index+1] == '+'|| str[index+1] == '-'||
    str[index+1] == '*'|| str[index+1] == '/')) return false;
      if (str[index] == '/' && str[index+1] == '0') return false;
  }
  return true;
}