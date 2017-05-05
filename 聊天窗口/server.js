var express = require('express');
var sio = require('socket.io');
var path = require('path');
var fs = require('fs');

var io = sio.listen(8080);

var app = express();
var socket;

app.use(express.static(path.join(__dirname + '/public')));

app.use('/', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/public/index.html').pipe(res);
})

io.sockets.on('connection', function(s) {

   socket = s;
   
   socket.emit('open');
   socket.on('socket', function(data) {
   	 
   	  if(data) {
   	  	 
   	  	  socket.nickname = data;
   	  	 
   	      socket.broadcast.emit('welcome', data + ' joined in the chat');
   	  }
   	  
   } )
   console.log('connection successful');   

   socket.on('text', getMsg.bind(socket));

   function getMsg(msg, username) {
      console.log(msg)
   	  this.broadcast.emit('text', username, msg);
   	  return this;
   }
})
app.listen(3000, function() {
	console.log('server is listening at 3000');
});
