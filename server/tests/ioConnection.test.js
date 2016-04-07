import fs from 'fs';
import tape from 'tape';
import _test from 'tape-promise';
import P2P from 'socket.io-p2p';
import io from 'socket.io-client';
//
//
const test = _test(tape) // decorate tape
//
function delay (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}
/*
    msg-format: {
        sender: '', server || client Username
        msg: '', txts msg
        type: '', event || msg
    }
*/
test('init', function(t) {
    t.plan(4);
    let socket = io("http://localhost:4000");
    let p2p = new P2P(socket,{peerOpts: {trickle: false}, autoUpgrade: false});
    let tmpUsername = 'cja';
    //Cleanup
    window.onbeforeunload = function() { p2p.emit('disconnect'); }
    /*
    p2p.on('mainRoom-msg', function (data) {
       console.log("data msg: ",data);
    });

    p2p.emit('signIn', 'cjalatorre');

    p2p.on('usernameInvalid', function() {
        console.log('username in use');
    });

    p2p.on('message', function(data) {
        console.log("something being said in the mainRoom",data);
    });

    p2p.on('usersUpdate', function(data) {
        console.log("new list of users in room",data);
    });

    p2p.emit('mainRoom-msg', {textVal: 'hello world'});
    */
    p2p.on('usernameValid', function() {
        t.pass('signIn initiated and username valid');
    });
    p2p.on('usersUpdate', function(d) {
        t.true(d.length > 0, 'room user list updated');
    });
    p2p.on('message', function(d) {
        console.log('d',d);
        if(d.msg === tmpUsername+' has entered the room') {
            t.pass('Got entered room msg');
        } else if(d.msg === 'hello world') {
            t.pass('Got sent message');
        }
    });
    p2p.emit('signIn', tmpUsername);
    p2p.emit('mainRoom-msg', 'hello world');
});
