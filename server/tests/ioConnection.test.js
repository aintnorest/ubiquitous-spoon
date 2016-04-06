import fs from 'fs';
import tape from 'tape';
import _test from 'tape-promise';
import io from 'socket.io-client';
//
let socket = io();
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
//
test('init', function(t) {
    t.plan(1);
    t.true(true,'just checking');
});
/*
test('Ensure db file is created & initialized', function(t) {
    //Make sure the File doesn't exists to start
    let exists = fs.existsSync(filePath);
    if(exists) fs.unlinkSync(filePath);
    let db = database(filePath);
    let authError, waitError;
    //
    db.serialize(function() {
        //add a row to Authorized
        db.run("insert into Authorized("
            + "serial_number, first_name, last_name, email, phone_number, rank, company, phone_type, requestedPin, date_requested, auth_date, admin_authed, version_of_app, version_of_data, last_sync)"
            + " values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            ["1234sn","Chris","Alatorre","cjalatorre@gmail.com","234-2355","private","rough neck","s7","345323","jan 3rd 2016","jan 4th 2016","admin bob","0.1.0","0.1","jan 4th 2016"],
            (err) => {
                if(err !== null) authError = err;
            }
        );
        //add a row to Waiting
        db.run("insert into Waiting("
            + "serial_number, first_name, last_name, email, phone_number, rank, company, phone_type, requestedPin, date_requested, version_of_app, version_of_data, last_sync)"
            + " values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            ["1234sn","Chris","Alatorre","cjalatorre@gmail.com","234-2355","private","rough neck","s7","235234","jan 3rd 2016","0.1.0","0.1","jan 4th 2016"],
            (err) => {
                if(err !== null) waitError = err;
            }
        );
    });
    return delay(1).then(function() {
        t.true(fs.existsSync(filePath),'DB file is created.');
        db.get("SELECT * FROM Authorized LIMIT 1",[],(err, row) => {
            t.true(authError === undefined, "Authorized Table Exists.");
            if(authError)console.log("Table insert error: ",authError);
            t.true(row !== undefined,"Was able to retrieve a row from Authorized after inserting it.");
            db.get("SELECT * FROM Waiting LIMIT 1",[],(errW, rowW) => {
                t.true(waitError === undefined, "Waiting Table Exists.");
                if(waitError)console.log("Table insert error: ",waitError);
                t.true(rowW !== undefined,"Was able to retrieve a row from Waiting after inserting it.");
                t.end();
            });
        });
    })
});
*/
