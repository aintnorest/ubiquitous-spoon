import Chat from '../utils/chat';
import User from '../utils/user';
//Init Chat Obj, Connection Listener & Error Listener
export default function(wss) {
    let chat = new Chat({ 'mainRoom': {userList:[], roles:{}, options:{ permanent:true } } });
    wss.on('connection', onConnect(chat));
    wss.on('error', function(err) { console.log('Web Socket Server Error: ',err); });
}
//
function onConnect(chat) {
    return function(ws) {
        let user = new User(ws, function() {
            /* On connection close */
            chat.removeUser(user);
            user.wsp.close();
        });
        let wsp = user.wsp;
        /**
         * @endpoint signIn - request sign in.
         *
         * @parameter {String} username user requests.
         *
         * @Success {Object} {
         *  response: {Boolean} true
         * }
         * @Failure {Object} {
         *  response: {Boolean} false,
         *  reason
         * }
         */
        wsp.on('signIn', function(requestedUsername) {console.log('requestedUsername: ',requestedUsername); chat.addUser(user, requestedUsername); });
        /**
         * @endpoint messageToRoom - send message to the current room.
         *
         * @parameter {Object} {
         *  msg: {String} the message,
         *  id: {String} 8 random digits,
         *  timestamp: {Number / Date.now()} 24352352,
         *  type: {String} msg / event,
         *  sender: {String} senders username,
         * }
         *
         * @Success message is sent back;
         * @Failure message isn't sent back;
         */
        wsp.on('messageToRoom', function(msg) { user.messageToRoom(msg, chat); });
        /**
         * @endpoint requestGame - request game.
         *
         * @parameter {String} username of player you want a game with.
         *
         * @Emit if Success {Object} {
         *  asker: {String} current user's username
         * }
         *
         * @Success {Object} {
         *  response: {Boolean} true
         * }
         * @Failure {Object} {
         *  response: {Boolean} false,
         *  reason: {String} User is already in a game.
         * }
         */
        wsp.on('requestGame', function(requestedUser) { chat.requestGame(requestedUser, user) });
        /**
         * @endpoint requestGame-response - response to game request.
         *
         * @parameter {Object} {
         *  response: {Boolean} true,
         *  asker: {String} username of the user that asked u,
         *  timestamp: {Number / Date.now()} 24352352,
         * }
         *
         * @Success message is sent back;
         * @Failure message isn't sent back;
         */
        wsp.on('requestGame-response', function(answr) { chat.requestGameResponse(answr, user); });
        /**
         * @endpoint iceCandidate - sending ice candidate.
         *
         * @parameter {Object} ice candidate
         *
         * @Success candidate is sent to everyone in the room;
         * @Failure error is emitted;
         */
        wsp.on('iceCandidate', function(candidate) { user.iceCandidate(candidate, chat); });
        /**
         * @endpoint setLocalDescription-Response - sending description response.
         *
         * @parameter {Object} description response
         *
         * @Success response is sent to everyone in the room although just the opposing player is using it;
         * @Failure error is emitted;
         */
        wsp.on('setLocalDescription', function(description) { user.setLocalDescription(description, chat); });
        //Error
        wsp.on('error', function(d) {
            if(user.username != "") console.log(user.username+ " ERROR: ",d);
            else console.log("User not Logged in, ERROR: ",d);
        });
    }
}
