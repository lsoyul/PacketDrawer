var fs = require('fs');

var ignoreMessages = [];
const timeKeyIgnorePattern = /(\[)|(\])|(\-)|(\:)|(\.)|(\/)|(\s)/gi;

module.exports = {
  parseToUML:function(logFilePath, ignoreMessageArray ,callback){
    fs.readFile(logFilePath, 'utf8', function(err, resultString){
      
      ignoreMessages = ignoreMessageArray;
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
      var messageName = getMessageName(units);

      if (CheckIgnoreMessage(messageName) == false) return;

      var timeValue = units[0].replace(timeKeyIgnorePattern, "");
      var stringValue = "";
      var hexColorCode = getHexColorFromString(messageName);

      stringValue += "Client -> Server: ";
      stringValue += `${units[0]} `;
      stringValue += `<color ${hexColorCode}>` + messageName + "</color>";
      stringValue += "\n";

      packetList.push({time : timeValue, value : stringValue});
    }
    else if (element.indexOf("[SND]") != -1){
      var units = element.match(/\[(.*?)\]/g);
      var messageName = getMessageName(units);

      if (CheckIgnoreMessage(messageName) == false) return;

      var timeValue = units[0].replace(timeKeyIgnorePattern, "");
      var stringValue = "";
      var hexColorCode = getHexColorFromString(messageName);

      stringValue += "Client --> Server: ";
      stringValue += `${units[0]} `;
      stringValue += `<color ${hexColorCode}>` + messageName + "</color>";
      stringValue += "\n";
      packetList.push({time : timeValue, value : stringValue});
    }
    else if (element.indexOf("[RCV]") != -1){
      var units = element.match(/\[(.*?)\]/g);
      var messageName = getMessageName(units);

      if (CheckIgnoreMessage(messageName) == false) return;

      var timeValue = units[0].replace(timeKeyIgnorePattern, "");
      var stringValue = "";
      var hexColorCode = getHexColorFromString(messageName);

      stringValue += "Client <- Server: ";
      stringValue += `${units[0]} `;
      stringValue += `<color ${hexColorCode}>` + messageName + "</color>";
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

function getHexColorFromString(messageName)
{
  var pattern = ["Request", "Reply", "ToC", "ToS", "Req", "Res"];
  var targetString = messageName;

  for (var i = 0; i < pattern.length; i++){
    var n = messageName.lastIndexOf(pattern[i]);
    if (n >= 0 && n + pattern[i].length >= messageName.length){
      targetString = messageName.substring(0, n);
    }
     //targetString = messageName.replace(new RegExp(pattern[i] + '$'), "");
  }

  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < targetString.length; i++) {
      hash = targetString.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
  }
  var color = '#';
  for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 255;
      color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
