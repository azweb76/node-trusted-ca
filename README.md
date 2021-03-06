# trusted-ca
Nodejs package for loading the system ca-bundle trust certificates into the https globalAgent.

Certificates loaded:
* /etc/pki/tls/certs/ca-bundle.crt
* /etc/ssl/certs/ca-certificates.crt
* /usr/local/etc/openssl/cert.pem
* OSX key chains (System, SystemRootCertificates, requires node v0.11.12+)

> NOTE: If no certs are found, this falls back to nodejs defaults.

## Install
```javascript
npm install trusted-ca --save
```

## Usage
```javascript
'use strict'

const https = require('https');

require('trusted-ca');

const options = {
  hostname: 'mysecuredomain.com',
  port: 443,
  path: '/'
};

const req = https.request(options, res => {
  res.setEncoding('utf8');
  res.on('data', d => {
    console.log('data', d);
  });
});

req.on('error', err => {
  console.log('rats, an error!', err);
});

req.end();
