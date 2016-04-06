import Path from 'path';
import Inert from 'inert';
import ioConnection from '../handlers/ioConnection';
import fs from 'fs';
//
export default function(server, io) {
    const clients = [];
    const mainRoom = {chatters: [], chatterCount: 0, name:'mainRoom'};
    //
    server.register(Inert, () => {});
    //
    io.on('connection', ioConnection(clients, mainRoom));
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
