
export default function(mainRoom, users, io) {
    return function(socket) {
        //Sign in
        socket.on('signIn', function(username) {
            if(users[username]) {
                socket.emit('usernameInvalid');
            } else {
                socket.emit('usernameValid');
                socket.username = username;
                users[username] = socket;
                mainRoom.userCount++;
                mainRoom.users.push(username);
                socket.join(mainRoom.name);
                io.sockets.in(mainRoom.name).emit('message', {
                    sender: 'server',
                    msg: username+' has entered the room',
                    type: 'event'
                });
                io.sockets.in(mainRoom.name).emit('usersUpdate', mainRoom.users);
                //Disconnect Handler
                socket.on('disconnect', function() {
                    delete users[socket.username];
                    let slot = mainRoom.users.findIndex((s)=> {
                        if(s === username) return true;
                        else return false;
                    });
                    mainRoom.users.splice(slot, 1);
                    mainRoom.userCount--;
                });
            }
        });
        //Messages from main room
        socket.on('mainRoom-msg', function(data) {
            io.sockets.in(mainRoom.name).emit('message', {
                sender: socket.username,
                msg: data,
                type: 'msg'
            });
        });
        //
    }
}
