function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object" && o !== null) return o;
    } catch (e) {
        console.log('Failed parsing JSON, original string is: ',jsonString,' Error: ',e);
    }
    return jsonString;
};
//
function NWS(ws, cleanup) {
    let self = this;
    //
    this.messageListeners = {};
    this.ws = ws;
    this.ws.on('message', function(d) {
        let msg = tryParseJSON(d);
        Object.keys(self.messageListeners).forEach((channel) => {
            if(channel == msg.channel) {
                self.messageListeners[channel].forEach((cb) => {cb(msg.msg)});
            }
        });
    });
    this.ws.on('close', function(){
        cleanup();
    });
}
//
NWS.prototype.close = function() {
    this.ws.close();
};
//
NWS.prototype.on = function(channel, cb) {
    let self = this;
    if(!self.messageListeners[channel]) self.messageListeners[channel] = [cb];
    else self.messageListeners[channel].push(cb);
    return function() {
        self.messageListeners[channel].splice(self.messageListeners[channel].findIndex((c) => c === cb), 1);
    };
};
//
NWS.prototype.emit = function(channel, msg) {
    try {
        this.ws.send(JSON.stringify({channel, msg}));
    } catch(err) {
        //
    }
};
//
//
export default function User(ws, cleanup) {
    this.wsp = new NWS(ws, cleanup);
    this.username = "";
    this.previousRoom = "";
    this.currentRoom = "";
    this.requestGame = [];
    this.inGame = false;
};

User.prototype.signIn = function(username, r, userList) {
    if(r.response) this.username = username;
    this.wsp.emit('signIn',{...r, userList});
};

User.prototype.joinRoom = function(roomName, roomUpdate, chat) {
    this.currentRoom = roomName;
    chat.rooms[roomName].userList.forEach(name => {
        if(!chat.users[name]) return console.log('User is logged out.');
        chat.users[name].wsp.emit('roomUpdate', roomUpdate);
        chat.users[name].wsp.emit('messageToRoom', {
            sender: 'server',
            msg: this.username+' has joined the room.',
            type: 'event'
        });
    });
};

User.prototype.leaveRoom = function(roomUpdate, chat) {
    let room = this.currentRoom;
    this.previousRoom = room;
    this.currentRoom = "";
    chat.rooms[room].userList.forEach(name => {
        chat.users[name].wsp.emit('roomUpdate', roomUpdate);
        chat.users[name].wsp.emit('messageToRoom', {
            sender: 'server',
            msg: this.username+' has left the room.',
            type: 'event'
        });
    });
};

User.prototype.messageToRoom = function(msg,chat) {
    function validate() {
        if(this.username === "") return {error: 'Must be signed in to send messages', endpoint:'messageToRoom'};
        if(chat.rooms[this.currentRoom] === undefined) return {error: 'User must be in an active room', endpoint:'messageToRoom'};
        if(typeof msg != 'object') return {error: 'Message sent to room was not an object', endpoint:'messageToRoom'};
        if(msg.msg && msg.id && msg.timestamp) return false;
        return {error: 'Message didnt have the proper structure. Requires msg, id, & timestamp.', endpoint:'messageToRoom'};
    }
    let result = validate.call(this);
    if(result) this.wsp.emit('error',result);
    else {
        msg.type = 'msg';
        msg.sender = this.username;
        chat.rooms[this.currentRoom].userList.forEach(name => {
            chat.users[name].wsp.emit('messageToRoom', msg);
        });
    }
};

User.prototype.beginGame = function() {
    this.requestGame = [];
    this.inGame = true;
};

User.prototype.iceCandidate = function(candidate, chat) {
    let room = chat.rooms[this.currentRoom];
    if(this.username === '') {
        console.log('User Not Logged in attempting to update iceCandidate');
        return;
    }
    if(!room.options && !room.options.gameRoom) {
        console.log('User is not in a game room and is attempting to update iceCandidate');
        return;
    }
    room.userList.forEach(name => {
        if(name === this.username) return;
        chat.users[name].wsp.emit('addIceCandidate', candidate);
    });
};

User.prototype.setLocalDescription = function(description, chat) {
    console.log('set localDescription');
    let room = chat.rooms[this.currentRoom];
    if(this.username === '') {
        console.log('User Not Logged in attempting to set local description');
        return;
    }
    if(!room.options && !room.options.gameRoom) {
        console.log('User is not in a game room and is attempting to set local description');
        return;
    }
    room.userList.forEach(name => {
        if(name === this.username) return;
        chat.users[name].wsp.emit('setLocalDescription', description);
    });
};

/*
import SocketProxy from './socketProxy';

export default function User(socket, io) {
    if(!(this instanceof User)) return new User(socket, io);
    this.io = io;
    this.sp = new SocketProxy(socket, io);
    this.username = "";
    this.previousRoom = "";
    this.currentRoom = "";
    this.requestGame = [];
    this.inGame = false;
}

User.prototype.signIn = function(username, r) {
    if(r.response) this.username = username;
    this.sp.emit('signIn',r);
};

User.prototype.joinRoom = function(roomName, roomUpdate) {
    this.currentRoom = roomName;
    this.sp.join(roomName);
    this.sp.in(roomName).emit('roomUpdate', roomUpdate);
    this.sp.in(roomName).emit('messageToRoom', {
        sender: 'server',
        msg: this.username+' has joined the room.',
        type: 'event'
    });
};

User.prototype.leaveRoom = function(roomUpdate) {
    let room = this.currentRoom;
    this.previousRoom = room;
    this.currentRoom = "";
    this.sp.leave(room);
    this.sp.in(room).emit('roomUpdate', roomUpdate);
    this.sp.in(room).emit('messageToRoom', {
        sender: 'server',
        msg: this.username+' has left the room.',
        type: 'event'
    });
};

User.prototype.messageToRoom = function(msg) {
    function validate() {
        if(this.username === "") return {error: 'Must be signed in to send messages', endpoint:'messageToRoom'};
        if(typeof msg != 'object') return {error: 'Message sent to room was not an object', endpoint:'messageToRoom'};
        if(msg.msg && msg.id && msg.timestamp) return false;
        return {error: 'Message didnt have the proper structure. Requires msg, id, & timestamp.', endpoint:'messageToRoom'};
    }
    let result = validate.call(this);
    if(result) this.sp.emit('error',result);
    else {
        msg.type = 'msg';
        msg.sender = this.username;
        this.io.to(this.currentRoom).emit('messageToRoom', msg);
    }
};

User.prototype.beginGame = function() {
    this.requestGame = [];
    this.inGame = true;
};
*/
