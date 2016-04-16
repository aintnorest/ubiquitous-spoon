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
    let s3 = setupSockets('_adb<');
    let plan = 6;
    //
    //
    s.p2p.on('signIn', function(d) {
        plan--;
        if(d.response) {
            t.pass('username was valid and user is logged in');
        } else {
            t.fail('username was said to be invalid it shouldnt have been');
        }
    });
    s2.p2p.on('signIn', function(d) {
        if(!d.response) {
            plan--;
            t.pass('username was invalid');
        }
    });
    s3.p2p.on('signIn', function(d) {
        plan--;
        if(!d.response) t.pass('username only accepts alphanumerical characters');
        else t.fail('username is accepting alphanumerical characters');
        s.p2p.disconnect();
        s2.p2p.disconnect();
        s3.p2p.disconnect();
        //Makes sure both have time to disconnect before starting the next test.
        setTimeout(function(){
            if(plan === 0) t.pass('All Tests Fired!');
            else t.fail('All Tests didnt Fire!');
            t.end();
        },15);
    });
    s.p2p.on('roomUpdate', createSinglton(function(d) {
        plan--;
        plan--;
        t.true(d.roomName == 'mainRoom','user joined the mainRoom');
        t.true(d.userList[0] == s.username, 'user was added to room user list');
    }));
    s.p2p.on('messageToRoom', function(d) {
        plan--;
        if(d.msg == 'buck has joined the room.')t.pass('server sent joined message to the room');
    });
    //Init test
    s.p2p.emit('signIn', s.username);
    s2.p2p.emit('signIn', s2.username);
    s3.p2p.emit('signIn', s3.username);
});
//
test('socket.io integration test - messaging', function(t) {
    //Setup
    let s = setupSockets('chris');
    let s2 = setupSockets('jess');
    let plan = 2;
    //
    //
    s.p2p.on('messageToRoom', function(d) {
        if(d.type === 'event') return;
        plan--;
        t.true(d.msg === 'hello', 'Received own message');
        if(plan === 0) {
            s.p2p.disconnect();
            s2.p2p.disconnect();
            setTimeout(function() {
                t.end();
            },15);
        }
    });
    s2.p2p.on('messageToRoom', function(d) {
        if(d.type === 'event') return;
        plan--;
        t.true(d.msg === 'hello', 'Received chris message');
        if(plan === 0) {
            s.p2p.disconnect();
            s2.p2p.disconnect();
            setTimeout(function() {
                t.end();
            },15);
        }
    });
    //
    s.p2p.emit('signIn', s.username);
    s2.p2p.emit('signIn', s2.username);
    s.p2p.emit('messageToRoom','hello');
    //
});
//
test('socket.io integration test - request game', function(t) {
    let s = setupSockets('bob');
    let s2 = setupSockets('ryan');
    let plan = 4;
    setTimeout(function() {
        console.log('plan',plan);
        if(plan > 0) {
            try {
                s.p2p.disconnect();
                s2.p2p.disconnect();
            } catch(err) {
                console.log('Err on disconnect: ',err);
            }
            t.fail('TEST TIMED OUT');
            setTimeout(function() {t.end();},30);
        }
    },16000);
    //
    s.p2p.on('peer-error', function(d) {
        console.log('peer error on 1: ',d);
    });
    s2.p2p.on('peer-error', function(d) {
        console.log('peer error on 2: ',d);
    });
    s.p2p.on('upgrade', function(d) {
        console.log('peer upgrade on 1.');
    });
    s2.p2p.on('upgrade', function(d) {
        console.log('peer upgrade on 2.');
    });

    //
    s.p2p.emit('signIn', s.username);
    s2.p2p.emit('signIn', s2.username);
    //
    s2.p2p.on('requestGame', function(d) {
        plan--;
        if(d.asker === s.username){
            t.pass('User 1 asked me user 2 for a game');
            s2.p2p.emit('requestGame-response',{response: true, asker:d.asker});
        }
        else t.fail('Request for game not received');
    });
    s2.p2p.on('upgradeToP2P', function() {
        plan--;
        t.pass(s2.username+' User told to upgrade');
        s2.p2p.upgrade();
    });
    s.p2p.on('upgradeToP2P', function() {
        plan--;
        t.pass(s.username+' User told to upgrade');
        s.p2p.upgrade();
        setTimeout(
            function(){
                s.p2p.emit('messageToRoom',{
                    sender: s.username,
                    msg: 'hello',
                    type: 'msg',
                    timeStamp: Date.now()
                });
            },400);
    });


    s.p2p.on('messageToRoom', function(d){
        if(d.msg !== 'hello back') return;
        plan--;
        t.pass(s.username+' User received p2p messageToRoom ' +JSON.stringify(d));
        setTimeout(function(){
            s.p2p.disconnect();
            s2.p2p.disconnect();
        },4000)
        setTimeout(function() {t.end();},6000);
    });

    s2.p2p.on('messageToRoom', function(d){
        if(d.msg !== 'hello') return;
        plan--;
        t.pass(s2.username+' User received p2p messageToRoom ' +JSON.stringify(d));
        if(plan === 0) {
            console.log(' am i in here');
            s2.p2p.emit('messageToRoom',{
                sender: s2.username,
                msg: 'hello back',
                type: 'msg',
                timeStamp: Date.now()
            });
        }
    });

    s.p2p.emit('requestGame',s2.username);

});
//
//
