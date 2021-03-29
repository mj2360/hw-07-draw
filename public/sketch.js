var socket; 
var prevMouseX; 
var prevMouseY; 
var max_strk = 10; 
var min_strk = 0.5; 
var strk_wait = max_strk; 
var pos0neg = -1; 
var strkCol; 
var buttonBlack, buttonRed, buttonBlue, buttonGreen, buttonPink, buttonPurple, buttonYellow, buttonClear; 
var r, g, b = 0;
 

function setup(){
    createCanvas(windowWidth, windowHeight);
    background("white");

    socket = io.connect('http://localhost:3003');

    //handling broadcast calls
    socket.on('mouse', newDrawing);

    buttonBlack = select("#black");
    buttonRed = select("#red");
    buttonBlue = select("#blue");
    buttonGreen = select("#green");
    buttonPink = select("#pink");
    buttonPurple = select("#purple");
    buttonYellow = select("#yellow");
    buttonClear = select("#clear");

    buttonBlack.mousePressed(makeBlack);
    buttonRed.mousePressed(makeRed);
    buttonBlue.mousePressed(makeBlue);
    buttonGreen.mousePressed(makeGreen);
    buttonPink.mousePressed(makePink);
    buttonPurple.mousePressed(makePurple);
    buttonYellow.mousePressed(makeYellow);
    buttonClear.mousePressed(makeBlank);

}

function makeBlack(){
  r= 0;
  g= 0; 
  b= 0; 
}
function makeRed(){
  r= 250;
  g= 0; 
  b= 0; 
}
function makeBlue(){
  r = 0;
  g = 0; 
  b = 250; 
}
function makeGreen(){
  r= 0;
  g = 250;
  b = 0; 
  
}
function makePink(){
  r= 255;
  g = 192; 
  b = 203; 
  
}
function makePurple(){
  r= 128;
  g = 0; 
  b = 170; 
}
function makeYellow(){
  r= 250;
  g = 250; 
  b = 0; 
}

function makeBlank(){
  clear();
}

function newDrawing(data){

    stroke(data.red_val, data.green_val, data.blu_val); 
  
      //original markings (top left)
      line(data.x_prev, data.y_prev, data.x, data.y);
      //mirrors the Xs (top right)
      line(width - data.x_prev, data.y_prev, width - data.x, data.y);
      //mirrors left Y's (bottom left)
      line(data.x_prev, height - data.y_prev, data.x, height -data.y);
      //mirrors right Y's (bottom right)
      line(width - data.x_prev,  height - data.y_prev, width - data.x,  height - data.y);

      strokeWeight(data.strk); 
      data.strk = data.strk + 0.5*data.sign; 
  
      if(data.strk <= data.strk_min){
        data.sign = 1; 
      }
      if (data.strk == data.strk_max){
        data.sign = -1; 
      }

      data.x_prev = data.x; 
      data.y_prev = data.y;
}


function draw(){
     
  if (mouseIsPressed == true){

    stroke(r, g, b); 

    //original markings (top left)
    line(prevMouseX, prevMouseY, mouseX, mouseY);
    //mirrors the Xs (top right)
    line(width - prevMouseX, prevMouseY, width - mouseX, mouseY);
    //mirrors left Y's (bottom left)
    line(prevMouseX, height - prevMouseY, mouseX, height -mouseY);
    //mirrors right Y's (bottom right)
    line(width - prevMouseX,  height - prevMouseY, width - mouseX,  height - mouseY);

    strokeWeight(strk_wait); 
    strk_wait = strk_wait + 0.5*pos0neg; 

    if(strk_wait <= min_strk){
      pos0neg = 1; 
    }
    if (strk_wait == max_strk){
      pos0neg = -1; 
    }

    //information for lines sent to sockets
    var data = {
      x_prev: prevMouseX, 
      y_prev: prevMouseY,
      x: mouseX, 
      y: mouseY,
      red_val: r, 
      green_val: g, 
      blu_val: b, 
      strk:strk_wait,
      strk_min: min_strk, 
      strk_max: max_strk, 
      sign: pos0neg
    }

    prevMouseX = mouseX; 
    prevMouseY = mouseY;

    socket.emit('mouse', data);
    
  }
}

function mousePressed(){
    prevMouseX = mouseX; 
    prevMouseY = mouseY;
}