'use strict';

var SuiteRequest = require('escher-suiteapi-js');
var SuiteAPI = require('./');
var Request = require('./../lib/api-request');
var expect = require('chai').expect;
var SuiteRequestOptions = SuiteRequest.Options;

var config = require('../config');

describe('SuiteApi', function() {


  describe('#create', function() {
    var stubRequestCreation;

    beforeEach(function() {
      stubRequestCreation = (function() {
        this.sandbox.stub(SuiteRequest, 'create');
        this.sandbox.stub(Request, 'create');
        this.sandbox.stub(SuiteRequestOptions, 'createForInternalApi').returns('SuiteRequestOptionsStub');
        this.sandbox.stub(SuiteRequestOptions, 'createForServiceApi').returns('SuiteServiceRequestOptionsStub');
      }).bind(this);
    });


    it('should return a new instance of an API with the given environment and key data', function() {
      stubRequestCreation();
      var options = { environment: 'environment', apiKey: 'apiKey', apiSecret: 'apiSecret', rejectUnauthorized: true };
      SuiteAPI.create(options);
      expect(Request.create).to.have.been.calledWith(options);
    });


    describe('environment and key data is not provided', function() {

      describe('keypool provided but api key and api secret not', function() {

        it('should return a new instance with configuration from key pool', function() {
          this.sandbox.stub(config.suiteApi, 'environment', 'environmentFromEnv');
          this.sandbox.stub(config.suiteApi, 'rejectUnauthorized', 'false');
          this.sandbox.stub(config.suiteApi, 'keyPool', JSON.stringify([{ keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 }]));

          stubRequestCreation();

          SuiteAPI.create();

          expect(Request.create).to.have.been.calledWith({
            apiKey: 'suite_ums_v1',
            apiSecret: '<Y>',
            environment: 'environmentFromEnv',
            rejectUnauthorized: false
          });
        });


        it('should return a new instance with configuration from key pool for the given scope if scope environment variable exists', function() {
          this.sandbox.stub(config.suiteApi, 'environment', 'environmentFromEnv');
          this.sandbox.stub(config.suiteApi, 'rejectUnauthorized', 'false');
          this.sandbox.stub(config.suiteApi, 'keyPool', JSON.stringify([
            { keyId: 'suite_ums_v1', secret: '<Y>', acceptOnly: 0 },
            { keyId: 'suite_noc_v1', secret: '<Y>', acceptOnly: 0 }
          ]));
          this.sandbox.stub(config.suiteApi, 'keyId', 'suite_noc');

          stubRequestCreation();

          SuiteAPI.create();

          expect(Request.create).to.have.been.calledWith({
            apiKey: 'suite_noc_v1',
            apiSecret: '<Y>',
            environment: 'environmentFromEnv',
            rejectUnauthorized: false
          });
        });

      });


      it('should return a new instance with configuration from env variables', function() {
        this.sandbox.stub(config.suiteApi, 'environment', 'environmentFromEnv');
        this.sandbox.stub(config.suiteApi, 'rejectUnauthorized', 'false');
        this.sandbox.stub(config.suiteApi, 'apiKey', 'apiKeyFromEnv');
        this.sandbox.stub(config.suiteApi, 'apiSecret', 'apiSecretFromEnv');

        stubRequestCreation();

        var api = SuiteAPI.create();

        expect(Request.create).to.have.been.calledWith({
          apiKey: 'apiKeyFromEnv',
          apiSecret: 'apiSecretFromEnv',
          environment: 'environmentFromEnv',
          rejectUnauthorized: false
        });

        expect(api).to.be.ok;
      });

    });

    describe('environment is not provided from any source', function() {

      it('should return a new instance with API proxy', function() {
        this.sandbox.stub(config.suiteApi, 'apiKey', 'apiKeyFromEnv');
        this.sandbox.stub(config.suiteApi, 'apiSecret', 'apiSecretFromEnv');

        stubRequestCreation();

        SuiteAPI.create();

        expect(Request.create).to.have.been.calledWith({
          apiKey: 'apiKeyFromEnv',
          apiSecret: 'apiSecretFromEnv',
          environment: 'api.emarsys.net',
          rejectUnauthorized: true
        });
      });

    });

  });



  describe('endpoints', function() {

    var fakeRequest;
    var sdk;
    var apiKey;
    var apiSecret;
    var environment;
    var options;

    beforeEach(function() {
      apiKey = 'apikey';
      apiSecret = 'apiSecret';
      environment = 'environment';

      options = {
        apiKey: apiKey,
        apiSecret: apiSecret,
        environment: environment,
        rejectUnauthorized: false
      };

      var suiteRequestStub = this.sandbox.stub(SuiteRequest, 'create');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteRequestOptionsStub').returns('SuiteRequestStub');
      suiteRequestStub.withArgs(apiKey, apiSecret, 'SuiteServiceRequestOptionsStub').returns('SuiteServiceRequestStub');
      fakeRequest = { id: 'fakeRequestFrom' };
      this.sandbox.stub(Request, 'create').withArgs(options).returns(fakeRequest);
      sdk = SuiteAPI.create(options);
    });


  });



});
