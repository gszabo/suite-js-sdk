'use strict';

var logger = require('logentries-logformat')('suite-sdk');


var Feature = function(request) {
  this._request = request;
};

Feature.prototype = {

  isEnabled: function(customerId, featureId) {
    logger.log('feature_isOn');
    return this._request.get('/customers/' + customerId + '/features/' + featureId)
      .then(function(response) {
        return response.feature.is_enabled;
      }.bind(this))
      .catch(function(error) {
        logger.log('feature-error', { error: error, stack: error.stack });
        return false;
      });
  },

  list: function(customerId) {
    logger.log('feature_list');
    return this._request.get('/customers/' + customerId + '/features')
        .then(function(response) {
          return response.features;
        }.bind(this))
        .catch(function(error) {
          logger.log('feature-error', { error: error, stack: error.stack });
          return false;
        });
  }

};

Feature.create = function(request) {
  return new Feature(request);
};

module.exports = Feature;
