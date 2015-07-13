'use strict';

var util = require('util');
var logger = require('logentries-logformat')('suite-sdk');
var _ = require('lodash');

var Base = require('../_base');

var Flipper = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Flipper, Base);

_.extend(Flipper.prototype, {

  isOn: function(payload, options) {
    logger.log('flipper_isOn');

    return this._request.get(
      this._getCustomerId(options),
      '/flippers/' + payload.flipperId,
      options
    );
  }

});

Flipper.create = function(request, options) {
  return new Flipper(request, options);
};

module.exports = Flipper;
