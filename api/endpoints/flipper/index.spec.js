'use strict';

var expect = require('chai').expect;
var FlippersAPI = require('./');
var testApiMethod = require('../_test');

describe('SuiteAPI Services endpoint', function() {

  describe('#isOn', function() {
    testApiMethod(FlippersAPI, 'isOn').withArgs({
      flipper_id: '12'
    }).shouldGetResultFromEndpoint('/flippers/12');

    testApiMethod(FlippersAPI, 'isOn').withArgs({}).shouldThrowMissingParameterError('flipper_id');
  });

});
