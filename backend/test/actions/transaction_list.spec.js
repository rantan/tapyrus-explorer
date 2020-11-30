const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/transaction_list');
const electrs = require('../../libs/electrs');
const cl = require('../../libs/tapyrusd').client;
const sinon = require('sinon');

describe('GET /transactions and then call individual transaction using /transaction/:txid', function () {
  beforeEach(() => {
    sinon.stub(cl, 'getChainTxStats').resolves({ txcount: 1 });
    sinon.stub(cl, 'getBlockCount').resolves(1);
    sinon.stub(cl, 'getRawMempool').resolves([]);
    sinon
      .stub(cl, 'getBlockHash')
      .resolves(
        'aa04f9cfceb4499d5df308c37b6c197a3a19439ba1893f214e5bf4a65ac3fcf5'
      );
    sinon.stub(cl, 'getBlock').resolves({
      hash: 'aa04f9cfceb4499d5df308c37b6c197a3a19439ba1893f214e5bf4a65ac3fcf5',
      confirmations: 10248,
      strippedsize: 262,
      size: 262,
      weight: 1048,
      height: 41794,
      features: 1,
      featuresHex: '00000001',
      merkleroot:
        '11fd6e5f137781b524db73dc644c739c9a7141991482215544198c699b7457a9',
      immutablemerkleroot:
        '8c74a12270ce0520d5def8d798e320d3922c01b5da294aaaa857876c7e4e846f',
      tx: ['8c74a12270ce0520d5def8d798e320d3922c01b5da294aaaa857876c7e4e846f'],
      time: 1603108230,
      mediantime: 1603104903,
      xfieldType: 0,
      proof:
        'a8487c83d1740373a2eab54571b730d75450db11702a4d5ff05c680d919b9f848cc344ac81540c0341733c28c8e26b1e10aa1b566e2d68615ae03281116fbcc8',
      nTx: 1,
      previousblockhash:
        'da9a38e33da2d01d70ea6f439ce48c28e4dbd603937f7bb429ec9871c3a9dbf7',
      nextblockhash:
        'e84148009b81c00688bd23d0eb01c9676589214996e5dc13aec328aff5102526'
    });
    sinon.stub(electrs.blockchain.transaction, 'get').resolves({
      txid: '8c74a12270ce0520d5def8d798e320d3922c01b5da294aaaa857876c7e4e846f',
      hash: '11fd6e5f137781b524db73dc644c739c9a7141991482215544198c699b7457a9',
      features: 1,
      size: 91,
      vsize: 91,
      weight: 364,
      locktime: 0,
      vin: [{ coinbase: '0342a3000101', sequence: 4294967295 }],
      vout: [
        {
          value: 50,
          n: 0,
          scriptPubKey: {
            asm:
              'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG',
            hex: 'ac667b7d8e87f9d06edca03bb88ac76a9146713b478d99432a',
            reqSigs: 1,
            type: 'pubkeyhash',
            addresses: ['1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA']
          }
        }
      ],
      hex:
        '0100000001000000000000000000000000000000000000000000000000000000000000000042a30000060342a3000101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000',
      blockhash:
        'aa04f9cfceb4499d5df308c37b6c197a3a19439ba1893f214e5bf4a65ac3fcf5',
      time: 1603108230,
      blocktime: 1603108230
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('/transactions', function (done) {
    this.timeout(5000);
    supertest(app)
      .get('/transactions')
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        else {
          assert.strictEqual(res.body.results.length, 1);
          supertest(app)
            .get(`/transaction/${res.body.results[0].txid}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) done(err);

              const transaction = res.body;
              assert.strictEqual(
                transaction.txid,
                '8c74a12270ce0520d5def8d798e320d3922c01b5da294aaaa857876c7e4e846f'
              );
              assert.strictEqual(
                transaction.hash,
                '11fd6e5f137781b524db73dc644c739c9a7141991482215544198c699b7457a9'
              );
              assert.strictEqual(transaction.features, 1);
              assert.strictEqual(transaction.size, 91);
              assert.strictEqual(transaction.vsize, 91);
              assert.strictEqual(transaction.weight, 364);
              assert.strictEqual(transaction.locktime, 0);
              assert.strictEqual(
                transaction.hex,
                '0100000001000000000000000000000000000000000000000000000000000000000000000042a30000060342a3000101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000'
              );
              assert.strictEqual(
                transaction.blockhash,
                'aa04f9cfceb4499d5df308c37b6c197a3a19439ba1893f214e5bf4a65ac3fcf5'
              );
              assert.strictEqual(transaction.time, 1603108230);
              assert.strictEqual(transaction.blocktime, 1603108230);

              assert.strictEqual(transaction.vin[0].coinbase, '0342a3000101');
              assert.strictEqual(transaction.vin[0].sequence, 4294967295);

              assert.strictEqual(transaction.vout[0].value, 50);
              assert.strictEqual(transaction.vout[0].n, 0);
              assert.strictEqual(
                transaction.vout[0].scriptPubKey.asm,
                'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG'
              );
              assert.strictEqual(
                transaction.vout[0].scriptPubKey.hex,
                'ac667b7d8e87f9d06edca03bb88ac76a9146713b478d99432a'
              );
              assert.strictEqual(transaction.vout[0].scriptPubKey.reqSigs, 1);
              assert.strictEqual(
                transaction.vout[0].scriptPubKey.type,
                'pubkeyhash'
              );
              assert.strictEqual(
                transaction.vout[0].scriptPubKey.addresses[0],
                '1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA'
              );
              done();
            });
        }
      });
  });
});
