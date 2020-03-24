let width = 1000;
let height = 1000;
let heartImg;
let nameInput, msgInput, saveBtn;

let heartSize, heartHeight;
let name, msg;
let sendModeBtn, receiveModeBtn;

let sending, receiving, receiver;

let nameDiv, msgDiv;

function preload() {
    heartImg = loadImage('heart.png');
}

function setup() {
    createCanvas(width, height);

    sendModeBtn = createButton("Send a heart");
    sendModeBtn.size(320, 100);
    sendModeBtn.position(350, 420);
    sendModeBtn.attribute('class', 'bigButton')
    sendModeBtn.mousePressed(initSend);

    receiveModeBtn = createButton("Receive a heart");
    receiveModeBtn.size(320, 100);
    receiveModeBtn.position(350, 565);
    receiveModeBtn.attribute('class', 'bigButton')
    receiveModeBtn.mousePressed(initReceive);
}

function initReceive() {

    receiver = true;
    heartSize = 200;
    heartHeight = -200;

    sendModeBtn.remove();
    receiveModeBtn.remove();
}

function initSend() {
    nameInput = createInput().attribute('placeholder', 'Name');
    nameInput.size(200, 50);
    nameInput.position(400, 350);

    msgInput = createInput().attribute('placeholder', 'Message');
    msgInput.size(200, 90);
    msgInput.position(400, 400);

    saveBtn = createButton('Send message');
    saveBtn.size(120, 50);
    saveBtn.position(439, 505);
    saveBtn.mousePressed(saveMsg);

    heartSize = 800;
    heartHeight = height / 2;

    sendModeBtn.remove();
    receiveModeBtn.remove();
}

function draw() {
    background(20);
    imageMode(CENTER);

    if (receiver === true) {
        drawReceived();
    } else {
        drawSend();
    }
}

function drawSend() {
    if (sending) {
        pushHeart();
    } else {
        if (accelerationZ >= 65) {
            sending = true;
        }
    }

    if (heartSize < 20) {
        noStroke();
        fill(204, 153, 255);
        let s = 'Dit hjerte med beskeden er nu sendt til: ' + nameInput.value() + ". " +
            "\nDe modtager beskeden: " + msgInput.value();
        textSize(36);
        text(s, 400, 400, 500, 200); // Text wraps within text box

        name = nameInput.value();
        msg = msgInput.value();
    }

    image(heartImg, width / 2, heartHeight, heartSize, heartSize);
}

function saveMsg() {
    nameInput.remove();
    msgInput.remove();
    saveBtn.remove();
}

function pushHeart() {
    heartSize -= 7;
    heartImg.resize(heartSize, heartSize);

    if (heartSize < 300) {
        heartHeight -= 5;
    } else {
        heartHeight -= 3;
    }

    if (heartSize < 0) {
        sending = false;
        sendMQTT("pushed")
    }
}

function drawReceived() {

    if (receiving) {
        receiveHeart();
    }

    if (heartSize > 300) {
        console.log("hje hwj");
        noStroke();
        fill(204, 153, 255);
        let s = "Du modtager beskeden: " + msg;
        textSize(36);
        text(s, 400, 700, 500, 200); // Text wraps within text box
        fill('white');

    }
    image(heartImg, width / 2, heartHeight, heartSize, heartSize);
}

function receiveHeart() {
    heartSize += 5;
    heartHeight += 7;

    if (heartSize >= 600) {
        receiving = false;
    }
}

