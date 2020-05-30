var express = require('express');
var app = express();
var VAST = require('vast-xml');
// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/



app.get('/',function(req,res) {
 console.log('Accessing the Root...');
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname +'/index.html');
});


app.get('/vast-xml',function(req,res) {
 console.log('Accessing VAST vast-xml...');
  res.set('Content-Type', 'text/xml');
  res.send(vast.xml({ pretty : true, indent : '  ', newline : '\n' }));
});

app.get('/vmap',function(req,res) {
  var session_id = req.query.session_id; // $_GET["session_id"]
  res.set('Content-Type', 'text/xml');
  console.log('VMAP Request: Session ID: ' + session_id)
  res.send('<xml>VMAP ' + session_id +  '</xml>');
});

 
app.all('/secret', function(req, res, next) {
  console.log('Accessing the secret section ...');
res.set('Content-Type', 'text/xml');
res.send('<xml>Whats your secret?</xml>');
  next(); // pass control to the next handler
});


app.get('/impression', function(req, res, next) {
 var session_id = req.query.session_id; // $_GET["session_id"
  console.log('Ad Impression' + session_id);
res.set('Content-Type', 'text/xml');
res.send('<xml>OK</xml>');
});

//SendFile
app.get('/vast', function(req, res) {
  var session_id = req.query.session_id; // $_GET["session_id"
   console.log('Send VAST File' + session_id);
 res.set('Content-Type', 'text/xml');
 res.sendFile(__dirname + '/vast.xml');
 })


var vast = new VAST();

var ad = vast.attachAd({ 
      id : 1
    , structure : 'inline'
    , sequence : 99
    , Error: 'https://ads.dash.labs.com'
    , AdTitle : 'Fincons Default Ad'
    , AdSystem : { name: 'FinconsUK Ad Server', version : '1.0' }
  });

ad.attachImpression({
      id: "23"
    , url: "http://impression.com"
  });
ad.attachImpression({
      id: "GlobalStripe Impressio Server"
    , url: "http://ad.impression.globalstripe.com"
  });

var creative = ad.attachCreative('Linear', {
    AdParameters : '<xml></xml>'
  , Duration : '00:00:30'
});

creative.attachMediaFile('http://domain.com/file1.ext', {
    id : 1
  , type: "video/mp4"
  , bitrate: "320"
  , minBitrate: "320"
  , maxBitrate: "320"
  , width: "640"
  , height: "360"
  , scalable: "true"
  , maintainAspectRatio: "true"
  , codec: ""
  , apiFramework: "VPAID"
});

creative.attachTrackingEvent('creativeView', 'http://creativeview.com');
creative.attachVideoClick('ClickThrough', 'http://click-through.com');

var server = app.listen(8091, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})


