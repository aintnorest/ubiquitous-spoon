import socketProxy from '../utils/socketProxy';
//
function createRoom(rooms, name, roles = {}) {
    rooms[name] = {userList: [], roles};
}
//
export function joinRoom(roomName, usersInfo, username, rooms, sp) {
    sp.join(roomName);
    rooms[roomName].userList.push(username);
    usersInfo.currentRoom = roomName;
    sp.in(roomName).emit('roomUpdate', {roomName, userList: rooms[roomName].userList});
    sp.in(roomName).emit('messageToRoom', {
        sender: 'server',
        msg: username+' has joined the room.',
        type: 'event'
    });
}
//
export function leaveRoom(sp, userInfo, username, rooms) {
    sp.leave(userInfo.currentRoom);
    let start = rooms[userInfo.currentRoom].userList.findIndex((s) => {
        if(s === username) return true;
        else return false;
    })
    rooms[userInfo.currentRoom].userList.splice(start, 1);
    if(rooms[userInfo.currentRoom].userList.length > 0) {
        sp.in(userInfo.currentRoom).emit('roomUpdate', {
            roomName: userInfo.currentRoom,
            userList: rooms[userInfo.currentRoom].userList
        });
        sp.in(userInfo.currentRoom).emit('messageToRoom', {
            sneder: 'server',
            msg: username+' has left the room.',
            type: 'event'
        })
    } else {
        if(userInfo.currentRoom !== "mainRoom") delete rooms[userInfo.currentRoom];
    }
    userInfo.currentRoom = "";
}
//
export default function(io, rooms, users) {
    return function(socket) {
        console.log('connection established for id: ',socket.id);
        let sp = new socketProxy(socket, io);
        let username;
        //Errors
        sp.on('error', function(d) {
            console.log(username+ " ERROR: ",d);
        });
        //Sign In
        sp.on('signIn', function(un) {
            if(users[un]) {
                sp.emit('signIn', {response: false, reason: 'Username already in use'});
            } else {
                if(un.match(/^[0-9a-zA-Z]{3,16}$/)) {
                    console.log(un+' Connecting');
                    sp.emit('signIn', {response: true});
                    username = un;
                    users[un] = {
                        sp,
                        currentRoom: '',
                        requestGame: ''
                    };
                    joinRoom('mainRoom', users[un], username, rooms, sp);
                } else {
                    sp.emit('signIn', {response: false, reason: 'Username must be alphanumeric and between 3 - 16 characters long.'});
                }
            }
        });
        //Disconnect
        sp.on('disconnect', function() {
            if(username) {
                if(users[username].currentRoom !== "") leaveRoom(sp, users[username], username, rooms);
                delete users[username];
            }
            console.log(username + ' Disconnected');
        });
        //Messages To Room
        sp.on('messageToRoom', function(data) {
            sp.in(users[username].currentRoom).emit('messageToRoom', {
                sender: username,
                msg: data,
                type: 'msg'
            });
        });
        //Request Game
        sp.on('requestGame', function(un) {
            if(users[un]) {
                users[username].requestGame = un;
                users[un].sp.emit('requestGame', {asker: username});
            } else {
                sp.emit('requestGame-response', {response: false, reason: "User no longer exists."})
            }
        });
        //Answer Request
        sp.on('requestGame-response', function(d) {
            if(d.response) {
                if(users[d.asker].requestGame === username) {
                    let nrn = username + d.asker + (Math.round(Math.random()*100) + 1);
                    createRoom(rooms, nrn, {player1:d.asker, player2:username});
                    leaveRoom(sp, users[username], username, rooms);
                    leaveRoom(users[d.asker].sp, users[d.asker], d.asker, rooms);
                    joinRoom(nrn, users[username], username, rooms, sp);
                    joinRoom(nrn, users[d.asker], d.asker, rooms, users[d.asker].sp);
                    sp.in(nrn).emit('upgradeToP2P');
                } else {
                    users[d.asker].sp.emit('requestGame-response', {answer: false, reason: "User has requested a game from another player."});
                }
            } else {
                users[d.asker].requestGame = '';
                users[d.asker].sp.emit('requestGame-response', {answer: false, reason: d.reason});
            }
        });
    }
}
