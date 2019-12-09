var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./template.js');
var logToUML = require('./lib/logToPlantuml.js');
var process = require('child_process');
var plantumlEncoder = require('plantuml-encoder');
var port = 3000;

var ignoreMessages = ["ScrollMessageToC", "SeverTimeRequest", "ServerTimeReply", "InternalSocketClose", "InternalConnect"];

app.use(express.static('data'));

app.get('/', function(request, response){
  fs.readdir('./data/logfiles', function(error, filelist){
    var title = "Packet Drawer";
    var subTitle = "LogFile List"
    var list = template.list(filelist);
    var html = template.HTML(title, subTitle,
      list,
      "", "");

      response.send(html);
  });
});

app.get('/parse/:logFileName', function(request, response){
    logToUML.parseToUML(`./data/logfiles/${request.params.logFileName}`, ignoreMessages, function(err, result){
      fs.writeFile(`data/umlResult/${request.params.logFileName}_result`, result, 'utf8', function(err){
        if (err !== null){
          console.log(err);
        }

        var encoded = plantumlEncoder.encode(result);
        var url = 'http://www.plantuml.com/plantuml/svg/' + encoded;

        var prettyHTML = template.HTML(
          `Parse Result`, 
        `data/umlResult/${request.params.logFileName}_result`, 
        `
        <form>
          <textarea name="umlbody" placeholder="umlbody" rows="50" cols="50">${result}</textarea>
        </form>
        `, 
        `
        <img src="${url}">
        `,
        `<a class="btn btn-primary ml-3" href="/">Go To Home</a>`
        )

/*
        var command = `java -DPLANTUML_LIMIT_SIZE=8192 -jar lib/plantuml.jar -o "../pngResult" "./data/umlResult/${request.params.logFileName}_result"`;
        //command = 'java -version';
        console.log("command : " + command);
        process.exec(command,
        function(error, stdOut, stdErr){
          console.log("exec error : " + error);
          console.log("exec stdErr : " + stdErr);
          console.log(stdOut);
          
          var prettyHTML = template.HTML(
            `Parse Result`, 
          `data/umlResult/${request.params.logFileName}_result`, 
          `
          <form>
            <textarea name="umlbody" placeholder="umlbody" rows="50" cols="50">${result}</textarea>
          </form>
          `, 
          `
          <img src="../pngResult/${request.params.logFileName}_result.png">
          `,
          `<a class="btn btn-primary ml-3" href="/">Go To Home</a>`
          )
*/
          response.send(prettyHTML);
        });

      });
  });
  

app.listen(port, function() {
  console.log(`Packet Draw App listening on port ${port}`);
});