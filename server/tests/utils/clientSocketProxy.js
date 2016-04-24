import P2P from 'socket.io-p2p';
import io from 'socket.io-client';
/*
    check socket.io client for options api the ones I use for testing are as follows.
    socketOpts: {
        forceNew: true,
        multiplex: false,
    }
*/
export default function SocketProxy(url, socketOpts) {
    let socket = io(url,socketOpts);
    //
    this.sp = new P2P(socket, {peerOpts: {trickle: false}, autoUpgrade: false});
    this.p2pMode = false;
    this.username = '';
    //
}

SocketProxy.prototype.disconnect = function() {
    this.sp.disconnect();
};

SocketProxy.prototype.signIn = function(requestedUsername) {
    let self = this;
    return new Promise(function(resolve, reject) {
        let signInHandler = function(d) {
            if(d.response) {
                resolve(d);
                self.username = requestedUsername;
            } else reject(d);
            self.sp.removeListener('signIn',signInHandler);
        };
        self.sp.on('signIn', signInHandler);
        self.sp.emit('signIn',requestedUsername);
    });
};

SocketProxy.prototype.messageToRoom = function(msg) {
    let self = this;
    let tO;
    return new Promise( function(resolve, reject) {
        let id = (new Date())+(Math.round(Math.random()*100) + 1);
        let messageHandler = function(d) {
            if(d.id == id) {
                resolve(d);
                clearTimeout(tO);
                self.sp.removeListener('messageToRoom',messageHandler)
            }
        };
        tO = setTimeout(function(){reject('Timeout');self.sp.removeListener('messageToRoom',messageHandler)},15000);
        self.sp.on('messageToRoom', messageHandler);
        self.sp.emit('messageToRoom',{
            msg,
            id,
            type: 'msg',
            sender: self.username,
        });
    });
};

SocketProxy.prototype.listenToRoom = function(cb) {
    let self = this;
    let lastMsg = null;
    this.sp.on('messageToRoom',function(msg){
        if(lastMsg === msg) return;
        lastMsg = msg;
        if(msg.sender == self.username) return;
        cb(msg);
    });
};

SocketProxy.prototype.requestGame = function(un) {
    let self = this;
    return new Promise(function(resolve, reject){
        let responseHandler, upgradeHandler;
        responseHandler = function(d) {
            console.log('d',d,un);
            if(d.asked != un) return;
            reject(d);
            self.sp.removeListener('requestGame-response', responseHandler);
            self.sp.removeListener('upgradeToP2P', upgradeHandler);
        };
        upgradeHandler = function(d) {
            if(d != un) return;
            resolve(un);
            self.sp.removeListener('requestGame-response', responseHandler);
            self.sp.removeListener('upgradeToP2P', upgradeHandler);
            self.sp.upgrade();
        };
        self.sp.on('requestGame-response', responseHandler);
        self.sp.on('upgradeToP2P', upgradeHandler);
        self.sp.emit('requestGame',un);
    });
};

SocketProxy.prototype.listenForGameRequest = function(cb) {
    let requestHandler = function(d) {
        console.log('call the callback that returns a promise');
        cb(d).then(function(cbFnc) {
            console.log('am i firing the  response and upgrade?');
            self.sp.emit('requestGame-response',{response: true, asked:d.asker});
            self.sp.upgrade();
            self.sp.removeListener('requestGame', requestHandler);
            cbFnc();
        }).catch(function(cbFnc) {
            self.sp.emit('requestGame-response',{response: false, reason: d.reason, asked:d.asker});
            cbFnc();
        });
    };
    this.sp.on('requestGame', requestHandler);
};
