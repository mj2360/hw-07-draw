var socket; 
var prevMouseX; 
var prevMouseY; 
var max_strk = 10; 
var min_strk = 0.5; 
var strk_wait = max_strk; 
var pos0neg = -1; 
var strkCol; 
var buttonBlack, buttonRed, buttonBlue, buttonGreen, buttonPink, buttonPurple, buttonYellow; 
var r, g, b = 0;
var bg_color = "white"; 
var white_bg = true; 
 

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(bg_color);

    //changed from local host to the heroku 
    socket = io.connect('https://reflective-drawing.herokuapp.com/');
    // socket = io.connect("http://localhost:3003");

    //handling broadcast calls
    socket.on('mouse', newDrawing);
    socket.on('moreSpace', makeSpace);

    buttonBlack = select("#black");
    buttonRed = select("#red");
    buttonBlue = select("#blue");
    buttonGreen = select("#green");
    buttonPink = select("#pink");
    buttonPurple = select("#purple");
    buttonYellow = select("#yellow");

    buttonBlack.mousePressed(makeBlack);
    buttonRed.mousePressed(makeRed);
    buttonBlue.mousePressed(makeBlue);
    buttonGreen.mousePressed(makeGreen);
    buttonPink.mousePressed(makePink);
    buttonPurple.mousePressed(makePurple);
    buttonYellow.mousePressed(makeYellow);

}

function makeSpace(data){

  // data.whiteBG = !data.whiteBG
  if(data.whiteBG == false){

    data.bgColor = "black"; 
    background(data.bgColor);

    //changes black stroke to white stroke
    data.redVal = 250; 
    data.greenVal = 250; 
    data.bluVal= 250; 

  } else{

      data.bgColor = "white"; 
      background(data.bgColor); 

      //changes white stroke to black stroke
      data.redVal= 0; 
      data.greenVal = 0; 
      data.bluVal = 0; 
  } 
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


function keyPressed(){

  if (keyCode == 32){
    
    white_bg = !white_bg
    console.log(white_bg);

    if(white_bg == false){

      bg_color = "black"; 
      background(bg_color);

      //changes black stroke to white stroke
      r= 250; 
      g = 250; 
      b= 250; 

    } else{

        bg_color = "white"; 
        background(bg_color); 

        //changes white stroke to black stroke
        r= 0; 
        g = 0; 
        b= 0; 
    }
    //stops the Spacebar from executing default function(i.e. scrolling down)
    return false;
  }

    var data = {
      bgColor: bg_color, 
      redVal: r, 
      greenVal: g, 
      bluVal: b, 
      whiteBG: white_bg
    }

    
    // tell the other clients to clear screens
    socket.emit('moreSpace', data);
  }
