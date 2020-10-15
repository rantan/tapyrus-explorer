/*const supertest = require("supertest");
const assert = require('assert');
const app = require("../server");
const {elect} = require("../actions/address_detail");

const sinon = require('sinon');

describe("GET /address return type check", function() {
  it("/address", function(done) {
    supertest(app)
      .get("/address/1EH5UTrkqwzy56tG8kSctVeTDHLkhjg7g")
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if (err) done(err);
        const addressResponse = JSON.parse(res.text);
        assert.ok(addressResponse[0]);
        assert.ok(addressResponse[1]);
        assert.ok(addressResponse[2]);
        assert.ok(addressResponse[3]);
        
        assert.equal(typeof(addressResponse[0]), "number");
        assert.ok(Array.isArray(addressResponse[1]));
        assert.ok(Array.isArray(addressResponse[2]));
        assert.equal(typeof(addressResponse[3]), "number");

        done();
      });
  });
});


describe("GET /address with sinon.stub", function() {
  beforeEach(() => {
    elect.request = sinon.stub()
      .withArgs("38bf47ffa420b5ff50a3ca04411a4f4b3c7f6ea63a47732674501ab67776d923")  
      .resolves({
        "result" : [{
        height: 27462,
        tx_hash: '6cd60b45109d26cece6fd2907efefc906dec12b821b0abe3283af750b1c0ed9c'
      }]}); 
  });

  it("/address", function(done) {
    supertest(app)
      .get("/address/1AX2nLM8dnZH3g5tT2hDAJ4Y3UiYwqkHNX")
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if (err) done(err);

        const trasactionsDetails = res.body[1];
        
        assert.strictEqual(trasactionsDetails[0].txid, "6cd60b45109d26cece6fd2907efefc906dec12b821b0abe3283af750b1c0ed9c")
        assert.strictEqual(trasactionsDetails[0].time, 1598547718);
        assert.strictEqual(trasactionsDetails[0].timereceived, 1598547718);
        assert.strictEqual(trasactionsDetails[0].blocktime, 1598547802);
        assert.strictEqual(trasactionsDetails[0].amount, 0);
        assert.strictEqual(trasactionsDetails[0].fee, -0.0000744);
        assert.strictEqual(trasactionsDetails[0].comment, '“”');
        assert.strictEqual(trasactionsDetails[0].to, '“”');
        assert.strictEqual(trasactionsDetails[0].blockheight, 27462);
        assert.strictEqual(trasactionsDetails[0].blockhash, "1df5b085dedd843feb307da7ab4239a950d6730ecdf4f5b3c221a89ddb16a62d");
        assert.strictEqual(trasactionsDetails[0].blockindex, 1);
        assert.strictEqual(trasactionsDetails[0].hex, "01000000029808d8270264dbe2290155ca4c1a6a134c2ef31588233fe0daf425c6fa4ecd6b000000006a473044022037f1342daf4fd0b8dca5ffd5d7c27ac388d0887944cdfabefb345dcf085d5b8f0220772fd221814c9e7ea6f5aaef0e90a3fcf332869fb5f91ea928e7801e302a0a0a0121039a8ffa5d931f8293076570888e3157f75e22f73b8c0d20ca12c4caf044539f81feffffff9808d8270264dbe2290155ca4c1a6a134c2ef31588233fe0daf425c6fa4ecd6b010000006a47304402200e9c3924f91bf5b88649d9e572d5e4b5abf518c96e615b52504e9fb983e52bb902207a2cd5a56daeff7d588ff985982fe5727ce08825ace80d4771d41c6cf70666580121026544bc70c6fb82b9d1607c63fc087b4c702fdf029f73343bf4f70cb37de64e57feffffff0260411300000000001976a914299d1bf125c43c042e92571409b38052be85c9bb88ac20a10700000000001976a9146867191ea00a741f846e712670d4006000ab33b788ac456b0000");
        assert.strictEqual(trasactionsDetails[0].walletconflicts.length, 0);

        done();
      });
  });

  afterEach(function () {
    sinon.restore();
  });
});*/