const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/block_list');
const electrs = require('../../libs/electrs');
const cl = require('../../libs/tapyrusd').client;

const sinon = require('sinon');

describe('GET /blocks and then call individual block using /block/:blockHash with stubbed electrs', function () {
  beforeEach(() => {
    sinon.stub(cl, 'getBlockCount').resolves(1);
    sinon
      .stub(cl, 'getBlock')
      .withArgs(
        'b9deaab16abe5f28967aebd0c6e94ce18c8309dec39816ea883885265b681f7c'
      )
      .resolves({
        blockHash:
          'b9deaab16abe5f28967aebd0c6e94ce18c8309dec39816ea883885265b681f7c',
        hash: 'b9deaab16abe5f28967aebd0c6e94ce18c8309dec39816ea883885265b681f7c'
      });
    sinon
      .stub(electrs.blockchain.block, 'header')
      .resolves(
        '0100000075adc0f804073eee1c74988e1e1bd83c85f987e34a95fd714813e379a724e85f97d679310470c26fdfaed7167075c7a8a1fa34d9c67be9c45c246281c15ffb231d0ef017e1b2147099d84709bcc0fbe89ef4d579fa8a95192ce89671765ec90459d4455f0040e7f72ce96424573b0d18f707333d02a2bc546491ba197c3af7b52d559eb55765d00a1e99d6ef4175ec4aae134c6b496a87c78d3a41ed77c7c2fd4ba684cd4abd'
      );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('/blocks', function (done) {
    supertest(app)
      .get('/blocks')
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        else {
          assert.equal(res.body.results.length, 2);
          supertest(app)
            .get(`/block/${res.body.results[0].hash}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) done(err);
              const body = res.body;
              assert.strictEqual(
                body.blockHash,
                'b9deaab16abe5f28967aebd0c6e94ce18c8309dec39816ea883885265b681f7c'
              );
              done();
            });
        }
      });
  });
});
