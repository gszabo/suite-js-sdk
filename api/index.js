'use strict';

var SuiteRequest = require('escher-suiteapi-js');
var SuiteRequestOptions = SuiteRequest.Options;
var ServiceRequest = require('../lib/service-api-request');
var ApiRequest = require('./../lib/api-request');
var FlipperAPI = require('./endpoints/flipper');
var KeyPool = require('escher-keypool');
var _ = require('lodash');

var config = require('../config');

var SuiteAPI = function(options) {
  options = this._mergeWithDefaultOptions(options);
  this._apiRequest = ApiRequest.create(options);
  this._serviceRequest = this._createServiceRequest(options);

  this.flipper = FlipperAPI.create(this._serviceRequest);

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


  _createServiceRequest: function(options) {
    var requestOptions = SuiteRequestOptions.createForServiceApi(options.environment, options.rejectUnauthorized);
    var suiteRequest = SuiteRequest.create(options.apiKey, options.apiSecret, requestOptions);
    console.log('suiteRequest', suiteRequest);
    return ServiceRequest.create(suiteRequest);
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
module.exports.SuiteRequestError = SuiteRequest.Error;
