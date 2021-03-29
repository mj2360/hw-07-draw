//backend code -->

console.log("Server is Running!"); 

var express = require('express');

var app = express(); 

//setting up listener 
var server = app.listen(3003); 

// || ---> OR operator 
//telling it to listen to port or 3003
// var port = process.env.PORT || 3003
// var server = app.listen(port);

app.use(express.static('public'));

var socket = require('socket.io'); 

var io = socket(server); 

//setup connection event 
io.sockets.on('connection', newConnection);

function newConnection(socket){
    //recognizes different clients and prints their ids
    console.log("new connection!" + socket.id);

    socket.on('mouse', mouseMsg); 
    socket.on('moreSpace', spaceMsg); 

    function mouseMsg(data){
        // console.log(data);
        socket.broadcast.emit('mouse', data);
    }

    function spaceMsg(data){
        socket.broadcast.emit('moreSpace', data);
    }
}