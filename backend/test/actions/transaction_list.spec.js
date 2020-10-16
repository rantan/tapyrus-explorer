const supertest = require("supertest");
const assert = require('assert');
const app = require("../../server");
const cl = require("../../actions/transaction_list");
const sinon = require('sinon');


describe("GET /transactions return type check", function() {
  it("/transactions", function(done) {
    supertest(app)
      .get("/transactions")
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if (err) done(err);
        const transactions = (JSON.parse(res.text)).results;
        assert.equal( transactions.length,  25);

        assert.ok( transactions[0].txid);
        assert.ok( transactions[0].hash);
        assert.ok( transactions[0].features);
        assert.ok( transactions[0].size);
        assert.ok( transactions[0].vsize);
        assert.ok( transactions[0].weight);
        assert.ok( !transactions[0].locktime);
        assert.ok( transactions[0].vin);
        assert.ok( transactions[0].vout);
        assert.ok( transactions[0].hex);
        assert.ok( transactions[0].blockhash);
        assert.ok( transactions[0].confirmations);
        assert.ok( transactions[0].time);
        assert.ok( transactions[0].blocktime);
        assert.ok( transactions[0].amount);

        done();
      });
  });
});


describe("GET /transactions and then call individual transaction using /transaction/:txid", function() {
  beforeEach(() => {
    
    sinon.stub(cl, "getBlock")
      .resolves({
        hash: "5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6",
        confirmations: 1,
        strippedsize: 261,
        size: 261,
        weight: 1044,
        height: 1236,
        features: 1,
        featuresHex: "00000001",
        merkleroot: "39b95731fbae308d85743e2682988038980d7463ea2fc1b21f91860b243892e9",
        immutablemerkleroot: "d837966bc672b6459385989fdbfc049773f03fd355bb62c9765cdfa51e7a19a4",
        tx: [
            'aa43ba8e0381fb8bb63c032476a68fb9116882aaaa823c4b644a4055b39e2ab1'
        ],
        time: 1598253741,
        mediantime: 1598111705,
        xfieldType: 0,
        proof: "9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127",
        nTx: 1,
        previousblockhash: "471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805",
        nextblockhash: "e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57"
      }); 
  });

  it("/transactions", function(done) {
    supertest(app)
      .get("/transactions")
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if (err) done(err);
        else {
          assert.equal(res.body.results.length,  25);
          supertest(app)
          .get(`/transaction/${res.body.results[0].txid}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
            if (err) done(err);
            
            const transaction = res.body;
            assert.strictEqual(transaction.txid, "aa43ba8e0381fb8bb63c032476a68fb9116882aaaa823c4b644a4055b39e2ab1");
            assert.strictEqual(transaction.hash, "a55def1b922ed0bcc35ca369e0dba226862fb0b29981c34f2a5735cb13b0a78e");
            assert.strictEqual(transaction.features, 1);
            assert.strictEqual(transaction.size, 90);
            assert.strictEqual(transaction.vsize, 90);
            assert.strictEqual(transaction.weight, 360);
            assert.strictEqual(transaction.locktime, 0);
            assert.strictEqual(transaction.hex, "01000000010000000000000000000000000000000000000000000000000000000000000000e37700000502e3770101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000");
            assert.strictEqual(transaction.blockhash, "2b3e4a0c0da2b6700d8fcb2349412b786e93849d75cdc0cab202bfeeb30c0596");
            assert.strictEqual(transaction.time, 1599509728);
            assert.strictEqual(transaction.blocktime, 1599509728);
            
            assert.strictEqual(transaction.vin[0].coinbase, "02e3770101");
            assert.strictEqual(transaction.vin[0].sequence, 4294967295);
  
            assert.strictEqual(transaction.vout[0].value, 50);
            assert.strictEqual(transaction.vout[0].n, 0);
            assert.strictEqual(transaction.vout[0].scriptPubKey.asm, "OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG");
            assert.strictEqual(transaction.vout[0].scriptPubKey.hex, "76a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac");
            assert.strictEqual(transaction.vout[0].scriptPubKey.reqSigs, 1);
            assert.strictEqual(transaction.vout[0].scriptPubKey.type, "pubkeyhash");
            assert.strictEqual(transaction.vout[0].scriptPubKey.addresses[0], "1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA");
  
            done();
          });  
        }
      });
  });

  afterEach(function () {
    sinon.restore();
  });
});