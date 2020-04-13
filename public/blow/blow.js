let height = 1000;
let width = 1000;

let backgroundColor = "white";
let blowHeartImg;
let activeHeight;

let cnv;
let mic;

let heartSize;

let toInputBlow, fromInputBlow;

let blowBtn, receiveBlowBtn, newHeart;
let receiverOfBlow, receivingBlow, sendingBlow, readyToSend;

let info, msg, receivedBlowMsg;

function preload() {
    blowHeartImg = loadImage('../assets/heart.png');
}

function setup() {
    cnv = createCanvas(width, height);

    blowBtn = createButton("Send");
    blowBtn.position(350, 420);
    blowBtn.attribute('class', 'bigButton');
    blowBtn.mousePressed(initSendBlow);

    receiveBlowBtn = createButton("Modtag");
    receiveBlowBtn.position(350, 565);
    receiveBlowBtn.attribute('class', 'bigButton');
    receiveBlowBtn.mousePressed(initReceiveBlow);
/*
    newHeart = createButton("Send a new heart?");
    newHeart.style("font-size", "36px");
    newHeart.mousePressed(initSendBlow);
    newHeart.hide();
 */

    mic = new p5.AudioIn();
    mic.start();
}


function initReceiveBlow() {
    receiverOfBlow = true;

    activeHeight = -100;
    heartSize = 100;

    blowBtn.remove();
    receiveBlowBtn.remove();
}

function initSendBlow() {
    info = createDiv("Send et hjerte ved at indtaste afsender, samt modtager. \n <b>Klik på hjertet</b> og derefter pust.");
    info.style("font-size", '26px');
    info.style("font-family", 'Courier New');
    info.position(70, 50);
    info.size(900, 200);

    cnv.mousePressed(userStartAudio);

    toInputBlow = createInput().attribute('placeholder', 'TIL');
    toInputBlow.size(200, 50);
    toInputBlow.position(width /2 - 100, height/2 - 50);

    fromInputBlow = createInput().attribute('placeholder', 'FRA');
    fromInputBlow.size(200, 50);
    fromInputBlow.position(width/2- 100, height/2);

    activeHeight = height - 100;
    heartSize = 100;
    readyToSend = true;

    blowBtn.remove();
    receiveBlowBtn.remove();
    //newHeart.hide();
}


function draw() {
    background(backgroundColor);

    if (receiverOfBlow === true) {
        drawReceivedBlow();
    } else {
        drawSendBlow();
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        hideKeyboard();
    }
}
let hideKeyboard = function() {
    document.activeElement.blur();
    var inputs = document.querySelectorAll('input');
    for(var i=0; i < inputs.length; i++) {
        inputs[i].blur();
    }
};

function drawSendBlow() {
    let vol = mic.getLevel();

    if (sendingBlow) {
        blowHeart()
    } else {
        if (vol >= 0.3 && readyToSend && toInputBlow.value() !== "" && fromInputBlow !== "") {
            sendingBlow = true;
            fromInputBlow.remove();
            toInputBlow.remove();
            info.remove();
        }
    }

    if (activeHeight < -100) {
        let s = 'Dit hjerte til ' + toInputBlow.value() + " fra " + fromInputBlow.value() + " er nu sendt";
        fill(204, 153, 255);
        textSize(36);
        text(s, 400, 400, 500, 200); // Text wraps within text box

        msg = {to: toInputBlow.value(), from: fromInputBlow.value()};
    }

    image(blowHeartImg, width / 2 - heartSize/2, activeHeight, heartSize, heartSize);
}


function blowHeart() {
    activeHeight -= 5;

    if (activeHeight < -300) {
        sendingBlow = false;
        activeHeight = -200;
        readyToSend = false;
        let obj1 = {type: "heartBlowed", msg: msg};
        sendMQTT(obj1);
       // newHeart.show();
    }
}

function drawReceivedBlow() {
    if (receivingBlow) {
        receivedBlowedHeart();
    }

    if (activeHeight === 600) {
        fill(204, 153, 255);
        let s = "Hjertet er fra " + receivedBlowMsg.from + " til dig.";
        textSize(36);
        text(s, 400, 720, 500, 200); // Text wraps within text box
    }

    image(blowHeartImg, width / 2, activeHeight, heartSize, heartSize);
}

function receivedBlowedHeart() {
    activeHeight += 5;

    if (activeHeight >= 600) {
        receiving = false;
        receivingBlow = false;
        activeHeight = 600;
    }
}

