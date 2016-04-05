import Hapi from 'hapi';
import Sio  from 'socket.io';
import routes from './routes';

const server = new Hapi.Server();

server.connection({ port: 4000 });

const io = Sio(server.listener);

routes(server, io).start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});
