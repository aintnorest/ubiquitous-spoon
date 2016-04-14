function socketMock() {

}

export function socketProxy(socket, io) {
    if(arguments.length === 2) {
        this.socket = socket;
        this.io = io;
        this.id = socket.id;
        this.mock = false;
    } else {
        this.mock = true;
        /* Needs to be mocked.
        io.in().emit
        socket.emit
        socket.on
        socket.join
        socket.leave
        */
    }
    this.username = '';
    this.currentRoom = '';
    this.requestGameFrom = '';
    this.requestGameTo = '';
}

socketProxy.prototype.emitToRoom = function(roomName, channel, msg) {
    if(!this.mock) {
        try {
            this.io.in(roomName).emit(channel, msg);
        } catch(err) {
            console.log('Error Emitting to room: '+roomName+' on channel: '+channel+' from user: '+this.username+' Error: ',err);
        }
    }
}

socketProxy.prototype.emitToPerson = function(socket, channel, msg) {
    if(!this.mock) {
        try {
            this.socket.emit(channel, msg);
        } catch(err) {
            console.log('Error Emitting to user: '+this.username+' on channel: '+channel+' from user: '+this.username+' Error: ',err);
        }
    }
}

socketProxy.prototype.listen = function(channel, cb) {
    if(!this.mock) {
        this.socket.on(channel, cb);
    }
}

socketProxy.prototype.join = function(roomName) {
    if(!this.mock) {
        try {
            this.socket.join(roomName);
        } catch(err) {
            console.log('Error '+this.username+' joining room '+roomName+': ',err);
        }
    }
}

socketProxy.prototype.leave = function(roomName) {
    if(!this.mock) {
        try {
            this.socket.leave(roomName);
        } catch(err) {
            console.log('Error '+this.username+' leaving room '+roomName+': ',err);
        }
    }
}
