import Path from 'path';
import Inert from 'inert';
import fs from 'fs';
//
export default function(server, io) {
    server.register(Inert, () => {});
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
