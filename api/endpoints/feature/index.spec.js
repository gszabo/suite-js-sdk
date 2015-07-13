'use strict';

var FeatureAPI = require('./index');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Suite Service Feature', function() {
  var request;
  var feature;

  describe('#isEnabled', function() {

    describe('Feature enabled', function() {

      it('should check feature status with a Suite api call', function* () {
        requestPromiseRespondWith({ feature: { is_enabled: true } });
        var returnValue = yield feature.isEnabled(1, 'test');

        expect(request.get).to.have.been.calledWithMatch('/customers/1/features/test');
        expect(returnValue).to.eql(true);
      });

    });


    describe('Feature not enabled', function() {

      it('should check feature status with a Suite api call', function* () {
        requestPromiseRespondWith({ feature: { is_enabled: false } });
        var returnValue = yield feature.isEnabled(2, 'test');

        expect(request.get).to.have.been.calledWithMatch('/customers/2/features/test');
        expect(returnValue).to.eql(false);
      });

    });


    it('should log errors and return false', function* () {
      requestPromiseRejectWith(new Error('404'));
      var returnValue = yield feature.isEnabled(1, 'test');

      expect(request.get).to.have.been.calledWithMatch('/customers/1/features/test');
      expect(returnValue).to.eql(false);
    });
  });


  describe('#list', function() {

    it('should send a Suite api call', function* () {
      requestPromiseRespondWith({ features: [] });
      var returnValue = yield feature.list(1);

      expect(request.get).to.have.been.calledWith('/customers/1/features');
    });


    it('should return the array of enabled features for the given customer', function* () {
      var featureList = [{ id: '2', name: 'fancyFeatureName' }, { id: '3', name: 'anotherFancyFeatureName' }];
      requestPromiseRespondWith({ features: featureList });
      var returnValue = yield feature.list(1);

      expect(returnValue).to.eql(featureList);
    });


    describe('error', function() {

      it('should log errors and return false', function* () {
        requestPromiseRejectWith(new Error('404'));
        var returnValue = yield feature.list(1);

        expect(returnValue).to.eql(false);
      });
    });
  });


  var requestPromiseRespondWith = function(respObj) {
    var respPromise = new Promise(function(resolve) {
      resolve(respObj);
    });

    request = {
      get: sinon.stub().returns(respPromise),
      post: sinon.stub().returns(respPromise)
    };
    feature = new FeatureAPI(request);
  };


  var requestPromiseRejectWith = function(respObj) {
    var respPromise = new Promise(function(_, reject) {
      reject(respObj);
    });

    request = {
      get: sinon.stub().returns(respPromise)
    };
    feature = new FeatureAPI(request);
  };

});
