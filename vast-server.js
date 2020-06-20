const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const VAST = require('vast-xml');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');

const privateKey = fs.readFileSync('private_key.pem');
 
// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/

app.get('/',function(req,res) {
  console.log('Accessing the Root...');
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname +'/index.html');
});
2
app.get('/uuid',function(req,res) {
  console.log('Requesting UUID...');
  res.set('Content-Type', 'application/json');
  res.send(uuidv4());
});

app.get('/token',function(req,res) {
  // const token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) + 82600 }, 'shhhhh');
  const onemonth = Math.floor(Date.now() / 1000) + 2678400; 
  const token = jwt.sign({ iss: 'GlobalStripe', exp: onemonth }, {key: privateKey, passphrase:'Adv@18241'}, { algorithm: 'RS256'});
  console.log('JWT Token');
  res.set('Content-Type', 'application/json');
  const JWT = {
    token 
  };

  const jsonToken = {};
  res.send(JWT);
 });


 // GoogleGet
 app.get('/google', async (req,res) => {

  const query_param1 = req.query.session.toUpperCase();
  console.log("Session ID: " + query_param1);
  const query_param2 = req.query.country.toUpperCase();
  console.log("CountryCode: " + query_param2);

 const hostname = "https://pubads.g.doubleclick.net"
 const filepath = "/gampad/ads";
 const params1 = "?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp";
 const params2 = "&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=[avail.random]";

 const url = hostname + filepath + params1 + params2;
 // console.log(url)


 try {
 const {status, data} = await axios.get(url);
 
    console.log("Fetching Google VMAP")
    console.log("Google Response: " + status)     
    res.set('Content-Type', 'text/xml');
    res.send(data);
    // res.send(response.data({ pretty : true, indent : '  ', newline : '\n' }));


  }
 
    catch (e) {
      console.log("Google Axios Get Request Failed")
      console.log("Status:" + e.status)
      //console.log(e);
    }

});


app.get('/params',function(req,res) {
   console.log('Accessing params...');
   const query_param1 = req.query.session.toUpperCase();
   console.log("Session ID: " + query_param1);
   const query_param2 = req.query.country.toUpperCase();
   console.log("CountryCode: " + query_param2);
   res.set('Content-Type', 'text/html');
   let response= query_param2  + '-vast.xml?sessionid=' + query_param1 ;
   console.log(response);
   res.send('<html><body>Requesting: ' + response + '</body></html>');
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
   
   console.log("Listening at http://%s:%s", host, port)
   console.log("Express Version: ", require('express/package').version);
})






