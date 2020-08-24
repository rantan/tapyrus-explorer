const sinon = require('sinon');
const request = require('supertest');
const assert = require('assert');

const { app, client } = require("../../actions/block_detail");

describe("GET /block", function() {
  beforeEach(() => {
    client.getBlock = sinon.stub()
      .withArgs("5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6")
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
        tx: ["d837966bc672b6459385989fdbfc049773f03fd355bb62c9765cdfa51e7a19a4"],
        time: 1598253741,
        mediantime: 1598111705,
        xfieldType: 0,
        proof: "9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127",
        nTx: 1,
        previousblockhash: "471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805",
        nextblockhash: "e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57"
      });
  });

  it("it should has status code 200", function(done) {
    request(app)
      .get("/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        else done();

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
      });
  });
});