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
export default function SocketProxy(url, protocols = {}) {
    let self = this;
    this.ws = new WebSocket(url);
    this.pc = new RTCPeerConnection({
        iceServers: [{ 'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]
    },{
        optional: [{RtpDataChannels: false}]
    });
    this.dataChannel = undefined;
    /*
    this.pc = new RTCPeerConnection({
        iceServers: [{ 'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]
    },{
        optional: [{RtpDataChannels: false}]
    });
    this.pc.onicecandidate = function(e) {
        if (!e || !e.candidate) return;
        let o;
        try {
            o = e.candidate.toJSON();
        } catch(err) {
            console.log('error trying toJSON on ice candidate: ',err);
        }
        o = e.candidate;
        try {
            if(typeof o === 'string') o = JSON.parse(o);
        } catch(err) {
            console.log('trouble is inside on ice: ',err);
        }
        self.iceCandidate = o;
        self.emit('iceCandidate',self.iceCandidate);
    };
    this.iceCandidate = undefined;
    this.dataChannel = undefined;
    this.p2pMode = false;
    */
    this.ready = false;
    this.username = '';
    this.messageListeners = {};
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
        self.buffer.forEach(function(msg) {
            self.emit(msg.channel, msg.msg);
        });
    };
}
//
SocketProxy.prototype.listenForUpgradeToP2P = function(cb) {
    let self = this;
    self.on('setLocalDescription', function(msg) {
        console.log('setLocalDescription, ',msg);
        self.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), function() {
            if(self.pc.remoteDescription.type == 'offer') {
                self.pc.createAnswer(function(desc){
                    self.pc.setLocalDescription(desc, function () {
                        self.emit('setLocalDescription',self.pc.localDescription);
                    }, function(err){ console.log("Error setting localDescription inside answer: ",err); });
                }, function(err){
                    console.log('Error creating answer: ',err);
                });
            }
        });
    });
};
//
SocketProxy.prototype.upgradeToP2P = function(resolve) {
    let self = this;
    this.dataChannel = this.pc.createDataChannel('gameChannel');
    self.dataChannel.onopen = function(d) {
        console.log('Data channel opened: ',d);
    };
    self.dataChannel.onerror = function(err) { console.log('DataChannel Error: ',err); };
    // send any ice candidates to the other peer
    self.pc.onicecandidate = function (e) {
        if (!e || !e.candidate) return;
        console.log(e);
    };
    // let the 'negotiationneeded' event trigger offer generation
    self.pc.onnegotiationneeded = function () {
        console.log('negotiation Needed')
        self.pc.createOffer(function(desc) {
            self.pc.setLocalDescription(desc, function () {
                self.emit('setLocalDescription',self.pc.localDescription);
            }, function(err) { console.log('Set Local Description Error: ',err); });
        }, function(err) { console.log('Create Offer Error: ',err); });
    }
    /*
    let self = this;
    this.dataChannel = this.pc.createDataChannel('gameChannel');
    this.pc.createOffer(function(offer) {
        self.pc.setLocalDescription(offer, function() {
            let o;
            try {
                o = offer.toJSON();
            } catch(err) {
                console.log('inside set local description to JSON giving a problem: ',err);
            }
            if(typeof o === 'string'){
                try {
                    o = JSON.parse(o);
                } catch(err) {
                    console.log('Error parsing o for sld : ',err);
                }
            }
            self.emit('setLocalDescription',o);
        }, function(err) {
            console.log('setLocalDescription error: ',err);
        });
    }, function(err) {
        console.log('createOffer error: ',err);
    });
    */
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
                /*
                self.upgradeToP2P();
                self.dataChannel.onopen = function(d) {
                    console.log('Data channel opened: ',d);
                };
                self.dataChannel.onerror = function(err) { console.log('DataChannel Error: ',err); };
                iceHandlerUnsub = self.on('addIceCandidate', function(candidate) {
                    console.log('candidate: ',candidate);
                    self.pc.addIceCandidate(new RTCIceCandidate(candidate));
                    iceHandlerUnsub();
                });
                localDescriptionUnsub = self.on('setLocalDescription', function(msg) {
                    console.log('does it get here?',msg);
                    var answer = new RTCSessionDescription(msg);
                    self.pc.setLocalDescription(answer, function() {});
                    console.log('ice candidate is : ',self.iceCandidate);
                    if(self.iceCandidate) self.emit('iceCandidate',self.iceCandidate);
                    self.p2pMode = true;
                    localDescriptionUnsub();
                    resolve(d);
                });
                */
                resolve(d);
            } else reject(d);
            responseHandlerUnsub();
        };
        responseHandlerUnsub = self.on('requestGame-response', responseHandler);
        console.log('Emit this request for game: ',un);
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
        console.log('handler for requestGame',d);
        cb(d).then(function(cbFnc) {
            self.emit('requestGame-response', { response: true, asker:d.asker});
            self.listenForUpgradeToP2P(cbFnc);
            requestHandlerSub();
            /*
            self.pc.ondatachannel = function(event) {
                self.dataChannel = event.channel;
                self.dataChannel.onopen = function(d) {
                    console.log('Data channel opened: ',d);
                    cbFnc();
                };
                self.dataChannel.onerror = function(err) { console.log('DataChannel Error: ',err); };
            };
            setLocalDescriptionSub = self.on('setLocalDescription', function(offer) {
                console.log('how about here sld',offer);
                offer = new RTCSessionDescription(offer);
                console.log('right after SessionDescription');
                self.pc.setRemoteDescription(offer);

                self.pc.createAnswer(function (answer) {
                    self.pc.setRemoteDescription(answer, function() {
                        self.emit("setLocalDescription", JSON.stringify(self.pc.localDescription));
                    }, function(err) { console.log('Set local description Error: ',err); });
                }, function(err) { console.log('Create Answer Error: ',err); });

                setLocalDescriptionSub();
            });
            iceHandlerSub = self.on('addIceCandidate', function(candidate) {
                console.log('candidate add Ice',candidate);
                self.pc.addIceCandidate(new RTCIceCandidate(candidate));
                iceHandlerSub();
            });
            */
        }).catch(function(reason, cbFnc) {
            console.log('here?',d.asker,reason);
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
