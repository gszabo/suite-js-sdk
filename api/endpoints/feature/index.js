'use strict';

var util = require('util');
var _ = require('lodash');
var logger = require('logentries-logformat')('suite-sdk');

var Base = require('../_base');

var Feature = function(request, options) {
  Base.call(this, options);
  this._request = request;
};

util.inherits(Feature, Base);

_.extend(Feature.prototype, {

  list: function(payload, options) {
    logger.log('feature_list');

    return this._request.get(
        this._getCustomerId(options),
        util.format('/features'),
        options
    );
  },


  isEnabled: function(payload, options) {
    return this._requireParameters(payload, ['feature_id']).then(function() {
      logger.log('feature_is_enabled');

      return this._request.get(
          this._getCustomerId(options),
          util.format('/features/%s', payload.feature_id),
          options
      );
    }.bind(this));
  }

});


Feature.create = function(request, options) {
  return new Feature(request, options);
};

module.exports = Feature;
