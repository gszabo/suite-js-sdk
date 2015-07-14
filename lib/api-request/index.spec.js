'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var ApiRequest = require('./');
var SuiteRequest = require('escher-suiteapi-js');

describe('ApiRequest', function() {

  describe('#get', function() {

    var sendApiRequest = function(request) {
      return request.get(2, '/flippers/new_mediadb');
    };

    it('should call suite request\'s get', function(done) {
      var promiseRespond = { dummyData: 12 };

      var getApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'get', function() {
        return getPromiseResolvesWith(promiseRespond);
      });

      var request = new ApiRequest({});

      sendApiRequest(request).then(function(returnValue) {
        expect(getApiRequest).to.have.been.calledWith('/customers/2/flippers/new_mediadb');
        expect(returnValue).to.eql(promiseRespond);
      }).then(done).catch(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');

      sinon.sandbox.stub(SuiteRequest.prototype, 'get', function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new ApiRequest({});

      sendApiRequest(request).then(function() {
        throw new Error('Promise should be rejected');
      }).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });


    describe('with caching enabled', function() {
      var firstResponse;
      var secondResponse;

      var mockSuiteResponses = function() {
        sinon.sandbox.stub(SuiteRequest.prototype, 'get')
          .onFirstCall().returns(getPromiseResolvesWith(firstResponse))
          .onSecondCall().returns(getPromiseResolvesWith(secondResponse));
      };

      beforeEach(function() {
        firstResponse = { dummyData: 12 };
        secondResponse = { someNewData: 1 };
        mockSuiteResponses();
      });

      it('should return cached result after the first request', function(done) {
        var request = new ApiRequest({});
        request.setCache('someCacheId');

        sendApiRequest(request).then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);

          sendApiRequest(request).then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done).catch(done);
        }).catch(done);
      });


      it('should get response from cache for another request with the same cache id', function(done) {
        var request1 = new ApiRequest({});
        var request2 = new ApiRequest({});
        request1.setCache('someCacheId');
        request2.setCache('someCacheId');

        sendApiRequest(request1).then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);

          sendApiRequest(request2).then(function(returnValue) {
            expect(returnValue).to.eql(firstResponse);
          }).then(done);
        });
      });


      it('should get a new response for a request with another cache id', function(done) {
        var request1 = new ApiRequest({});
        var request2 = new ApiRequest({});
        request1.setCache('someCacheId1');
        request2.setCache('someCacheId2');

        sendApiRequest(request1).then(function(returnValue) {
          expect(returnValue).to.eql(firstResponse);

          sendApiRequest(request2).then(function(returnValue) {
            expect(returnValue).to.eql(secondResponse);
          }).then(done).catch(done);
        });
      });


    });
  });


  describe('#post', function() {

    it('should call suite request\'s post', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };

      var postApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'post', function() {
        return getPromiseResolvesWith(promiseRespond);
      });

      var request = new ApiRequest({});

      request.post(2, '/flippers/new_mediadb', sendData).then(function(returnValue) {
        expect(postApiRequest).to.have.been.calledWith('/customers/2/flippers/new_mediadb', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done).catch(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');

      var postApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'post', function() {
        return getPromiseRejectsWith(promiseError);
      });

      var request = new ApiRequest({});

      request.post(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

  });


  describe('#put', function() {

    it('should call suite request\'s put', function(done) {
      var promiseRespond = { dummyData: 12 };
      var sendData = { yo: 5 };

      var putApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'put', function() {
        return getPromiseResolvesWith(promiseRespond);
      });

      var request = new ApiRequest({});

      request.put(2, '/flippers/new_mediadb', sendData).then(function(returnValue) {
        expect(putApiRequest).to.have.been.calledWith('/customers/2/flippers/new_mediadb', sendData);
        expect(returnValue).to.eql(promiseRespond);
      }).then(done).catch(done);
    });


    it('should throw the sdk error if something went wrong', function(done) {
      var promiseError = new Error('yoError');
      var putApiRequest = sinon.sandbox.stub(SuiteRequest.prototype, 'put', function() {
        return getPromiseRejectsWith(promiseError);
      });
      var request = new ApiRequest({});

      request.put(2, '/administrator', {}).catch(function(error) {
        expect(error).to.equal(promiseError);
        done();
      });
    });

  });

  var getSuiteRequestResolvesWith = function(respObj) {
    var respPromise = getPromiseResolvesWith(respObj);

    return {
      get: sinon.stub().returns(respPromise),
      post: sinon.stub().returns(respPromise),
      put: sinon.stub().returns(respPromise)
    };
  };

  var getSuiteRequestRejectsWith = function(error) {
    var respPromise = getPromiseRejectsWith(error);

    return {
      get: sinon.stub().returns(respPromise),
      post: sinon.stub().returns(respPromise),
      put: sinon.stub().returns(respPromise)
    };
  };

  var getPromiseResolvesWith = function(respObj) {
    return new Promise(function(resolve) {
      resolve(respObj);
    });
  };

  var getPromiseRejectsWith = function(error) {
    return new Promise(function(resolve, rejects) {
      rejects(error);
    });
  };

});
