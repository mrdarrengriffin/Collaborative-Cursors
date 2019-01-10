var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var game = {
players:{}
}

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', function (socket) {

    game.players = {}
    Object.keys(io.sockets.sockets).forEach((v, i) => {
        var user = io.sockets.sockets[v]
        game.players[user.id] = { id: user.id, ip: user.handshake.address }
    })

    socket.broadcast.emit('userJoin',{id:socket.id,ip:socket.handshake.address})
    
    socket.on('move',m=>{
        socket.broadcast.emit('move',{id:socket.id,x:m.x,y:m.y})
    })

    socket.on('getUsers',()=>{
        socket.emit('users',game.players)
    })
    
    socket.on('disconnect', () => {
        io.emit('userLeave',socket.id)
    })
})

http.listen(3000, function () {
    console.log('listening on *:3000')
})