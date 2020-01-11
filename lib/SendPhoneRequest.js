// Copyright 2014-2015 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.
var http = require('http')
var util = require('util')

var keyTemplate = 'XML=<CiscoIPPhoneExecute><ExecuteItem URL=\"Key:${key}\" /></CiscoIPPhoneExecute>'
var digitTemplate = 'XML=<CiscoIPPhoneExecute><ExecuteItem URL=\"Key:KeyPad${digit}\" /></CiscoIPPhoneExecute>'
var dialTemplate = 'XML=<CiscoIPPhoneExecute><ExecuteItem URL=\"Dial:${number}\" /></CiscoIPPhoneExecute>'

var baseOptions = { 
  hostname: '',
  port: 80,
  path: '/CGI/Execute',
  method: 'POST',
  headers: { 
    'Content-Type': 'text/xml',
    'Content-Length': 0
  }
}

var SendPhoneRequest = function(phoneOptions) {
  this.phoneOptions = baseOptions
  if (phoneOptions.hostname) {
    this.phoneOptions.hostname = phoneOptions.hostname
  }

  if (phoneOptions.port) {
    this.phoneOptions.port = phoneOptions.port
  }

  if (phoneOptions.basicAuth) {
    this.phoneOptions.headers['Authorization'] = `Basic ${phoneOptions.basicAuth}`;
  }
}

var handleSpecialDigits = function(digit) {
  if (digit === '#') {
    return 'Pound'
  }

  if (digit === '*') {
    return 'Star'
  }

  if (digit === ',') {
    return ','
  }

  if ((digit >= '0') && (digit <= '9')) {
    return digit
  }

  return ''
}

SendPhoneRequest.prototype.sendPhoneRequest = function(phoneRequest, resultHandler) {
  this.phoneOptions.headers['Content-Length'] = phoneRequest.length
  var request = http.request(this.phoneOptions, response => resultHandler(response)) 
  request.write(phoneRequest)
  request.end();
}

SendPhoneRequest.prototype.sendKey = function(key, resultHandler) {
  this.sendPhoneRequest(keyTemplate.replace('${key}', key), resultHandler)
}

SendPhoneRequest.prototype.dial = function(number, resultHandler) {
  // strip out - characters to that we can have nicely formatted numbers
  this.sendPhoneRequest(dialTemplate.replace('${number}', number.replace(/-/g, '')), resultHandler)
}

SendPhoneRequest.prototype.sendDigit = function(digit, resultHandler) {
  this.sendPhoneRequest(digitTemplate.replace('${digit}', digit), resultHandler)
}

SendPhoneRequest.prototype.mute = function(resultHandler) {
  this.sendKey('mute', resultHandler)
}

SendPhoneRequest.prototype.speaker = function(resultHandler) {
  this.sendKey('speaker', resultHandler)
}

SendPhoneRequest.prototype.line = function(line, resultHandler) {
  this.sendKey('Line' + line, resultHandler)
}

SendPhoneRequest.prototype.soft = function(num, resultHandler) {
  this.sendKey('Soft' + num, resultHandler)
}

SendPhoneRequest.prototype.sendDigits = function(digits, resultHandler) {
  var nextDigit = handleSpecialDigits(digits.slice(0,1))
  var remainingDigits = digits.slice(1)

  if (nextDigit === '') {
    // non supported character do nothing
    this.sendDigits(remainingDigits, resultHandler)
  } else if (nextDigit === ',') {
     setTimeout(() => this.sendDigits(remainingDigits, resultHandler), 1000)
  } else if (remainingDigits === '') {
     this.sendDigit(nextDigit, resultHandler) 
  } else {
     this.sendDigit(nextDigit, () => setTimeout(() => {this.sendDigits(remainingDigits, resultHandler)},200))
  }
}

module.exports = SendPhoneRequest
