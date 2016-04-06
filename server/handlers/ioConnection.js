export default function(clients, mainRoom) {
    return function(socket) {
        clients[socket.id] = socket;
        mainRoom.chatterCount++;
        mainRoom.chatters.push(socket);
        socket.join(mainRoom.name);
        //Error Handler
        socket.on('error', function (err) {
            console.log("Error %s", err);
        });
        //Disconnect Handler
        socket.on('disconnect', function() {
            delete clients[socket.id];
            let slot = mainRoom.chatters.findIndex((s)=> {
                if(s === socket) return true;
                else return false;
            });
            mainRoom.chatters.splice(slot, 1);
            mainRoom.chatterCount--;
        });
        //Messages from main room
        socket.on('mainRoom-msg', function(data) {
            socket.broadcast.to(mainRoom.name).emit('message',msg);
        });
        //

        /*
        socket.on('peer-msg', function(data) {
            console.log('Message from peer: %s', data);
            socket.broadcast.emit('peer-msg', data);
        });

        socket.on('go-private', function(data) {
            socket.broadcast.emit('go-private', data);
        });
        */
    }
}
