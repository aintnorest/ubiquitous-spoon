import Path from 'path';
import Inert from 'inert';
import ioConnection from '../handlers/ioConnection';
import fs from 'fs';
//
export default function(server, io) {
    const users = {};
    const rooms = {
        mainRoom: {users: [], userCount: 0}
    };
    //
    server.register(Inert, () => {});
    //
    io.on('connection', ioConnection(rooms, users, io));
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
        }
    ]);
    //
    return server;
}
