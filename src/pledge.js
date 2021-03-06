'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise(executor) {
  if (typeof executor !== 'function') {
    throw TypeError(/executor.+function/i);
  }
  this._state = 'pending';
  this._value = undefined;

  const resolve = this._internalResolve.bind(this);
  const reject = this._internalReject.bind(this);

  this._handlerGroups = [];
  executor(resolve, reject);
}

$Promise.prototype._internalResolve = function (data) {
  if (this._state === 'pending') {
    this._value = data;
    this._state = 'fulfilled';
    this._callHandlers();
  }
};
$Promise.prototype._internalReject = function (reason) {
  if (this._state === 'pending') {
    this._value = reason;
    this._state = 'rejected';
    this._callHandlers();
  }
};

$Promise.prototype.then = function (successCb, errorCb) {
  if (typeof successCb !== 'function') successCb = undefined;
  if (typeof errorCb !== 'function') errorCb = undefined;
  const downstreamPromise = new Promise (() => {});
  this._handlerGroups.push({ successCb, errorCb, downstreamPromise });
  this._callHandlers();
  return downstreamPromise;
}

$Promise.prototype._callHandlers = function () {
  if (this._state === 'pending') return;
  const handler = this._state === 'fulfilled' ? 'successCb': 'errorCb';
  
  this._handlerGroups.forEach((group) => {
    if (group[handler]) {
      group[handler](this._value);
    }
    this._handlerGroups = [];
  })
}

$Promise.prototype.catch = function (handler) {
  this.then(null, handler);
  this._callHandlers();
}


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
