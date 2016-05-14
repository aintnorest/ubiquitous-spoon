import WebSocket from 'ws';
//
function WebSocketServerMock() {
    this.listeners = {
        connection: [],
        error: [],
        headers: []
    };
}
//
WebSocketServerMock.prototype.on = function on(channel, cb) {
    let self = this;
    if(channel != "connection" || channel != "error" || channel != "headers") return console.log('WebSocketServerMock doesnt have a mock for on ',channel);
    self.listeners[channel].push(cb);
    return function() {
        //Easy cleanup for testing.
        self.listeners[channel].splice(self.listeners[channel].findIndex((c) => c === cb), 1);
    };
};
//
export default function WebSocketServer(server, cb) {
    return cb(server ? new WebSocket.Server({server: server.listener}) : new WebSocketServerMock());
}
