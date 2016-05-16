export default function Chat(initialRooms = {}) {
    this.users = {};
    //future proofing, Just incase I need to start managing connections on a more granular level;
    this.connections = {};
    this.rooms = initialRooms;
}
//
Chat.prototype.addUser = function addUser(user, requestedUsername) {
    function validate() {
        if(user.username != "") return {response: false, reason: "User already signed in."};
        if(typeof requestedUsername != "string") return {response: false, reason: "Username should be a string."};
        if(!requestedUsername.match(/^[0-9a-zA-Z]{3,16}$/)) return {response: false, reason: 'Username must be alphanumeric and between 3 - 16 characters long.'};
        if(this.users[requestedUsername]) return {response: false, reason: 'Username already in use.'};
        return {response: true};
    }
    //
    let r = validate.call(this);
    //
    if(r.response) {
        this.users[requestedUsername] = user;
        user.signIn(requestedUsername, r);
        this.joinRoom('mainRoom', user);
    } else user.signIn(requestedUsername, r);
};
//
Chat.prototype.joinRoom = function joinRoom(roomName, user, roles = {}, options = {}) {
    if(this.rooms[roomName]) this.rooms[roomName].userList.push(user.username);
    else this.rooms[roomName] = {userList: [user.username], roles, options};
    //
    user.joinRoom(roomName, {roomName, userList: this.rooms[roomName].userList}, this);
};
//
Chat.prototype.removeUser = function disconnect(user) {
    if(user.username == "") return;
    this.leaveRoom(user);
    delete this.users[user.username];
};
//
Chat.prototype.leaveRoom = function leaveRoom(user) {
    let roomName = user.currentRoom;
    if(this.rooms[roomName]) {
        let slot = this.rooms[roomName].userList.findIndex((s) => s === user.username);
        this.rooms[roomName].userList.splice(slot,1);
        if(this.rooms[roomName].userList.length === 0 && !this.rooms[roomName].options.permanent) delete this.rooms[roomName];
        else user.leaveRoom({roomName, userList: this.rooms[roomName].userList}, this);
    }
};
//
//
Chat.prototype.requestGame = function requestGame(requestedUser, user) {
    function validate() {
        if(typeof requestedUser != 'string' || requestedUser == "") return {error: 'Requested User is required to be a string 3 to 16 characters long.'};
        if(user.username == "") return {error: 'You must be signed in to request a game.'};
        let rU = this.users[requestedUser];
        if(!rU) return {error: 'User is no longer connected.'};
        if(rU.inGame) return {error: 'User is already in a game.'};
        return {asker: user.username};
    }

    let r = validate.call(this);
    if(r.error) return user.wsp.emit('requestGame',r);
    user.requestGame.push(requestedUser);
    this.users[requestedUser].wsp.emit('requestGame',r);
};
//
Chat.prototype.requestGameResponse = function requestGameResponse(answr, user) {
    function validate() {
        if(typeof answr != 'object') return {error: "Response is in the wronge format.", endpoint:'requestGame-response'};
        if(user.username == "") return {error: "You must be signed in to respond to a game request.", endpoint:'requestGame-response'};
        if(!answr.asker || answr.response === undefined) return {error: "Request game response requires a asker and a response.", endpoint:'requestGame-response'};
        if(!this.users[answr.asker]) return {error: answr.asker+" is no longer signed in.", endpoint:'requestGame-response'};
        if(this.users[answr.asker].inGame) return {error: answr.asker+" has already started a game.", endpoint:'requestGame-response'};
        if(this.users[answr.asker].requestGame.find((n) => n === user.username) !== user.username) return {error: answr.asker+' is no longer requesting a game.', endpoint:'requestGame-response'};
        return {};
    }
    let v = validate.call(this);
    console.log('answer: ',answr, v);
    if(v.error) return user.wsp.emit('error',v);
    let asker = this.users[answr.asker];
    if(!answr.response) {
        asker.requestGame = asker.requestGame.filter((n)=> n != user.username);
        asker.wsp.emit('requestGame-response',answr);
    } else {
        asker.beginGame();
        user.beginGame();
        let nrn = user.username + asker.username + (Math.round(Math.random()*100) + 1);
        this.leaveRoom(asker);
        this.joinRoom(nrn, asker, {player1:asker.username, player2:user.username}, {gameRoom:true});
        this.leaveRoom(user);
        this.joinRoom(nrn, user);
        this.rooms[nrn].userList.forEach(name => {
            this.users[name].wsp.emit('requestGame-response',answr);
        });
    }
};
