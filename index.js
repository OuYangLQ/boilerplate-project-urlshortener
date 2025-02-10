require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded());

function extractDomain(url) {
  const match = url.match(/^(?:https?:\/\/)?([^\/:]+)/i);
  return match ? match[1] : null;
}

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res){
  let original_url = req.body.url;
  let short_url = 1;
  let domain = extractDomain(original_url);
  // console.log(domain);

  dns.lookup(domain, function(err, address, family){
    // console.log(err);
    if(err) return res.json({error: 'invalid url'})
    res.json({original_url: original_url, short_url: short_url});
  });

});

app.get('/api/shorturl/1', function(req, res){
  console.log(req.headers);
  let url = req.headers.origin || req.headers.referer || 'http://localhost:3000';
  console.log(url);
  res.redirect(303,url);
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
