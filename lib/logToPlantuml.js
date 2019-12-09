var fs = require('fs');

var ignoreMessages = ["ScrollMessageToC", "SeverTimeRequest", "ServerTimeReply"];

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
  var seperatedByLineArray = resultString.split(/[\n,\\\n]/g);

  console.log(seperatedByLineArray);
  var packetList = [];

  seperatedByLineArray.forEach(element => {
    // 1. Check this line is packet sequence data.
    if (element.indexOf("[REQ]") != -1){
      var units = element.match(/\[(.*?)\]/g);

      if (CheckIgnoreMessage(getMessageName(units)) == false) return;

      var timeValue = units[0].replace(/(\[)|(\])|(\-)|(\:)|(\.)|(\/)|(\s)/gi, "");
      var stringValue = "";

      stringValue += "Client -> Server: ";
      stringValue += `${units[0]} `;
      stringValue += getMessageName(units);
      stringValue += "\n";

      packetList.push({time : timeValue, value : stringValue});
    }
    else if (element.indexOf("[SND]") != -1){
      var units = element.match(/\[(.*?)\]/g);

      if (CheckIgnoreMessage(getMessageName(units)) == false) return;

      var timeValue = units[0].replace(/(\[)|(\])|(\-)|(\:)|(\.)|(\/)|(\s)/gi, "");
      var stringValue = "";

      stringValue += "Client --> Server: ";
      stringValue += `${units[0]} `;
      stringValue += getMessageName(units);
      stringValue += "\n";
      packetList.push({time : timeValue, value : stringValue});
    }
    else if (element.indexOf("[RCV]") != -1){
      var units = element.match(/\[(.*?)\]/g);

      if (CheckIgnoreMessage(getMessageName(units)) == false) return;

      var timeValue = units[0].replace(/(\[)|(\])|(\-)|(\:)|(\.)|(\/)|(\s)/gi, "");
      var stringValue = "";

      stringValue += "Client <- Server: ";
      stringValue += `${units[0]} `;
      stringValue += getMessageName(units);
      stringValue += "\n";
      packetList.push({time : timeValue, value : stringValue});
    }
  });


  packetList.sort(function(a, b){
    return a.time - b.time;
  });

  //console.log(packetList);

  packetList.forEach(element => {
    umlString += element.value;
  });

  umlString += "@enduml";

  return umlString;
}

function getMessageName(units){
  var messageName = "Unknown";

  units.forEach(element => {
    if (element.indexOf("msg") != -1
    || element.indexOf("msgName") != -1){

      messageName = element.split(":");
      messageName = messageName[1].replace("]", "");
    }    
  });

  return messageName;
}

function CheckIgnoreMessage(messageName)
{
  for (var i = 0; i < ignoreMessages.length; i++)
  {
    if (ignoreMessages[i] == messageName) return false;
  }

  return true;
}
