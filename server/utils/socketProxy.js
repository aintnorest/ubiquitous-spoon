export default function SocketProxy(socket, io) {
    if(arguments.length === 2) {
        return new socketProxy(socket,io);
    } else {
        return new socketMock();
    }
}

function randomString() {
    return Math.random().toString(36).slice(2)
}

export function socketMock() {
    let self = this;
    //Create the mock.
    self.id = randomString();
    self.serverChannels = {};
    self.clientChannels = {};
    self.currentRoom = self.id;
    //
    self.clientSocket = {
        on(channel, cb) {
            if(self.clientChannels[channel]) {
                self.clientChannels[channel].push(cb);
            } else {
                self.clientChannels[channel] = [cb];
            }
        },
        emit(channel, cb) {
            if(self.serverChannels[channel]) {
                self.serverChannels[channel].forEach((cb) => {
                    cb(msg);
                });
            }
        }
    }
}

export function socketProxy(socket, io) {
    this.socket = socket;
    this.io = io;
    this.id = socket.id;
}

socketProxy.prototype.in = function(roomName) {
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

socketProxy.prototype.on = function(channel, cb) {
    this.socket.on(channel,cb);
}

socketMock.prototype.on = function(channel, cb) {
    if(this.serverChannels[channel]) {
        this.serverChannels[channel].push(cb);
    } else {
        this.serverChannels[channel] = [cb];
    }
}

socketProxy.prototype.emit = function(channel, msg) {
    try {
        this.socket.emit(channel,msg);
    } catch(err) {
        console.log('Id: '+this.id+", emit Error: ",err);
    }
}

socketMock.prototype.emit = function(channel, msg) {
    if(this.clientChannels[channel]) {
        this.clientChannels[channel].forEach((cb) => {
            cb(msg);
        });
    }
}

socketMock.prototype.broadcast = function(channel, msg) {
    console.log('channel: ',channel," msg: ",msg);
}

socketProxy.prototype.join = function(roomName) {
    this.socket.join(roomName);
}

socketMock.prototype.join = function(roomName) {
    self.currentRoom = roomName;
}

socketProxy.prototype.leave = function(roomName) {
    this.socket.leave(roomName);
}

socketMock.prototype.leave = function() {
    self.currentRoom = "";
}
