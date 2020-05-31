var express = require('express');
var app = express();
// var jwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) + 82600 }, 'shhhhh');

// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

 app.get('/token',function(req,res) {
   console.log('Anon Token');
    res.set('Content-Type', 'application/json');
    res.send(token);
  });

//app.get('/protected',
//  jwt({ secret: 'shhhhhhared-secret' }),
//  function(req, res) {
//    if (!req.user.admin) return res.sendStatus(401);
//    res.sendStatus(200);
//  });


var server = app.listen(8091, function () {
    var host = server.address().address
    var port = server.address().port 
    console.log("Example app listening at http://%s:%s", host, port)
})
