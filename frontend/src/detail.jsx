import React from 'react';
import axios from 'axios';
import './index.css';
import {
  Link,
} from 'react-router-dom';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      blockHash: 'hash',
      ntx: 'ntx',
      height: 'height',
      timestamp: 'time',
      proof: 'nonce',
      sizeBytes: 'size',
      version: 'version',
      merkleRoot: 'merkleRoot',
      tx: 'tx',
      immutableMerkleRoot: 'immutable',
      previousBlock: 'previousblockhash',
      nextBlock: 'nextblockhash',
    };
  }

  componentDidMount() {
    this.getBlockInfo();
  }

  async getBlockInfo() {
    const url = window.location.href.split('/');
    const blockHashUrl = url[url.length - 1];

    const result = await axios.get(`${'http://localhost:3001/api/block'}/${blockHashUrl}`);
    this.setState({
      blockHash: result.data.blockHash,
      ntx: result.data.ntx,
      height: result.data.height,
      timestamp: result.data.timestamp,
      proof: result.data.proof,
      sizeBytes: result.data.sizeBytes,
      version: result.data.version,
      merkleRoot: result.data.merkleRoot,
      tx: result.data.tx,
      immutableMerkleRoot: 'immutable',
      previousBlock: result.data.previousBlock,
      nextBlock: result.data.nextBlock,
    });
  }

  render() {
    const {
      blockHash, ntx, height, timestamp, proof, sizeBytes, version,
      merkleRoot, tx, immutableMerkleRoot, previousBlock, nextBlock,
    } = this.state;

    const pretender = new Array(ntx);
    for (let i = 0; i < ntx; i += 1) {
      pretender[i] = tx[i];
    }

    const list = pretender.map((i) => {
      const {
        txid, vin, vout,
      } = i;
      if (vin != null) {
        console.dir(vout);
        return (
          <tr>
            <td>{txid}</td>

            <td>
              {vin.map((j) => (
                <div>{j.txid == null ? 'coinbase' : j.txid}</div>
              ))}
            </td>

            <td>
              {vout.map((j) => (
                <div>{j.scriptPubKey.addresses}</div>
              ))}
            </td>

          </tr>
        );
      }
    });

    return (
      <div className="App">
        <p>
          <h2>
BLOCK #
            {height}
            <button type="button">Raw Data</button>
          </h2>
          <h5>
BLOCKHASH :
            {blockHash}
          </h5>
          <table>
            <tbody>
              <tr>
                <td>
                  {' '}
No. of Transaction :
                  {ntx}
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
HEIGHT :
                  {height}
                </td>
              </tr>
              <tr>
                <td>
TIME :
                  {timestamp}
                </td>
              </tr>
              <tr>
                <td>
PROOF :
                  {proof}
                </td>
              </tr>
              <tr>
                <td>
SIZE :
                  {sizeBytes}
                </td>
              </tr>
              <tr>
                <td>
VERSION :
                  {version}
                </td>
              </tr>
              <tr>
                <td>
MERKLEROOT :
                  {merkleRoot}
                </td>
              </tr>
              <tr>
                <td>
IMMUTABLEMERKLEROOT :
                  {immutableMerkleRoot}
                </td>
              </tr>
              <tr>
                <td>
PREVIOUSBLOCK :
                  {previousBlock}
                </td>
              </tr>
              <tr>
                <td>
NEXT BLOCK :
                  {nextBlock}
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button">
            {/* <Link to="/tx/$txid">View All Transactions</Link> */}
            View All Transactions
          </button>

          <table>
            <tbody>
              <td>TXID</td>
              <td>input txid(input address)</td>
              <td>output address</td>
              {list}
            </tbody>
          </table>

        </p>
      </div>
    );
  }
}

export default App;
