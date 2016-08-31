'use strict'

var https         = require('https');
var fs            = require('fs');
var child_process = require('child_process');

var trustedCa = [
  '/etc/pki/tls/certs/ca-bundle.crt',
  '/etc/ssl/certs/ca-certificates.crt',
  '/usr/local/etc/openssl/cert.pem'
];

var caAll = https.globalAgent.options.ca || [];

// if OSX, load certs from key chains
if(process.platform === 'darwin'){
  if (child_process.execSync){
    var caList = splitCa(child_process.execSync('security find-certificate -a -p /Library/Keychains/System.keychain', { encoding: 'utf8' }));
    caAll = caAll.concat(caList);

    caList = splitCa(child_process.execSync('security find-certificate -a -p /System/Library/Keychains/SystemRootCertificates.keychain', { encoding: 'utf8' }));
    caAll = caAll.concat(caList);
  }
}
else {
  for (var i = 0; i < trustedCa.length; i++) {
    if(fs.existsSync(trustedCa[i])){
      var caList = splitCa(trustedCa[i]);
      for (var j = 0; j < caList.length; j++) {
        caAll.push(caList[j]);
      }
    }
  }
}

function splitCa(chain, split) {
  split = typeof split !== 'undefined' ? split : "\n";

  var ca = [];
  if(chain.indexOf("-END CERTIFICATE-") < 0 || chain.indexOf("-BEGIN CERTIFICATE-") < 0){
    throw Error("File does not contain 'BEGIN CERTIFICATE' or 'END CERTIFICATE'");
  }
  chain = chain.split(split);
  var cert = [];
  var _i, _len;
  for (_i = 0, _len = chain.length; _i < _len; _i++) {
    var line = chain[_i];
    if (!(line.length !== 0)) {
      continue;
    }
    cert.push(line);
    if (line.match(/-END CERTIFICATE-/)) {
      ca.push(cert.join(split));
      cert = [];
    }
  }
  return ca;
}

// only replace ca certs if we found certs
if (caAll && caAll.length){
  https.globalAgent.options.ca = caAll;
}
