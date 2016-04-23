export default function socketProxy(socket, io) {
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
}

socketProxy.prototype.in = function(roomName) {
    if(!this.mock) {
        let self = this;
        return {
            emit(channel, msg) {
                try {
                    self.io.sockets.in(roomName).emit(channel, msg);
                } catch(err) {
                    console.log('Id: '+self.id+", Room: "+roomName+", emit Error: ",err);
                }
            }
        }
    }
}

socketProxy.prototype.on = function(channel, cb) {
    if(!this.mock) {
        this.socket.on(channel,cb);
    }

}

socketProxy.prototype.join = function(roomName) {
    if(!this.mock) {
        this.socket.join(roomName);
    }
}

socketProxy.prototype.leave = function(roomName) {
    if(!this.mock) {
        this.socket.leave(roomName);
    }
}

socketProxy.prototype.emit = function(channel, msg) {
    if(!this.mock) {
        try {
            this.socket.emit(channel,msg);
        } catch(err) {
            console.log('Id: '+this.id+", emit Error: ",err);
        }
    }
}
