var socket; 
var prevMouseX; 
var prevMouseY; 

function setup(){
    createCanvas(windowWidth, windowHeight);
    background("white");

    socket = io.connect('http://localhost:3003');

    //handling broadcast calls
    socket.on('mouse', newDrawing);
}

function newDrawing(data){
  
      //original markings (top left)
      line(data.x_prev, data.y_prev, data.x, data.y);
      //mirrors the Xs (top right)
      line(width - data.x_prev, data.y_prev, width - data.x, data.y);
      //mirrors left Y's (bottom left)
      line(data.x_prev, height - data.y_prev, data.x, height -data.y);
      //mirrors right Y's (bottom right)
      line(width - data.x_prev,  height - data.y_prev, width - data.x,  height - data.y);

      data.x_prev = data.x; 
      data.y_prev = data.y;
}


function draw(){
     
  if (mouseIsPressed == true){

    //original markings (top left)
    line(prevMouseX, prevMouseY, mouseX, mouseY);
    //mirrors the Xs (top right)
    line(width - prevMouseX, prevMouseY, width - mouseX, mouseY);
    //mirrors left Y's (bottom left)
    line(prevMouseX, height - prevMouseY, mouseX, height -mouseY);
    //mirrors right Y's (bottom right)
    line(width - prevMouseX,  height - prevMouseY, width - mouseX,  height - mouseY);
    
    prevMouseX = mouseX; 
    prevMouseY = mouseY;

    //information for lines sent to sockets
    var data = {
      x_prev: prevMouseX, 
      y_prev: prevMouseY,
      x: mouseX, 
      y: mouseY
    }

    socket.emit('mouse', data);
    
  }
}

// function mousePressed(){
//     prevMouseX = mouseX; 
//     prevMouseY = mouseY;
// }