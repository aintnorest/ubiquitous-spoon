function createRoom(rooms, name) {
    rooms[name] = {users: [], userCount: 0};
}

export function leaveRoom(rooms, socket, io) {
    socket.leave(socket.currentRoom);
    let slot = rooms[socket.currentRoom].users.findIndex((s)=> {
        if(s === socket.username) return true;
        else return false;
    });
    rooms[socket.currentRoom].users.splice(slot, 1);
    rooms[socket.currentRoom].userCount--;
    io.sockets.in(socket.currentRoom).emit('roomUpdate', {roomName: socket.currentRoom, userList: rooms[socket.currentRoom].users});
    io.sockets.in(socket.currentRoom).emit('message', {
        sender: 'server',
        msg: socket.username+' has left the room',
        type: 'event'
    });
    socket.currentRoom = "";
}

export function joinRoom(roomName, rooms, socket, io) {
    socket.join(roomName);
    rooms[roomName].users.push(socket.username);
    rooms[roomName].userCount++;
    socket.currentRoom = roomName;
    io.sockets.in(roomName).emit('roomUpdate', {roomName: roomName, userList: rooms[roomName].users});
    io.sockets.in(roomName).emit('messageToRoom', {
        sender: 'server',
        msg: socket.username+' has joined the room',
        type: 'event'
    });
}

export default function(rooms, users, io) {
    return function(socket) {
        console.log('Connecting: ',socket.id);
        //Sign in
        socket.on('signIn', function(username) {
            if(users[username]) {
                socket.emit('usernameInvalid');
            } else {
                console.log(username+' Connecting');
                socket.emit('usernameValid');
                socket.username = username;
                socket.requestGameFrom = '';
                users[username] = socket;
                joinRoom('mainRoom', rooms, socket, io);
            }
        });
        //Disconnect
        socket.on('disconnect', function() {
            if(socket.username) {
                leaveRoom(rooms, socket, io)
                delete users[socket.username];
            }
            console.log(socket.id + ' Disconnected');
        });
        //Errors
        socket.on('error', function(d) {
            console.log(socket.username+ " ERROR: ",d);
        });
        //Messages
        socket.on('messageToRoom', function(data) {
            io.in(socket.currentRoom).emit('messageToRoom', {
                sender: socket.username,
                msg: data,
                type: 'msg'
            });
        });
        //Request Game
        socket.on('requestGame', function(usersName) {
            if(users[usersName]) {
                socket.requestGameFrom = users[usersName].id.valueOf();
                users[usersName].emit('requestGame',{ asker: socket.username });
            } else {
                socket.emit('requestGame-response', {answer: false, reason:"User no longer exists."});
            }
        });
        //Answer Request
        socket.on('requestGame-response', function(d) {
            if(d.answer) {
                if(users[d.asker].requestGameFrom === socket.id.valueOf()) {
                    let nrn = socket.username + users[d.asker].username + (Math.round(Math.random()*100) + 1);
                    leaveRoom(rooms, socket, io);
                    rooms[nrn] = createRoom(rooms, nrn);
                    joinRoom(nrn, rooms, socket, io);
                    io.sockets.in(rnr).emit('upgradeToP2P');
                } else {
                    io.sockets.connected[users[d.asker].id].emit('requestGame-response',{answer: false, reason:"User has requested a game from another player."});
                }
            } else {
                users[d.asker].requestGameFrom = "";
                io.sockets.connected[users[d.asker].id].emit('requestGame-response',{answer: false, reason: d.reason});
            }
        });
        //
        //
    }
}
