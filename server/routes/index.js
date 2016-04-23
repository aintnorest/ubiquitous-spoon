import Path from 'path';
import Inert from 'inert';
import ioConnection from '../handlers/ioConnection';
import fs from 'fs';
//
export default function(server, io) {
    const users = {};
    const rooms = {
        'mainRoom': {userList:[], roles:{}}
    };
    //
    server.register(Inert, () => {});
    //
    io.on('connection', ioConnection(io, rooms, users));
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
            path: '/{component?}',
            handler: function(request, reply) {
                reply.file('static/index.html');
            }
        }
    ]);
    //
    return server;
}
