var http = require("http");
var url = require('url');
var fs = require("fs");
var path = require("path");
var querystring = require('querystring');
var userArray = new Array();

var server = http.createServer(function(request, response){
  if (request.method == "POST") {
    request.on('data', function(data){
      var sub_on = querystring.parse(decodeURIComponent(data)); //判断提交上来的数据中是否有已有用户重复
      var sign_flag = false;
      var i = 0;
      for ( i = 0; i < userArray.length; i++) {
        if (sub_on.username == userArray[i].username || sub_on.id == userArray[i].id ||
            sub_on.phone == userArray[i].phone || sub_on.mail == userArray[i].mail) {
          sign_flag =  true;
          break;
        }
      }
      if (sign_flag == true) {  //  若有重复则报错
        console.log("Sign up Fail, Repeat");
        var name_error = "";
        var id_error = "";
        var phone_error = "";
        var mail_error = "";
        if (sub_on.username == userArray[i].username) name_error = "The username has existed!";
        if (sub_on.id == userArray[i].id) id_error = "The id has existed!";
        if (sub_on.phone == userArray[i].phone) phone_error = "The phone has existed!";
        if (sub_on.mail == userArray[i].mail) mail_error = "The mail has existed!";
        fs.readFile(__dirname + url.parse(request.url).pathname + "./html/register.html",function (err,data){
          response.writeHead(200, {'Content-Type': 'text/html'});
          var str = data.toString();
          str = str.replace('id="name-error"></div>', 'id="name-error">'+name_error+'</div>');
          str = str.replace('id="id-error"></div>', 'id="id-error">'+id_error+'</div>');
          str = str.replace('id="phone-error"></div>', 'id="phone-error">'+phone_error+'</div>');
          str = str.replace('id="mail-error"></div>', 'id="mail-error">'+mail_error+'</div>');
          str = str.replace('id="username" value=""/>', 'id="username" value="'+sub_on.username+'"/>');
          str = str.replace('id="id" value=""/>', 'id="id" value="'+sub_on.id+'"/>');
          str = str.replace('id="phone" value=""/>', 'id="phone" value="'+sub_on.phone+'"/>');
          str = str.replace('id="mail" value=""/>', 'id="mail" value="'+sub_on.mail+'"/>');
          response.write(str);
          response.end();
        });
      }
      else if (sign_flag == false) { //无重复则进入详情页面并存入数组
        console.log("Sign up Success");
        console.log("Username: " + sub_on.username);
        console.log("StudentId: " + sub_on.id);
        console.log("Phone: " + sub_on.phone);
        console.log("E-Mail: " + sub_on.mail);
        response.writeHead(302, {Location: '?username=' + sub_on.username});
        fs.readFile(__dirname + url.parse(request.url).pathname + "./html/details.html",function (err,data){
          response.writeHead(200, {'Content-Type': 'text/html'});
          var str = data.toString();
          str = str.replace('id="username">', 'id="username">'+"Username: "+sub_on.username);
          str = str.replace('id="id">', 'id="id">'+"Student ID: "+sub_on.id);
          str = str.replace('id="phone">', 'id="phone">'+"Phone: "+sub_on.phone);
          str = str.replace('id="mail">', 'id="mail">'+"Email: "+sub_on.mail);
          response.write(str);
          response.end();
        });
        userArray.push(sub_on);
      }
    });
  }
  else if (request.method != "POST") {
    var pathname = __dirname + url.parse(request.url).pathname;
    if (path.extname(pathname)=="") {
      pathname += "/";
    }
    if (pathname.charAt(pathname.length-1)=="/"){
      pathname += "html/register.html";
    }

    var arg = url.parse(request.url, true).query;   //直接在网址栏输入的url参数?username=
    var exist_flag = false;
    var i = 0;
    for (i = 0; i < userArray.length; i++) {    //查找是否存在该user
      if (arg.username == userArray[i].username) {
        exist_flag = true;
        break;
      }
    }
    if (exist_flag) {   //通过url查询用户若存在直接进入详情页面
      console.log("Get into the user page successfully");
      response.writeHead(302, {Location: '?username=' + arg.username});
      fs.readFile(__dirname + url.parse(request.url).pathname + "./html/details.html",function (err,data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        var str = data.toString();
        str = str.replace('id="username">', 'id="username">'+"Username: "+userArray[i].username);
        str = str.replace('id="id">', 'id="id">'+"Student ID: "+userArray[i].id);
        str = str.replace('id="phone">', 'id="phone">'+"Phone: "+userArray[i].phone);
        str = str.replace('id="mail">', 'id="mail">'+"Email: "+userArray[i].mail);
        response.write(str);
        response.end();
      });
    }
    else {    //若不存在则进入注册页面
      fs.exists(pathname,function(exists){          
        if(exists){
          switch(path.extname(pathname)){
            case ".html":
              response.writeHead(200, {"Content-Type": "text/html"});
              break;
            case ".js":
              response.writeHead(200, {"Content-Type": "text/javascript"});
              break;
            case ".css":
              response.writeHead(200, {"Content-Type": "text/css"});
              break;
            default:
              response.writeHead(200, {"Content-Type": "application/octet-stream"});
          }
          fs.readFile(pathname,function (err,data){
            response.end(data);
          });
        } 
        else {
          response.writeHead(404, {"Content-Type": "text/html"});
          response.end("<h1>404 Not Found</h1>");
        }
      });
    }
  }
}).listen(8000);

console.log("Server is listening");