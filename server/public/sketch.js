// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var bgColor;
var inp;
var but;
var start = false;
var _;
var countdown = 3;
var round = false;
var startTime;
var txt = 'Connect';
var gi = false;


function setup() {
  createCanvas(400, 400);
  fill(0);
  textSize(width/4);
  textAlign(CENTER, CENTER);
  bgColor = color(255,0,0);

  socket = io.connect('http://localhost:8080');

  socket.on('getName', (data) => {
      bgColor = color(0,0,255);
      inp = createInput('Nome do time');
      but = createButton('Enviar');
      but.mousePressed(getInput);
    });

    socket.on('start', (data) => {
        bgColor = color(0,255,0);
        txt = 'Aguarde';
        start = true;
    });

    socket.on('count', (data) => {
        _ = data._;
        countdown = 3;
        round = true;
        startTime = second();
    })

}

function getInput() {
    send('getName', { name: inp.value() });
    DestroyDOMLoginElements();
}

function draw() {
    background(bgColor);
    translate(width/2, height/2);
    text(txt, 0, 0);
    if(start) {
        if(round){
            var now = second();
            var tt = now - startTime;
            if(countdown < 0){
                if(tt >= _){
                    bgColor = color(255,0,255);
                    txt = 'ENTER';
                    gi = true;
                    round = false;
                    countdown = 3;

                }else {
                    txt = 'Aguarde';
                }
            } else {
                if(tt >= 1){
                    startTime = second();
                    txt = '' + countdown;
                    countdown--;
                }
            }
        }else {
            var now = second();
            if(countdown < 0){
                bgColor = color(0,255,0);
                txt = 'Aguarde';
                gi=false;
            }else {
                if(now != startTime){
                    countdown--;
                    startTime = second();
                }
            }
        }
    }else {
        txt = 'Nome?';
    }
}

// Function for sending to the socket
function send(evt, data) {
  console.log("send: " + evt + "\ndata: " + data);
  socket.emit(evt, data);
}

function DestroyDOMLoginElements() {
    inp.remove();
    but.remove();
}
