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
    return this._requireParameters(payload, ['flipper_id']).then(function() {
      logger.log('flipper_is_on');

      return this._request.get(
          this._getCustomerId(options),
          util.format('flippers/%s', payload.flipper_id),
          options
      );
    }.bind(this));
  }

});


Flipper.create = function(request, options) {
  return new Flipper(request, options);
};

module.exports = Flipper;
