export default function Chat(initialRooms = {}) {
    this.users = {};
    //future proofing, Just incase I need to start managing connections on a more granular level;
    this.connections = {};
    this.rooms = initialRooms;
}
//
Chat.prototype.addUser = function(username, u) {
    if(this.users[username]) return false;
    this.users[username] = u;
    return true;
};
//
Chat.prototype.removeUser = function(username) {
    if(!this.users[username]) return;
    delete this.users[username];
}
//
Chat.prototype.joinRoom = function(roomName, username, roles = {}, options = {}) {
    if(this.rooms[roomName]) {
        this.rooms[roomName].userList.push(username);
    } else {
        this.rooms[roomName] = {userList: [], roles, options};
        this.rooms[roomName].userList.push(username);
    }
    return {roomName, userList: this.rooms[roomName].userList};
};
//
Chat.prototype.leaveRoom = function(roomName, username) {
    if(this.rooms[roomName]) {
        let slot = this.rooms[roomName].userList.findIndex((s) => {
            if(s === username) return true;
            else return false;
        });
        this.rooms[roomName].userList.splice(slot,1);
        if(this.rooms[roomName].userList.length === 0 && !this.rooms[roomName].options.permanent) {
            delete this.rooms[roomName];
            return {roomName};
        }
        return {roomName, userList: this.rooms[roomName].userList}
    }
    return {roomName};
};
