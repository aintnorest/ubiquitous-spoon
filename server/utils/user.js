import SocketProxy from './socketProxy';

export default function User(socket, io) {
    if(!(this instanceof User)) return new User(socket, io);
    this.sp = new SocketProxy(socket, io);
    this.username = "";
    this.id = this.sp.id;
    this.currentRoom = this.id;
    this.requestGame = "";
}
//
User.prototype.setUsername = function(requestedUsername, chatObj, instanceOfSelf) {
    if(instanceOfSelf.username != "") return {response: false, reason: 'Already signed in as '+instanceOfSelf.username};
    if(chatObj.users[requestedUsername]) return {response: false, reason: 'Username already in use.'};
    if(requestedUsername.match(/^[0-9a-zA-Z]{3,16}$/)) {
        chatObj.addUser(requestedUsername, instanceOfSelf);
        this.username = requestedUsername;
        return {response: true};
    } else return {response: false, reason: 'Username must be alphanumeric and between 3 - 16 characters long.'};
};
//
User.prototype.joinRoom = function(roomName, chatObj, roles, options) {
    this.sp.join(roomName);
    this.currentRoom = roomName;
    return chatObj.joinRoom(roomName, this.username, roles, options);
};
//
User.prototype.leaveRoom = function(roomName, chatObj) {
    this.sp.leave(roomName);
    this.currentRoom = "";
    return chatObj.leaveRoom(roomName, this.username)
}
