import User from '../utils/user';
//
function notifyRoom(sp, roomName, roomUpdate, username, noun) {
    sp.in(roomName).emit('roomUpdate', roomUpdate);
    sp.in(roomName).emit('messageToRoom', {
        sender: 'server',
        msg: username+' has '+noun+' the room.',
        type: 'event'
    });
}
//
export default function(io, chat) {
    return function(socket) {
        let user = new User(socket, io);
        let sp = user.sp;
        //Error
        sp.on('error', function(d) {
            if(user.username != "") console.log(user.username+ " ERROR: ",d);
            else console.log(user.id+ " ERROR: ",d);
        });
        //Sign In
        sp.on('signIn', function(requestedUsername) {
            //Attempt to set username and emit response;
            let usernameResp = user.setUsername(requestedUsername, chat, user);
            console.log('SignIn - username: ',requestedUsername);
            sp.emit('signIn', usernameResp);
            //If Attempt fails bail;
            if(!usernameResp.response) return;
            console.log(user.username," signed In");
            //Join mainRoom and emit updates;
            let roomUpdate = user.joinRoom('mainRoom', chat)
            notifyRoom(sp, 'mainRoom', roomUpdate, user.username, 'joined');
        });
        //Disconnect
        sp.on('disconnect', function() {
            if(user.username != '') {
                if(user.currentRoom != user.id && user.currentRoom != '') {
                    chat.removeUser(user.username);
                    let roomUpdate = chat.leaveRoom(user.currentRoom, user.username);
                    if(roomUpdate.userList) notifyRoom(sp, roomUpdate.roomName, roomUpdate, user.username, 'left');
                }
                chat.removeUser(user.username);
                console.log(user.username,' signed Out');
            }
        });
        //Messages To Room
        sp.on('messageToRoom', function(msg) {
            msg.type = 'msg';
            msg.sender = user.username;
            sp.in(user.currentRoom).emit('messageToRoom', msg);
        });
        //Request Game
        sp.on('requestGame', function(un) {
            if(chat.users[un]) {
                user.requestGame = un;
                console.log('am i sending this request',un);
                chat.users[un].sp.emit('requestGame', {asker: user.username});
            } else {
                sp.emit('requestGame-response', {response: false, reason: "User no longer exists.", asked:un});
            }
        });
        //Answer Request
        sp.on('requestGame-response', function(d) {
            console.log('answer the request',d);
            if(typeof d == 'object' && d.asked && d.response) {
                let asker = chat.users[d.asked];
                if(d.response) {
                    if(asker.requestGame === user.username) {
                        //Create New Room Name;
                        let nrn = user.username + asker.username + (Math.round(Math.random()*100) + 1);
                        //Both users playing leave their current rooms;
                        let roomUpdate = chat.leaveRoom(user.currentRoom, user.username);
                        if(roomUpdate.userList) notifyRoom(sp, roomUpdate.roomName, roomUpdate, user.username, 'left');
                        roomUpdate = chat.leaveRoom(asker.currentRoom, asker.username);
                        if(roomUpdate.userList) notifyRoom(asker.sp, roomUpdate.roomName, roomUpdate, asker.username, 'left');
                        //Both users join the new room;
                        notifyRoom(sp, nrn, user.joinRoom(nrn, chat, {player1:asker.username, player2:user.username}), user.username, 'joined');
                        notifyRoom(sp, nrn, asker.joinRoom(nrn, chat), asker.username, 'joined');
                        //Notify of upgrade to p2p;
                        sp.in(nrn).emit('upgradeToP2P', user.username);
                    } else  asker.sp.emit('requestGame-response', {answer: false, reason: "User has requested a game from another player.", asked:user.username});
                } else {
                    asker.requestGame = '';
                    asker.sp.emit('requestGame-response', {answer: false, reason: d.reason, asked:user.username});
                }
            }
        });
        //
    }
}
