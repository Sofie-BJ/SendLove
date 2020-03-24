// SETUP MQTT ------------------------------------------

const host = "influx.itu.dk";
const port = 9002;
const secured = true;
const topic = "ituF2020/EXPD/sbuj_orientation";
const myID = "id" + parseInt(Math.random() * 100000, 10);

// CONNECT ----------------------------------------------

let mqttClient = new Paho.MQTT.Client(host, port, myID);

var options = {
    useSSL: secured,
    onSuccess: onConnect
};

mqttClient.connect(options);
mqttClient.onConnectionLost = conLost;
mqttClient.onMessageArrived = receiveMessage;

// MQTT Handler functions--------------------------------

function onConnect() {
    console.log("Connected");
    console.log("client: " + mqttClient.clientId)
    mqttClient.subscribe(topic);
};

function sendMQTT(message) {
    //console.log("sending");
    let mOBJ = {deviceID: myID, content: message};
    let mSend = new Paho.MQTT.Message(JSON.stringify(mOBJ));
    mSend.destinationName = topic;
    mqttClient.send(mSend);
};

function receiveMessage(message) {
    //console.log("message reived");
    let mUnpack = JSON.parse(message.payloadString);
    let senderID = mUnpack.deviceID;
    //console.log("senderID: " + senderID);
    let receivedMessage = mUnpack.content;

    if (receivedMessage === "pushed" && senderID !== mqttClient.clientId) {
        receiving = true;
    } else if (receivedMessage === "heartBlowed" && senderID !== mqttClient.clientId) {
        heartBlowed = true;
    }
}

function conLost() {
    console.log("Lost connection");
}




