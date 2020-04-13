let width = 1000;
let height = 1000;
let heartImg;
let toInput, fromInput, saveBtn;

let heartSize, heartHeight;
let name, msg;
let sendModeBtn, receiveModeBtn, motionBtn;

let receivedMsg;
let info2, newHeart2;

let sending, receiving, receiver;

function preload() {
    heartImg = loadImage('../assets/heart.png');
}

function setup() {
    createCanvas(width, height);

    sendModeBtn = createButton("Send");
    sendModeBtn.size(320, 100);
    sendModeBtn.position(350, 420);
    sendModeBtn.attribute('class', 'bigButton');
    sendModeBtn.mousePressed(initSend);

    receiveModeBtn = createButton("Modtag");
    receiveModeBtn.size(320, 100);
    receiveModeBtn.position(350, 565);
    receiveModeBtn.attribute('class', 'bigButton');
    receiveModeBtn.mousePressed(initReceive);

    motionBtn = createButton("Motion detection");
    motionBtn.size(320, 100);
    motionBtn.position(350, 300);
    motionBtn.attribute('class', 'bigButton');
    motionBtn.mousePressed(initMotion);

    if (DeviceMotionEvent) {
        motionBtn.remove();
    }
    if (BrowserDetect.browser === 'Safari' && BrowserDetect.version >= 13) {
        motionBtn.show();
    } else {
        motionBtn.hide();
    }
}

var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function(data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
            } else if (dataProp) return data[i].identity;
        }
    },
    searchVersion: function(dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    }, {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    }, {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
    }, {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
    }, {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    }, {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    }, { // for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    }, {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    }, { // for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    }],
    dataOS: [{
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    }, {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    }, {
        string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
    }, {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    }]

};
BrowserDetect.init();

///// mobile
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function initMotion() {
    if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {

        DeviceMotionEvent.requestPermission()
            .then(response => {
                alert('Orientation tracking ' + response);

                if (response === 'granted') {
                    window.addEventListener('devicemotion', (e) => {
                        motionBtn.hide();
                    })
                }
            })
            .catch(console.error)
    } else {
        alert('DeviceMotionEvent is not defined');
    }
}

function initReceive() {
    receiver = true;
    heartSize = 200;
    heartHeight = -200;

    sendModeBtn.remove();
    receiveModeBtn.remove();
}

function initSend() {
    info2 = createDiv("Send et hjerte ved at indtaste afsender samt modtager. Hold derefter din mobil ind mod dit hjerte og skub mobilen væk fra kroppen i en hurtigt bevægelse.");
    info2.style("font-size", '26px');
    info2.style("color", "white");
    info2.style("font-family", 'Courier New');
    info2.position(70, 50);
    info2.size(900, 200);

    toInput = createInput().attribute('placeholder', 'TIL');
    toInput.size(200, 50);
    toInput.position(width / 2 - 100, height / 2 - 50);

    fromInput = createInput().attribute('placeholder', 'FRA');
    fromInput.size(200, 50);
    fromInput.position(width / 2 - 100, height / 2);

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

function keyPressed() {
    if (keyCode === ENTER) {
        hideKeyboard();
    }
}

let hideKeyboard = function () {
    document.activeElement.blur();
    var inputs = document.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].blur();
    }
};

function drawSend() {
    if (sending) {
        pushHeart();
    } else {
        if (accelerationZ >= 65 && toInput !== "" && fromInput !== "") {
            sending = true;
            toInput.remove();
            fromInput.remove();
            info2.remove();
        }
    }

    if (heartSize < 20) {
        noStroke();
        fill(204, 153, 255);
        let s = 'Dit hjerte til ' + toInput.value() + " fra " + fromInput.value() + " er nu sendt";
        textSize(36);
        text(s, 400, 400, 500, 200); // Text wraps within text box

        msg = {to: toInput.value(), from: fromInput.value()};
    }

    image(heartImg, width / 2, heartHeight, heartSize, heartSize);
}


function pushHeart() {
    heartSize -= 7;

    if (heartSize < 300) {
        heartHeight -= 7;
    } else {
        heartHeight -= 3;
    }

    if (heartSize < 0) {
        sending = false;
        let obj = {type: "pushed", msg: msg};
        sendMQTT(obj)
    }
}

function drawReceived() {

    if (receiving) {
        receiveHeart();
    }

    if (heartSize > 300) {
        noStroke();
        fill(204, 153, 255);
        let s = "Hjertet er fra " + receivedMsg.from + " til dig.";
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

