
var topic = "";
var server = "wss://iot.eclipse.org:443/ws";
var clientId = "Esp8266Sim_" + getRandNum(6);

function getRandNum(len) {
  return String(Math.round(Math.random() * 10 ** len))
}

function parseCmd(cmd) {
  var items = cmd.split('/');
  var msg = items[0] == "mode" ? ("Pin D" + items[1] + " set to " + (items[2] == "o" ? "output" : "input")) : ("Pin D" + items[1] + " set to " + items[2]);
  var obj = { "message": msg, "id": "Esp8266Simulator", "name": "esp8266", "hardware": "esp8266", "connected": true };

  msg = JSON.stringify(obj);
  message = new Paho.MQTT.Message(msg);
  message.destinationName = topic + "_out";
  client.send(message);

  console.log("Send message " + msg + " to " + topic + "_out");
  var output = document.getElementById('txtMsgs');
  output.innerHTML = "out: " + msg + "<br>" + output.innerHTML;

  document.getElementById('light').src = items[2] == "1" ? "img/light_on.png" : "img/light_off.png";
}

// Create a client instance 
client = new Paho.MQTT.Client(server, clientId);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
  console.log("onConnect");
  subTopic();
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:" + message.payloadString);
  var output = document.getElementById('txtMsgs');
  output.innerHTML = "in: " + message.payloadString + "<br>" + output.innerHTML;

  parseCmd(message.payloadString);
}

function subTopic() {
  var topic = document.getElementById('txtSubTopic').value;
  client.subscribe(topic);
  console.log("Subscribe Topic: " + topic);
}

window.onload = () => {
  topic = "SimId" + getRandNum(6);
  // topic = "SimId_debug123";
  document.getElementById('txtSubTopic').value = topic + "_in";
}
