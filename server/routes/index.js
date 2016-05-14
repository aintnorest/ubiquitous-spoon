import Path from 'path';
import Inert from 'inert';
import socketConnections from '../handlers/socketConnections';
import webSocketServer from '../utils/WebSocketServer';
import fs from 'fs';
//
export default function(server) {

    server.register(Inert, () => {});
    //
    webSocketServer(server, socketConnections);
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
