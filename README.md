# Node Computer-Telephone-Intergration for cisco phones

This project provides a Node based API to interact with cisco phones
which allows you to easily dial/send commands to the phone.

# Usage

+ create an instance of SendPhoneRequest
+ use one of the following to send commands/requests to the phone

  + dial(number, resultHandler)        - dial a number

  + sendDigits(digits, resultHandler)  - send digits in call in progress

  + speaker(resultHandler)             - speaker on/off 

  + line(line, resultHandler)          - go on/off hook with line selected

  + soft(num, resultHandler)           - send softkey 

  + sendKey(key, resultHandler)        - send key (use if key not covered by
                                                   other options) 

resultHandler is called once the request completes

This document provides more information on the specific keys that can be used with sendKey: [cisco programming guide](http://www.cisco.com/c/en/us/td/docs/voice_ip_comm/cuipph/all_models/xsi/6_0/english/programming/guide/XSIbook.pdf)

Example:

<PRE>
var SendPhoneRequest = require('node-cti')

var phoneRequest = new SendPhoneRequest({'hostname': 'myhost'});

var resultHandler = function(response) {
  console.log('RESPONSE CODE:' + response.statusCode)
}

var doDial = function(response) {
  phoneRequest.dial('55555555', sendAccessCode)
}

var sendAccessCode = function(response) {
  setTimeout(function() {
    phoneRequest.sendDigits('12341#,,*12312#', resultHandler)
  }, 4000);
}

phoneRequest.line(1, doDial)
</PRE>

# Phones tested

* Cisco SPA504G
