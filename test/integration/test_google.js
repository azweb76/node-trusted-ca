'use strict'

const https = require('https');

require('../../index');

const options = {
  hostname: 'www.google.com',
  port: 443,
  path: '/',
  method: 'GET'
};

const req = https.request(options, res => {
  res.setEncoding('utf8');
  res.on('end', () => {
    if(res.statusCode == 200){
      process.exit(0);
    }
  });
});

req.on('error', err => {
  console.error('rats, an error!', err);
  process.exit(1);
});

req.end();
