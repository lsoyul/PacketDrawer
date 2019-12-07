var fs = require('fs');

module.exports = {
  parseToUML:function(logFilePath, callback){
    fs.readFile(logFilePath, 'utf8', function(err, resultString){
      
      var parsedString = doParse(resultString);

      callback(err, parsedString);
    });
  }
}

function doParse(resultString) {
  var umlString = "@startuml\n";
  var seperatedByLineArray = resultString.split('\n');

  seperatedByLineArray.forEach(element => {
    // 1. Check this line is packet sequence data.
    if (element.indexOf("[REQ]") != -1){
      umlString += "Client -> Server: ";
      umlString += getMessageName(element);
      umlString += "\n";
    }
    else if (element.indexOf("[SND]") != -1){
      umlString += "Client --> Server: ";
      umlString += getMessageName(element);
      umlString += "\n";
    }
    else if (element.indexOf("[RCV]") != -1){
      umlString += "Client <- Server: ";
      umlString += getMessageName(element);
      umlString += "\n";
    }
  });

  umlString += "@enduml";

  return umlString;
}

function getMessageName(lineString){
  var messageName = "Unknown";
  var units = lineString.match(/\[(.*?)\]/g);

  console.log(units);
  units.forEach(element => {
    if (element.indexOf("msg") != -1
    || element.indexOf("msgName") != -1){

      messageName = element.split(":");
      messageName = messageName[1].replace("]", "");
    }    
  });

  return messageName;
}