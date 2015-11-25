# Node Computer-Telephone-Intergration for cisco phones

This project provides a Node based API to interact with cisco phones
which allows you to easily dial/send commands to the phone.

# Usage

+ create an instance of SendPhoneRequest
+ use one of the following to send commands/requests to the phone


dial(number, resultHandler)        - dial a number
sendDigits(digits, resultHandler)  - send digits in call in progress
speaker(resultHandler)             - speaker on/off 
line(line, resultHandler)          - go on/off hook with line selected
soft(num, resultHandler)           - send softkey 
sendKey(key, resultHandler)        - send key (use if key not covered by
                                               other options) 

resultHandler is called once the request completes

Example:

<PRE>
var http = require('http')
var SendPhoneRequest = require('./SendPhoneRequest')

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

sendPhoneRequest.sendKey('Line1', doDial)
</PRE>
