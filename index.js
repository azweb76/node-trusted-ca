'use strict'

var splitCa = require('split-ca');
var https   = require('https');
var fs      = require('fs');

var trustedCa = [
  '/etc/pki/tls/certs/ca-bundle.crt'
];

var caAll = [];
for (var i = 0; i < trustedCa.length; i++) {
  if(fs.existsSync(trustedCa[i])){
    var caList = splitCa(trustedCa[i]);
    for (var j = 0; j < caList.length; j++) {
      caAll.push(caList[j]);
    }
  }
}

// only replace ca certs if we found certs
if(caAll.length){
  https.globalAgent.options.ca = caAll;
}
