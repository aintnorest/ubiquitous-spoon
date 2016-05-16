
import "webrtc-adapter";
//
function tryParseJSON (jsonString){
    let o;
    try {
        o = JSON.parse(jsonString);
    } catch(e) {
        console.log('Failed parsing JSON, original string is: ',jsonString,' Error: ',e);
    }
    if (o && typeof o === "object" && o !== null) return o;
    return jsonString;
};
//
function localDescCreated(desc) {
    let self = this;
    self.pc.setLocalDescription(desc, function () {
        console.log(self.username,'set local description');
        self.emit('setLocalDescription',self.pc.localDescription);
    }, function(err) {
        console.log('localDescCreated error: ',err);
    });
}
//
export default function SocketProxy(url, protocols = {}) {
    let self = this;
    this.ws = new WebSocket(url);
    this.pc = new RTCPeerConnection({
        iceServers: [{ 'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]
    },{
        optional: [{RtpDataChannels: false}]
    });
    this.dataChannel = undefined;
    this.p2p = {};
    this.p2pMode = false;
    this.ready = false;
    this.username = '';
    this.p2pMessageListeners = {};
    this.messageListeners = {};
    this.WSopenListener = [];
    this.WScloseListener = [];
    this.ws.onmessage = function (msg) {
        if(msg.origin != url) return;
        let parsedMsg = tryParseJSON(msg.data);
        Object.keys(self.messageListeners).forEach((channel) => {
            if(channel == parsedMsg.channel) {
                self.messageListeners[channel].forEach((cb) => {cb(parsedMsg.msg)});
            }
        });
    };
    this.buffer = [];
    this.ws.onopen = function() {
        self.ready = true;
        self.WSopenListener.forEach((cb) => {
            cb();
        });
        self.buffer.forEach(function(msg) {
            self.emit(msg.channel, msg.msg);
        });
        self.on('addIceCandidate', function(candidate) {
            console.log(self.username,' add ice candidate');
            self.pc.addIceCandidate(new RTCIceCandidate(candidate));
        });
    };
    this.ws.onclose = function() {
        self.WScloseListener.forEach((cb) => {
            cb();
        });
    };
}
//
SocketProxy.prototype.setupP2Pmessaging = function(callBack) {
    let self = this;
    self.dataChannel.onmessage = function(msg) {
        let parsedMsg = tryParseJSON(msg.data);
        Object.keys(self.p2pMessageListeners).forEach((channel) => {
            if(channel == parsedMsg.channel) self.p2pMessageListeners[channel].forEach((cb) => {cb(parsedMsg.msg)})
        })
    };
    self.p2p.on = function(channel, cb) {
        if(!self.p2pMessageListeners[channel]) self.p2pMessageListeners[channel] = [cb];
        else self.p2pMessageListeners[channel].push(cb);
        return function() {
            self.p2pMessageListeners[channel].splice(self.p2pMessageListeners[channel].findIndex((c) => c === cb), 1);
        }
    };
    self.p2p.emit = function(channel, msg) {
        self.dataChannel.send(JSON.stringify({channel,msg}));
    };
    if(typeof callBack === 'function') callBack();

};
//
SocketProxy.prototype.onWSopen = function(cb) {
    let self = this;
    this.WSopenListener.push(cb);
    return function() {
        self.WSopenListener = self.WSopenListener.filter(function(c){
            if(c !== cb) return true;
            else return false;
        });
    }
};
//
SocketProxy.prototype.onWSclose = function(cb) {
    let self = this;
    this.WScloseListener.push(cb);
    return function() {
        self.WScloseListener = self.WScloseListener.filter(function(c){
            if(c !== cb) return true;
            else return false;
        });
    }
};
//
SocketProxy.prototype.listenForUpgradeToP2P = function(cb) {
    let self = this;

    self.on('setLocalDescription', function(msg) {
        console.log(self.username, ' setRemoteDescription');
        self.pc.setRemoteDescription(new RTCSessionDescription(msg), function() {
            if(self.pc.remoteDescription.type == 'offer') {
                console.log(self.username,' create answer');
                self.pc.createAnswer(localDescCreated.bind(self), function(err){ console.log('Error creating answer: ',err); });

                self.pc.onicecandidate = function (e) {
                    if (!e || !e.candidate) return;
                    console.log(self.username, ' ice candidate on');
                    self.emit('iceCandidate', e.candidate);
                };
            }
        });
    });

    self.pc.ondatachannel = function (evt) {
        self.p2pMode = true;
        console.log(self.username,' Data channel opened: ');
        self.dataChannel = evt.channel;
        self.setupP2Pmessaging(cb);
    };
};
//
SocketProxy.prototype.upgradeToP2P = function(resolve) {
    let self = this;
    console.log(self.username,' create Data Channel');
    this.dataChannel = this.pc.createDataChannel('gameChannel');
    self.dataChannel.onopen = function(d) {
        console.log(self.username,' Data channel opened: ',d);
        self.p2pMode = true;
        self.setupP2Pmessaging();
        resolve();
    };
    self.dataChannel.onerror = function(err) { console.log('DataChannel Error: ',err); };

    self.pc.onnegotiationneeded = function () {
        console.log(self.username, 'create offer');
        self.pc.createOffer(localDescCreated.bind(self), function(err) { console.log('Create Offer Error: ',err); });
    };

    self.on('setLocalDescription', function(msg) {
        console.log(self.username, ' set remote description');
        self.pc.setRemoteDescription(new RTCSessionDescription(msg), function() {
            self.pc.onicecandidate = function (e) {
                if (!e || !e.candidate) return;
                console.log(self.username, ' ice candidate on');
                self.emit('iceCandidate', e.candidate);
            };
        });
    });
};
//
SocketProxy.prototype.on = function(channel, cb) {
    let self = this;
    if(!self.messageListeners[channel]) self.messageListeners[channel] = [cb];
    else self.messageListeners[channel].push(cb);
    return function() {
        self.messageListeners[channel].splice(self.messageListeners[channel].findIndex((c) => c === cb), 1);
    };
};
//
SocketProxy.prototype.emit = function(channel, msg) {
    if(this.ready) this.ws.send(JSON.stringify({channel, msg}));
    else this.buffer.push({channel, msg});
};
/**
 * @endpoint disconnect - disconnect from server.
 */
SocketProxy.prototype.disconnect = function() { this.ws.close(); };
/**
 * @endpoint signIn - request sign in.
 *
 * @parameter {String} username user requests. Should be alphanumeric and between 3 - 16 characters long.
 *
 * @Return {Promise} timeout 20 seconds.
 *  resolve: {Boolean} true
 *  reject: {Object} {}
 *      response: {Boolean} false,
 *      reason: {String} "Reason why it wasn't accepted"
 *  }
 */
SocketProxy.prototype.signIn = function(requestedUsername) {
    let self = this;
    let signInHandlerUnsub, tO;
    return new Promise(function(resolve, reject) {
        let signInHandler = function(d) {
            if(d.response) {
                resolve(d);
                self.username = requestedUsername;
            } else reject(d);
            clearTimeout(tO);
            signInHandlerUnsub();
        };
        signInHandlerUnsub = self.on('signIn',signInHandler);
        tO = setTimeout(function(){ reject('Timeout'); signInHandlerUnsub(); },20000);
        self.emit('signIn', requestedUsername);
    });
};
/**
 * @endpoint messageToRoom - message.
 *
 * @parameter {Object} {
 *  msg: {String} the message,
 * }
 *
 * @Return {Promise} timeout 20 seconds.
 *  resolve: {Object} Responds with message
 *  reject: {String} Says 'Timeout'
 *  }
 */
SocketProxy.prototype.messageToRoom = function(msg) {
    let self = this;
    let tO, messageHandlerUnsub;
    return new Promise( function(resolve, reject) {
        let id = Math.random().toString(36).slice(2);
        let messageHandler = function(d) {
            if(d.id === id) {
                resolve(d);
                clearTimeout(tO);
                messageHandlerUnsub();
            }
        };
        tO = setTimeout(function(){ reject('Timeout'); messageHandlerUnsub(); },20000);
        messageHandlerUnsub = self.on('messageToRoom',messageHandler);
        self.emit('messageToRoom', {
            msg,
            id,
            timestamp: Date.now(),
            type: 'msg',
            sender: self.username
        });
    });
};
/**
 * @endpoint listenToRoom - setup listener for the room.
 *
 * @parameter {Function} that handles messages. It will ignore any with u as the sender and only pass through others.
 */
SocketProxy.prototype.listenToRoom = function(cb) {
    let self = this;
    let lastMsg = null;
    return self.on('messageToRoom', function(msg){
        if(lastMsg === msg.id) return console.log('duplicate msg');
        lastMsg = msg.id;
        if(msg.sender == self.username) return;
        cb(msg);
    });
};
/**
 * @endpoint requestGame - request game of another player.
 *
 * @parameter {String} - Username of the player your requesting a game from.
 *
 * @Return {Promise} -
 *  resolve: {Object} {response:{Boolean}}
 *  reject: {Object} {response:{Boolean}, reason:{string}}
 */
SocketProxy.prototype.requestGame = function(un) {
    let self = this;
    return new Promise( function(resolve, reject) {
        let responseHandler, responseHandlerUnsub, iceHandlerUnsub, localDescriptionUnsub;
        responseHandler = function(d) {
            if(d.response) {
                self.upgradeToP2P(resolve);
            } else reject(d);
            responseHandlerUnsub();
        };
        responseHandlerUnsub = self.on('requestGame-response', responseHandler);
        self.emit('requestGame',un);
    });
};
/**
 * @endpoint listenForGameRequest - listen for request game from another player.
 *
 * @parameter {Function} - That returns a promise when it's called. It will be called everytime you get a request. Function is called with requestGame param.
 *
 * @{Promise that you return from Function} -
 *  resolve: {Function} - Callback to fire after.
 *  reject:  {Function} - Callback to fire after.
 */
SocketProxy.prototype.listenForGameRequest = function(cb) {
    let self = this;
    let requestHandlerSub;
    let requestHandler = function(d) {
        cb(d).then(function(cbFnc) {
            self.emit('requestGame-response', { response: true, asker:d.asker});
            self.listenForUpgradeToP2P(cbFnc);
            requestHandlerSub();
        }).catch(function(reason, cbFnc) {
            self.emit('requestGame-response',{response: false, reason, asker:d.asker});
            if(typeof cbFnc == 'function') cbFnc();
        });
    };
    try {
        requestHandlerSub = self.on('requestGame', requestHandler);
    } catch(err) {
        console.log('error setuping listner for requestGame: ',err);
    }
};
