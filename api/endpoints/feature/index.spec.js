'use strict';

var expect = require('chai').expect;
var FeaturesAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Features endpoint', function() {

  describe('#list', function() {
    testApiMethod(FeaturesAPI, 'list').withArgs({}).shouldGetResultFromEndpoint('/features');
  });


  describe('#isEnabled', function() {
    testApiMethod(FeaturesAPI, 'isEnabled').withArgs({
      feature_id: '12'
    }).shouldGetResultFromEndpoint('/features/12');

    testApiMethod(FeaturesAPI, 'isEnabled').withArgs({}).shouldThrowMissingParameterError('feature_id');
  });

});
