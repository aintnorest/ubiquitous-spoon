import User from '../utils/user';
//
export default function(io, chat) {
    return function(socket) {
        let user = new User(socket, io);
        let sp = user.sp;
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
        sp.on('signIn', function(requestedUsername) { chat.addUser(user, requestedUsername); });
        /**
         * @endpoint disconnect - disconnect from server.
         */
        sp.on('disconnect', function() { chat.removeUser(user); });
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
        sp.on('messageToRoom', function(msg) { user.messageToRoom(msg); });
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
        sp.on('requestGame', function(requestedUser) { chat.requestGame(requestedUser, user) });
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
        sp.on('requestGame-response', function(answr){ chat.requestGameResponse(answr, user); });
        //Error
        sp.on('error', function(d) {
            if(user.username != "") console.log(user.sp.id+ " ERROR: ",d);
            else console.log(user.id+ " ERROR: ",d);
        });
    }
}
