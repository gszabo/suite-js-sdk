'use strict';

var SuiteRequest = require('escher-suiteapi-js');
var SuiteRequestOptions = SuiteRequest.Options;
var ApiRequest = require('./../lib/api-request');
var FlipperAPI = require('./endpoints/flipper');
var FeatureAPI = require('./endpoints/feature');
var KeyPool = require('escher-keypool');
var _ = require('lodash');

var config = require('../config');

var SuiteAPI = function(options) {
  options = this._mergeWithDefaultOptions(options);
  this._apiRequest = ApiRequest.create(options);

  this.flipper = FlipperAPI.create(this._apiRequest, options);
  this.feature = FeatureAPI.create(this._apiRequest, options);

  this.environment = options.environment;
};


SuiteAPI.prototype = {

  setCache: function(cacheId) {
    this._apiRequest.setCache(cacheId);
  },


  _mergeWithDefaultOptions: function(options) {
    return _.extend({}, this._apiKeySecret(), {
      environment: config.suiteApi.environment || config.API_PROXY_URL,
      rejectUnauthorized: config.suiteApi.rejectUnauthorized !== 'false'
    }, options);
  },


  _apiKeySecret: function() {
    var apiKey = config.suiteApi.apiKey;
    var apiSecret = config.suiteApi.apiSecret;

    if (apiSecret && apiKey) return { apiKey: apiKey, apiSecret: apiSecret };
    if (config.suiteApi.keyPool) return this._apiKeySecretFromKeyPool();

    return { apiKey: undefined, apiSecret: undefined };
  },


  _apiKeySecretFromKeyPool: function() {
    var fromKeyPool = new KeyPool(config.suiteApi.keyPool).getActiveKey(config.suiteApi.keyId);

    return {
      apiKey: fromKeyPool.keyId,
      apiSecret: fromKeyPool.secret
    };
  }


};


SuiteAPI.create = function(options) {
  return new SuiteAPI(options);
};


SuiteAPI.createWithCache = function(cacheId, options) {
  var api = SuiteAPI.create(options);
  api.setCache(cacheId);
  return api;
};



module.exports = SuiteAPI;
module.exports.Flipper = FlipperAPI;
module.exports.Feature = FeatureAPI;
module.exports.SuiteRequestError = SuiteRequest.Error;
