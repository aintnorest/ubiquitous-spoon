import Path from 'path';
import Inert from 'inert';
import ioConnection from '../handlers/ioConnection';
import Chat from '../utils/chat';
import fs from 'fs';
//
export default function(server, io) {
    const chat = new Chat({ 'mainRoom': {userList:[], roles:{}, options:{ permanent:true } } });
    //
    server.register(Inert, () => {});
    //
    io.on('connection', ioConnection(io, chat));
    //
    server.route([
        //Serve Files out of the static folder
        {
            method: 'GET',
            path: '/static/{param*}',
            handler: {
                directory: {
                    path: Path.normalize(__dirname + '/../static')
                }
            }
        },
        {
            method: 'GET',
            path: '/',
            handler: function(request, reply) {
                reply.file('static/index.html');
            }
        }
    ]);
    //
    return server;
}
