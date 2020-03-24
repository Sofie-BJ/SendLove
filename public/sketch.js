let height = 1000;
let width = 950;
let fr = 60;
let backgroundColor = "brown";
let active = false;
let activeHeight = null;

let heartBlowed = false;

function setup() {
    // put setup code here
    let cnv = createCanvas(width, height);
    cnv.position(15, 190);
    cnv.mousePressed(userStartAudio);
    frameRate(fr);

    let txt = createDiv('Send a heart by blowing into your microphone. Click on the red field before blowing.');
    txt.position(15, 80);
    txt.style('font-size', '40px')

    mic = new p5.AudioIn();
    mic.start();
}


function draw() {
    background(backgroundColor);

    let vol = mic.getLevel();
    let h = map(vol, 0, 1, height, 0);
    //let size = map(vol, 0, 1, 0, height / 2);

    if (heartBlowed === true) {
        receiveBlowedHeart();
    }

    if (vol >= 0.3 || active) {
        if (activeHeight == null) {
            activeHeight = h;
        }
        shootHeart()
    } else {
        if (h < 1000) {
            heart(width / 2, h - 100, 100);
        }
    }

}

function shootHeart() {
    active = true;
    activeHeight -= 5;
    heart(width / 2, activeHeight, 100);

    if (activeHeight < -200) {
        active = false;
        activeHeight = null;
        sendMQTT("heartBlowed")
    }
}

function receiveBlowedHeart() {
    activeHeight += 5;
    heart(width / 2, activeHeight, 100);

    if (activeHeight > 850) {
        heartBlowed = false;
        activeHeight = null;
    }
}

function heart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}