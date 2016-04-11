import fs from 'fs';
import tape from 'tape';
import _test from 'tape-promise';
import P2P from 'socket.io-p2p';
import io from 'socket.io-client';
//
//
const test = _test(tape) // decorate tape
//Helper functions
function delay (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}
//
function createSinglton(cb) {
    let fired = false;
    return function singleton(d) {
        if(fired) return;
        cb(d);
        fired = true;
    }
}
//
function setupSockets(username) {
    let socket = io("http://localhost:4000", {forceNew: true, multiplex: false});
    let setup = {};
    setup.p2p = new P2P(socket, {autoUpgrade: false});
    setup.username = username;
    return setup;
}
//Integration tests
test('socket.io integration test - login', function(t) {
    //Setup
    let s = setupSockets('buck');
    let s2 = setupSockets('buck');
    //
    //t.plan(5);
    //
    s.p2p.on('usernameValid', function() {
        t.pass('username was valid and user is logged in');
    });
    s2.p2p.on('usernameInvalid', function() {
        t.pass('username was invalid');
        s.p2p.disconnect();
        s2.p2p.disconnect();
        //Makes sure both have time to disconnect before starting the next test.
        setTimeout(function(){
            t.end();
        },15);
    });
    s.p2p.on('roomUpdate', createSinglton(function(d) {
        t.true(d.roomName == 'mainRoom','user joined the mainRoom');
        t.true(d.userList[0] == s.username, 'user was add to room user list');
    }));
    s.p2p.on('messageToRoom', function(d) {
        if(d.msg == 'buck has joined the room')t.pass('server sent joined message to the room');
    });
    //Init test
    s.p2p.emit('signIn', s.username);
    s2.p2p.emit('signIn', s2.username);
});
//
test('socket.io integration test - messaging', function(t) {
    //Setup
    let s = setupSockets('chris');
    let s2 = setupSockets('jess');
    //
    t.plan(2);
    //
    s.p2p.on('messageToRoom', function(d) {
        if(d.type === 'event') return;
        t.true(d.msg === ' hello', 'Received own message');
    });
    s2.p2p.on('messageToRoom', function(d) {
        if(d.type === 'event') return;
        t.true(d.msg === ' hello', 'Received chris message');
    });
    //
    s.p2p.emit('signIn', s.username);
    s2.p2p.emit('signIn', s2.username);
    s.p2p.emit('messageToRoom',' hello');
    //
});
//
//
