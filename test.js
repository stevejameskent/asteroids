var express = require('express');
var app = express();
var http = require('http')
var server = http.Server(app);
var io = require('socket.io')(server);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket) {
    console.log('a user connected');
});

server.listen(server_port, function() {
    console.log('listening on *:' + server_port);
});