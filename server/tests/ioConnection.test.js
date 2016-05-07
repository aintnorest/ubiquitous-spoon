import fs from 'fs';
import tape from 'tape';
import _test from 'tape-promise';
//import P2P from 'socket.io-p2p';
//import io from 'socket.io-client';
import SocketProxy from './utils/clientSocketProxy';
//
//
const test = _test(tape) // decorate tape
const serverURL = 'ws://localhost:4000';
//
test('socket.io integration test - login', function(t) {
    let s = new SocketProxy(serverURL);
    let s2 = new SocketProxy(serverURL);
    let totalCount = 3;
    let cleanup = function(force) {
        if(totalCount === 0 || force) {
            s.disconnect();
            s2.disconnect();
            t.end();
        }
    };
    //Basic Sign In Test
    s.signIn('chris').then(function(d) {
        totalCount--;
        t.pass('Signed in: ' + JSON.stringify(d));

        //Check in twice
        s.signIn('bob').then(function(d) {
            totalCount--;
            t.fail('Shouldnt allow a user to sign in twice: ' + JSON.stringify(d));
            cleanup();
        }).catch(function(d) {
            totalCount--;
            t.pass('Wasnt allowed to sign in twice: ' + JSON.stringify(d));
            cleanup();
        });

        //Don't allow signIn with same name
        s2.signIn('chris').then(function(d) {
            totalCount--;
            t.fail('Shouldnt allow same name sign in: ' + JSON.stringify(d));
            cleanup();
        }).catch(function(d) {
            totalCount--;
            t.pass('Wasnt allowed to sign in with a duplicate name: ' + JSON.stringify(d));
            cleanup();
        });

    }).catch(function(d) {
        t.fail('Failed basic sign in: ' + JSON.stringify(d));
        cleanup(true);
    });
});
//
test('socket.io integration test - message room', function(t) {
    let s = new SocketProxy(serverURL);
    let s2 = new SocketProxy(serverURL);
    let totalCount = 2;
    let cleanup = function(force) {
        if(totalCount === 0 || force) {
            s.disconnect();
            s2.disconnect();
            t.end();
        }
    };

    Promise.all([
        s.signIn('Chris'),
        s2.signIn('Bob')
    ]).then(function() {
        s.listenToRoom(function(msg) {
            if(msg.msg == 'Hello Bob.') {
                totalCount--;
                t.pass('Other user got message');
                cleanup();
            }
        });
        s2.messageToRoom('Hello Bob.').then(function(d) {
            totalCount--;
            t.pass('Confirmation of message: ' + JSON.stringify(d));
            cleanup();
        }).catch(function(d) {
            t.fail('Never got message Confirmation: ' + JSON.stringify(d));
            cleanup(true);
        });
    });

});
//
test('socket.io integration test - request game', function(t) {
    let s = new SocketProxy(serverURL);
    let s2 = new SocketProxy(serverURL);
    let totalCount = 0;
    let cleanup = function(force) {
        setTimeout(function(){
            if(totalCount === 0 || force) {
                s.disconnect();
                s2.disconnect();
                t.end();
            }
        },15000);
    };

    Promise.all([
        s.signIn('Christopher'),
        s2.signIn('Bill')
    ]).then(function() {
        s.listenForGameRequest(function(request) {
            return new Promise(function(resolve, reject) {
                resolve(function(){console.log('done with stuff')});
            });
        });
        s2.requestGame('Christopher').then(function(d) {
            console.log('Accepted game',d);
            t.pass('Game Accepted');
            cleanup(true);
        }).catch(function(d) {
            t.fail('Game Denied');
            cleanup(true);
        });
    });

});
