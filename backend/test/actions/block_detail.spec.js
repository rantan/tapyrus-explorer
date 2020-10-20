const supertest = require("supertest");
const assert = require('assert');
const app = require("../../server");
const cl = require("../../actions/block_detail");
const sinon = require('sinon');


  describe("GET /block/:blockHash return type check", function() {
    it("/block/:blockHash", function(done) {
      supertest(app)
        .get("/block/b9deaab16abe5f28967aebd0c6e94ce18c8309dec39816ea883885265b681f7c")
        .expect(200)
        .expect('Content-Type', /json/)
        .end( function(err, res){
          if (err) done(err);
          const block = JSON.parse(res.text);
  
          assert.ok( block.blockHash);
          assert.ok( block.ntx);
          assert.ok( block.height);
          assert.ok( block.sizeBytes);
          assert.ok( block.merkleRoot);
          assert.ok( block.immutableMerkleRoot);
          assert.ok( block.previousBlock);
          assert.ok( block.nextBlock);
          assert.ok( block.version);
          assert.ok( block.timestamp);
          assert.ok( block.proof);
  
          done();
        });
    });
  });
  
  describe("GET /block/:blockHash with sinon.stub", function() {
    beforeEach(() => {
      sinon.stub(cl, "getBlock")
        .withArgs("5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6")
        .resolves({
          hash: "5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6",
          size: 261,
          weight: 1044,
          height: 1236,
          features: 1,
          merkleroot: "39b95731fbae308d85743e2682988038980d7463ea2fc1b21f91860b243892e9",
          immutablemerkleroot: "d837966bc672b6459385989fdbfc049773f03fd355bb62c9765cdfa51e7a19a4",
          time: 1598253741,
          proof: "9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127",
          nTx: 1,
          previousblockhash: "471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805",
          nextblockhash: "e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57"
        });
    });
  
    it("/block/:blockHash", function(done) {
      supertest(app)
        .get("/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) done(err);
            
          const body = res.body;
          
          assert.strictEqual(body.blockHash, "5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6")
          assert.strictEqual(body.ntx, 1);
          assert.strictEqual(body.height, 1236);
          assert.strictEqual(body.timestamp, 1598253741);
          assert.strictEqual(body.proof, "9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127");
          assert.strictEqual(body.sizeBytes, 261);
          assert.strictEqual(body.version, 1);
          assert.strictEqual(body.merkleRoot, "39b95731fbae308d85743e2682988038980d7463ea2fc1b21f91860b243892e9");
          assert.strictEqual(body.immutableMerkleRoot, "d837966bc672b6459385989fdbfc049773f03fd355bb62c9765cdfa51e7a19a4");
          assert.strictEqual(body.previousBlock, "471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805");
          assert.strictEqual(body.nextBlock, "e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57");
        
          done();
        });
    });
  
    afterEach(function () {
      sinon.restore();
    });
  });
  
  
  describe("GET /block/:blockHash/raw return type check", function() {
    it("type check raw", function(done) {
      supertest(app)
        .get("/block/b9deaab16abe5f28967aebd0c6e94ce18c8309dec39816ea883885265b681f7c/raw")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) done(err);
          const rawBlock = JSON.parse(res.text);
  
          assert.ok(rawBlock);
          assert.notEqual(rawBlock.length, 0);
          assert.equal(typeof(rawBlock), "string");
          done();
        });
    });
  });
  
  
  describe("GET /block/:blockHash/raw with sinon.stub", function() {
    beforeEach(() => {
      sinon.stub(cl, "getBlock")
        .withArgs("5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6", 0)
        .resolves("0100000075adc0f804073eee1c74988e1e1bd83c85f987e34a95fd714813e379a724e85f97d679310470c26fdfaed7167075c7a8a1fa34d9c67be9c45c246281c15ffb231d0ef017e1b2147099d84709bcc0fbe89ef4d579fa8a95192ce89671765ec90459d4455f0040e7f72ce96424573b0d18f707333d02a2bc546491ba197c3af7b52d559eb55765d00a1e99d6ef4175ec4aae134c6b496a87c78d3a41ed77c7c2fd4ba684cd4abd01010000000100000000000000000000000000000000000000000000000000000000000000008a69000005028a690101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000");
    });
  
    it("/block/:blockHash/raw", function(done) {
      supertest(app)
        .get("/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6/raw")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) done(err);
          
          const body = res.body;
          assert.strictEqual(body, "0100000075adc0f804073eee1c74988e1e1bd83c85f987e34a95fd714813e379a724e85f97d679310470c26fdfaed7167075c7a8a1fa34d9c67be9c45c246281c15ffb231d0ef017e1b2147099d84709bcc0fbe89ef4d579fa8a95192ce89671765ec90459d4455f0040e7f72ce96424573b0d18f707333d02a2bc546491ba197c3af7b52d559eb55765d00a1e99d6ef4175ec4aae134c6b496a87c78d3a41ed77c7c2fd4ba684cd4abd01010000000100000000000000000000000000000000000000000000000000000000000000008a69000005028a690101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000")          
          done();
        });
    });
  
    afterEach(function () {
      sinon.restore();
    });
  });
  
  
  describe("GET /block/:blockHash/txns return type check", function() {
    it("/block/:blockHash/txns", function(done) {
      supertest(app)
        .get("/block/b9deaab16abe5f28967aebd0c6e94ce18c8309dec39816ea883885265b681f7c/txns")
        //.query({ perPage: '25', page: 1 })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) done(err);
          const block = JSON.parse(res.text);
          
          assert.ok( block.hash);
          assert.ok( block.confirmations);
          assert.ok( block.height);
          assert.ok( block.size);
          assert.ok( block.strippedsize);
          assert.ok( block.merkleroot);
          assert.ok( block.immutablemerkleroot);
          assert.ok( block.previousblockhash);
          assert.ok( block.nextblockhash);
          assert.ok( block.weight);
          assert.ok( block.features);
          assert.ok( block.featuresHex);
          assert.ok( block.time);
          assert.ok( block.mediantime);
          assert.ok( !block.xfieldType);
          assert.ok( block.proof);
          assert.ok( block.tx);
          assert.ok( block.nTx);
  
          const transaction = block.tx;  
  
          assert.equal(transaction.length, block.nTx);
  
          assert.ok( transaction[0].txid);
          assert.ok( transaction[0].hash);
          assert.ok( transaction[0].features);
          assert.ok( transaction[0].size);
          assert.ok( transaction[0].vsize);
          assert.ok( transaction[0].weight);
          assert.ok( !transaction[0].locktime);
          assert.ok( transaction[0].vin);
          assert.ok( transaction[0].vout);
          assert.ok( transaction[0].hex);
  
          done();
        });
    });
  });
  
  
  describe("GET /block/:blockHash/txns with sinon.stub", function() {
    beforeEach(() => {
      sinon.stub(cl, "getBlock")
        .withArgs("5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6", 2)
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
            tx: [{
                txid: 'aa43ba8e0381fb8bb63c032476a68fb9116882aaaa823c4b644a4055b39e2ab1',
                hash: 'a55def1b922ed0bcc35ca369e0dba226862fb0b29981c34f2a5735cb13b0a78e',
                features: 1,
                size: 90,
                vsize: 90,
                weight: 360,
                locktime: 0,
                vin: [ { coinbase: '02e3770101', sequence: 4294967295 } ],
                vout: [
                    {
                      value: 50,
                      n: 0,
                      scriptPubKey: {
                        asm: 'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG',
                        hex: '76a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac',
                        reqSigs: 1,
                        type: 'pubkeyhash',
                        addresses: [ '1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA' ]
                      }
                    }
                ],
                hex: '01000000010000000000000000000000000000000000000000000000000000000000000000e37700000502e3770101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000'
            }],
            time: 1598253741,
            mediantime: 1598111705,
            xfieldType: 0,
            proof: "9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127",
            nTx: 1,
            previousblockhash: "471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805",
            nextblockhash: "e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57"
          });
    });
  
    it("/block/:blockHash/txns", function(done) {
      supertest(app)
        .get("/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6/txns")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) done(err);
  
          const body = res.body;
          assert.strictEqual(body.hash, "5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6")
          assert.strictEqual(body.nTx, 1);
          assert.strictEqual(body.height, 1236);
          assert.strictEqual(body.time, 1598253741);
          assert.strictEqual(body.proof, "9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127");
          assert.strictEqual(body.size, 261);
          assert.strictEqual(body.features, 1);
          assert.strictEqual(body.merkleroot, "39b95731fbae308d85743e2682988038980d7463ea2fc1b21f91860b243892e9");
          assert.strictEqual(body.immutablemerkleroot, "d837966bc672b6459385989fdbfc049773f03fd355bb62c9765cdfa51e7a19a4");
          assert.strictEqual(body.previousblockhash, "471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805");
          assert.strictEqual(body.nextblockhash, "e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57");
          assert.strictEqual(body.featuresHex, "00000001");
          assert.strictEqual(body.weight, 1044);
          assert.strictEqual(body.strippedsize, 261);
          assert.strictEqual(body.mediantime, 1598111705);
          assert.strictEqual(body.xfieldType, 0);
          assert.strictEqual(body.confirmations, 1);

          assert.strictEqual(body.tx[0].txid, "aa43ba8e0381fb8bb63c032476a68fb9116882aaaa823c4b644a4055b39e2ab1")
          assert.strictEqual(body.tx[0].hash, "a55def1b922ed0bcc35ca369e0dba226862fb0b29981c34f2a5735cb13b0a78e");
          assert.strictEqual(body.tx[0].features, 1);
          assert.strictEqual(body.tx[0].size, 90);
          assert.strictEqual(body.tx[0].vsize, 90);
          assert.strictEqual(body.tx[0].weight, 360);
          assert.strictEqual(body.tx[0].locktime, 0);
          assert.strictEqual(body.tx[0].hex, "01000000010000000000000000000000000000000000000000000000000000000000000000e37700000502e3770101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000");
          
          
          assert.strictEqual(body.tx[0].vin[0].coinbase, "02e3770101");
          assert.strictEqual(body.tx[0].vin[0].sequence, 4294967295);

          assert.strictEqual(body.tx[0].vout[0].value, 50);
          assert.strictEqual(body.tx[0].vout[0].n, 0);
          assert.strictEqual(body.tx[0].vout[0].scriptPubKey.asm, "OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG");
          assert.strictEqual(body.tx[0].vout[0].scriptPubKey.hex, "76a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac");
          assert.strictEqual(body.tx[0].vout[0].scriptPubKey.reqSigs, 1);
          assert.strictEqual(body.tx[0].vout[0].scriptPubKey.type, "pubkeyhash");
          assert.strictEqual(body.tx[0].vout[0].scriptPubKey.addresses[0], "1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA");

          done();
        });
    });
  
    afterEach(function () {
      sinon.restore();
    });
  });